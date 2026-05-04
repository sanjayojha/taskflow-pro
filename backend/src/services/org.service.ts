import { User } from "../models/User";
import { Organization } from "../models/Organization";
import { OrgMember, OrgMemberRole } from "../models/OrgMember";
import { CreateOrgInput, InviteMemberInput, UpdateMemberRoleInput, UpdateOrgInput } from "../schemas/org.schema";
import { generateSlug, generateUniqueSlug } from "../utils/slug";
import crypto from "node:crypto";
import { AppError } from "../middlewares/errorHandler";
import { Op } from "sequelize";
import { paginate } from "../utils/pagination";
import { emailQueue } from "../queues/emailQueue";

// -- List user's org ---
export const getUserOrgs = async (userId: string) => {
    const memberShips = await OrgMember.findAll({
        where: { userId },
        include: [
            {
                model: Organization,
                include: [
                    {
                        model: User,
                        as: "owner",
                        attributes: ["id", "name", "email"],
                    },
                ],
                order: [["joinedAt", "DESC"]],
            },
        ],
    });

    return memberShips.map((m) => ({
        ...m.organization.toJSON(),
        myRole: m.role,
    }));
};

// -- Create Org ---
export const createOrg = async (userId: string, input: CreateOrgInput) => {
    let slug = generateSlug(input.name);
    const slugExists = await Organization.findOne({ where: { slug } });
    if (slugExists) {
        slug = generateUniqueSlug(input.name, crypto.randomBytes(3).toString("hex"));
    }

    const org = await Organization.create({
        name: input.name,
        slug,
        ownerId: userId,
    });

    await OrgMember.create({
        orgId: org.id,
        userId,
        role: OrgMemberRole.OWNER,
    });

    return org;
};

// -- get single org ---
export const getOrgById = async (orgId: string) => {
    const org = await Organization.findByPk(orgId, {
        include: [
            {
                model: User,
                as: "owner",
                attributes: ["id", "name", "email", "avatarUrl"],
            },
        ],
    });

    if (!org) {
        throw new AppError("Organization not found", 404);
    }

    const memberCount = await OrgMember.count({ where: { orgId: org.id } });

    return { ...org.toJSON(), memberCount };
};

// -- update org ---
export const updateOrg = async (orgId: string, input: UpdateOrgInput) => {
    const org = await Organization.findByPk(orgId);

    if (!org) {
        throw new AppError("Organization not found", 404);
    }

    if (input.name && input.name !== org.name) {
        let slug = generateSlug(input.name);
        const existing = await Organization.findOne({
            where: { slug, id: { [Op.ne]: orgId } },
        });
        if (existing) {
            slug = generateUniqueSlug(input.name, crypto.randomBytes(3).toString("hex"));
        }

        await org.update({ name: input.name, slug });
    }

    if (input.plan) {
        await org.update({ plan: input.plan });
    }

    return org.reload();
};

// -- Delete org ---
export const deleteOrg = async (orgId: string, requestingUserId: string) => {
    const org = await Organization.findByPk(orgId);

    if (!org) {
        throw new AppError("Organization not found", 404);
    }

    if (org.ownerId !== requestingUserId) {
        throw new AppError("Only the organization owner can delete it", 403);
    }

    org.destroy();
};

// -- list members ---
export const getOrgMembers = async (orgId: string, query: { page?: number; limit?: number }) => {
    const page = Math.max(1, query.page || 1);
    const limit = Math.min(100, query.limit || 20);
    const offset = (page - 1) * limit;

    const { rows, count } = await OrgMember.findAndCountAll({
        where: { orgId },
        include: [
            {
                model: User,
                attributes: ["id", "name", "email", "avatarUrl", "isVerified"],
            },
        ],
        limit,
        offset,
        order: [["joinedAt", "ASC"]],
    });

    return paginate(rows, count, { page, limit, offset });
};

// -- Invite Member ---
export const inviteMember = async (orgId: string, inviterId: string, input: InviteMemberInput) => {
    const org = await Organization.findByPk(orgId);

    if (!org) {
        throw new AppError("Organization not found", 404);
    }

    const inviter = await User.findByPk(inviterId, {
        attributes: ["id", "name", "email"],
    });

    if (!inviter) {
        throw new AppError("Inviter not found", 404);
    }

    const invitee = await User.findOne({ where: { email: input.email } });

    if (invitee) {
        // Check if already a member
        const exisitingMember = await OrgMember.findOne({ where: { orgId, userId: invitee.id } });
        if (exisitingMember) {
            throw new AppError("This user is already a member of the organization", 409);
        }

        // Add directly as member
        await OrgMember.create({
            orgId,
            userId: invitee.id,
            role: input.role,
        });
    }

    // invite token

    const rawToken = crypto.randomBytes(32).toString("hex");

    await emailQueue.add("org-invite", {
        type: "ORG_INVITE",
        to: input.email,
        inviterName: inviter.name,
        orgName: org.name,
        token: rawToken,
    });

    return { message: invitee ? "User added to organization and notified by email" : "Invitation email sent" };
};

// -- update member role ---
export const updateMemberRole = async (orgId: string, targetUserId: string, requestingMember: OrgMember, input: UpdateMemberRoleInput) => {
    const org = await Organization.findByPk(orgId);
    if (!org) {
        throw new AppError("Organization not found", 404);
    }

    if (org.ownerId === targetUserId || requestingMember.userId === targetUserId) {
        throw new AppError("Cannot change the owner's role", 403);
    }

    const targetMember = await OrgMember.findOne({
        where: { orgId, userId: targetUserId },
    });

    if (!targetMember) {
        throw new AppError("Member not found in this organization", 404);
    }

    await targetMember.update({ role: input.role });
    return targetMember.reload({ include: { model: User, attributes: ["id", "name", "email"] } });
};

// -- remove member ---
export const removeMember = async (orgId: string, targetUserId: string, requestingMember: OrgMember) => {
    const org = await Organization.findByPk(orgId);
    if (!org) {
        throw new AppError("Organization not found", 404);
    }

    if (org.ownerId === targetUserId) {
        throw new AppError("The organization owner cannot be removed", 403);
    }

    const isSelf = requestingMember.userId === targetUserId;
    const canRemoveOthers = requestingMember.role === OrgMemberRole.OWNER || requestingMember.role === OrgMemberRole.ADMIN;

    if (!canRemoveOthers && !isSelf) {
        throw new AppError("You do not have permission to remove this member", 403);
    }

    const targetMember = await OrgMember.findOne({
        where: { orgId, userId: targetUserId },
    });

    if (!targetMember) {
        throw new AppError("Member not found in this organization", 404);
    }

    targetMember.destroy();
};
