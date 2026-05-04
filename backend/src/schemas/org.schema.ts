import { OrgMemberRole } from "../models/OrgMember";
import { OrgPlan } from "../models/Organization";
import { z } from "zod";

export const createOrgSchema = z.object({
    name: z.string({ error: "Organization name is required" }).min(2, "Name must be at least 2 characters").max(100, "Name must be under 100 characters").trim(),
});

export const updateOrgSchema = z.object({
    name: z.string({ error: "Organization name is required" }).min(2, "Name must be at least 2 characters").max(100, "Name must be under 100 characters").trim().optional(),
    //plan: z.enum(["free", "pro"]).optional(),
    plan: z.enum(OrgPlan).optional(),
});

export const inviteMemberSchema = z.object({
    email: z.email({ error: "Invalid email address" }).toLowerCase().trim(),
    //role: z.enum(["admin", "member"]).optional().default("member"),
    role: z.enum(OrgMemberRole).optional().default(OrgMemberRole.MEMBER),
});

export const updateMemberRoleSchema = z.object({
    //role: z.enum(["admin", "member"], { error: "Role must be admin or member" }),
    role: z.enum(OrgMemberRole, { error: "Role must be admin or member" }),
});

export type CreateOrgInput = z.infer<typeof createOrgSchema>;
export type UpdateOrgInput = z.infer<typeof updateOrgSchema>;
export type InviteMemberInput = z.infer<typeof inviteMemberSchema>;
export type UpdateMemberRoleInput = z.infer<typeof updateMemberRoleSchema>;
