import { z } from "zod";

export const createProjectSchema = z.object({
    name: z.string({ error: "Project name is required" }).min(2, "Name must be at least 2 characters").max(100, "Name must be under 100 characters").trim(),
    description: z.string().max(1000, "Description must be under 1000 characters").trim().optional(),
    deadline: z.coerce.date({ error: "Invalid date format" }).optional(),
});

export const updateProjectSchema = z.object({
    name: z.string({ error: "Project name is required" }).min(2, "Name must be at least 2 characters").max(100, "Name must be under 100 characters").trim(),
    description: z.string().max(1000, "Description must be under 1000 characters").trim().optional(),
    status: z.enum(["active", "archived", "completed"]).optional(),
    deadline: z.coerce.date({ error: "Invalid date format" }).optional(),
});

export const addProjectMemberSchema = z.object({
    userId: z.uuid({ error: "Invalid user ID" }),
    role: z.enum(["manager", "member", "viewer"]).optional().default("member"),
});

export const updateProjectMemberRoleSchema = z.object({
    role: z.enum(["manager", "member", "viewer"], {
        error: "Role must be manager, member or viewer",
    }),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type AddProjectMemberInput = z.infer<typeof addProjectMemberSchema>;
export type UpdateProjectMemberRoleInput = z.infer<typeof updateProjectMemberRoleSchema>;
