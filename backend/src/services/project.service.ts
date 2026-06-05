import { User } from "../models/User";
import { Project, ProjectStatus } from "../models/Project";
import { Op } from "sequelize";
import { ProjectMember, ProjectMemberRole } from "../models/ProjectMember";
import { Task } from "../models/Task";
import { OrgMember } from "../models/OrgMember";
import { paginate } from "../utils/pagination";
import { AddProjectMemberInput, CreateProjectInput, UpdateProjectInput, UpdateProjectMemberRoleInput } from "../schemas/project.schema";
import { AppError } from "../middlewares/errorHandler";

// -- List projects in org --
export const getOrgProjects = async (
    orgId: string,
    userId: string,
    query: {
        page?: number;
        limit?: number;
        status?: string;
        search?: string;
    },
) => {
    const page = Math.max(1, query.page || 1);
    const limit = Math.min(100, query.limit || 20);
    const offset = (page - 1) * limit;

    //build where clause
    const where: Record<string, unknown> = { orgId };
    if (query.status) {
        where.status = query.status;
    }

    if (query.search) {
        where.name = { [Op.iLike]: `%${query.search}%` };
    }

    const { rows, count } = await Project.findAndCountAll({
        where,
        include: [
            {
                model: User,
                as: "creator",
                attributes: ["id", "name", "avatarUrl"],
            },
            {
                model: ProjectMember,
                include: [{ model: User, attributes: ["id", "name", "avatarUrl"] }],
                limit: 5, //include first 5 members for the list preview
            },
        ],
        limit,
        offset,
        order: [["createdAt", "DESC"]],
        distinct: true, //needed when using include with limit
    });

    //attach task counts per project
    const projectIds = rows.map((p) => p.id);
    const taskCounts = (await Task.findAll({
        where: { projectId: { [Op.in]: projectIds } },
        attributes: ["projectId", "status", [Task.sequelize!.fn("COUNT", Task.sequelize!.col("id")), "count"]],
        group: ["projectId", "status"],
        raw: true,
    })) as unknown as Array<{ projectId: string; status: string; count: string }>;

    // map task count onto each project
    const projectsWithCounts = rows.map((project) => {
        const counts = taskCounts.filter((t) => t.projectId === project.id);
        const taskSummary = {
            total: counts.reduce((sum, c) => sum + parseInt(c.count), 0),
            done: parseInt(counts.find((c) => c.status === "done")?.count || "0"),
        };
        return { ...project.toJSON(), taskSummary };
    });

    return paginate(projectsWithCounts, count, { page, limit, offset });
};

// -- Create project --
export const createProject = async (orgId: string, userId: string, input: CreateProjectInput) => {
    const project = await Project.create({
        orgId,
        name: input.name,
        description: input.description,
        deadline: input.deadline,
        createdBy: userId,
        status: ProjectStatus.ACTIVE,
    });

    await ProjectMember.create({
        projectId: project.id,
        userId,
        role: ProjectMemberRole.MANAGER,
    });

    return project;
};

// -- Get single project--
export const getProjectById = async (projectId: string, userId: string) => {
    const project = await Project.findByPk(projectId, {
        include: [
            {
                model: User,
                as: "creator",
                attributes: ["id", "name", "avatarUrl"],
            },
            {
                model: ProjectMember,
                include: [{ model: User, attributes: ["id", "name", "avatarUrl"] }],
            },
        ],
    });

    if (!project) {
        throw new AppError("Project not found", 404);
    }

    const taskCounts = (await Task.findAll({
        where: { projectId },
        attributes: ["status", [Task.sequelize!.fn("COUNT", Task.sequelize!.col("id")), "count"]],
        group: ["status"],
        raw: true,
    })) as unknown as Array<{ status: string; count: string }>;

    const taskSummary = {
        total: taskCounts.reduce((sum, c) => sum + parseInt(c.count || "0"), 0),
        backlog: parseInt(taskCounts.find((c) => c.status === "backlog")?.count || "0"),
        inProgress: parseInt(taskCounts.find((c) => c.status === "in_progress")?.count || "0"),
        review: parseInt(taskCounts.find((c) => c.status === "review")?.count || "0"),
        done: parseInt(taskCounts.find((c) => c.status === "done")?.count || "0"),
    };

    const membershipRole = await ProjectMember.findOne({
        where: { projectId, userId },
    });

    return {
        ...project.toJSON(),
        taskSummary,
        myRole: membershipRole?.role || null,
    };
};

// -- Update project --
export const updateProject = async (projectId: string, input: UpdateProjectInput) => {
    const project = await Project.findByPk(projectId);

    if (!project) {
        throw new AppError("Project not found", 404);
    }

    await project.update({
        ...(input.name && { name: input.name }),
        ...(input.description !== undefined && { description: input.description }),
        ...(input.status && { status: input.status as ProjectStatus }),
        ...(input.deadline !== undefined && { deadline: input.deadline }),
    });

    return project.reload();
};

// -- Delete project --
export const deleteProject = async (projectId: string) => {
    const project = await Project.findByPk(projectId);

    if (!project) {
        throw new AppError("Project not found", 404);
    }
    await project.destroy();
};

// -- List project members --
export const getProjectMembers = async (projectId: string) => {
    const members = await ProjectMember.findAll({
        where: { projectId },
        include: [
            {
                model: User,
                attributes: ["id", "name", "email", "avatarUrl"],
            },
        ],
        order: [["createdAt", "ASC"]],
    });

    return members;
};

// -- Add Project Member --
export const addProjectMember = async (projectId: string, orgId: string, input: AddProjectMemberInput) => {
    const project = await Project.findByPk(projectId);
    if (!project) {
        throw new AppError("Project not found", 404);
    }

    const orgMembership = await OrgMember.findOne({
        where: { orgId, userId: input.userId },
    });
    if (!orgMembership) {
        throw new AppError("User must be an organization member before being added to a project", 400);
    }

    const existing = await ProjectMember.findOne({
        where: { projectId, userId: input.userId },
    });
    if (existing) {
        throw new AppError("User is already a member of this project", 409);
    }

    const member = await ProjectMember.create({
        projectId,
        userId: input.userId,
        role: input.role as ProjectMemberRole,
    });

    return member.reload({
        include: [{ model: User, attributes: ["id", "name", "email", "avatarUrl"] }],
    });
};

// -- Update Project Member Role --
export const updateProjectMemberRole = async (projectId: string, targetUserId: string, requestingMember: ProjectMember, input: UpdateProjectMemberRoleInput) => {
    if (requestingMember.userId === targetUserId) {
        throw new AppError("Cannot change your own role", 403);
    }

    const targetMember = await ProjectMember.findOne({
        where: { projectId, userId: targetUserId },
    });

    if (!targetMember) {
        throw new AppError("Member not found in this project", 404);
    }

    await targetMember.update({ role: input.role as ProjectMemberRole });

    return targetMember.reload({
        include: [{ model: User, attributes: ["id", "name", "email", "avatarUrl"] }],
    });
};

// -- Remove Project Member --
export const removeProjectMember = async (projectId: string, targetUserId: string, requestingMember: ProjectMember) => {
    const project = await Project.findByPk(projectId);
    if (!project) {
        throw new AppError("Project not found", 404);
    }

    const isSelf = requestingMember.userId === targetUserId;
    const canRemoveOthers = requestingMember.role === ProjectMemberRole.MANAGER;
    if (!isSelf && !canRemoveOthers) {
        throw new AppError("You do not have permission to remove this member", 403);
    }

    const targetMember = await ProjectMember.findOne({
        where: { projectId, userId: targetUserId },
    });

    if (!targetMember) {
        throw new AppError("Member not found in this project", 404);
    }

    // Last manager cannot leave, someone has to own the project
    if (targetMember.role === ProjectMemberRole.MANAGER) {
        const managerCount = await ProjectMember.count({
            where: { projectId, role: ProjectMemberRole.MANAGER },
        });
        if (managerCount <= 1) {
            throw new AppError("Cannot remove the last manager. Assign another manager first.", 400);
        }
    }

    targetMember.destroy();
};
