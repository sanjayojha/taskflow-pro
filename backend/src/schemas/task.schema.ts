import { TaskPriority, TaskStatus } from "../models/Task";
import { z } from "zod";

export const createTaskSchema = z.object({
    title: z.string({ error: "Title is required" }).min(1, "Title cannot be empty").max(255, "Title must be under 255 characters").trim(),
    description: z.string().max(5000, "Description must be under 5000 characters").trim().optional(),
    status: z.enum(TaskStatus).optional().default(TaskStatus.BACKLOG),
    priority: z.enum(TaskPriority).optional().default(TaskPriority.MEDIUM),
    assigneeId: z.uuid({ error: "Invalid assignee ID" }).optional(),
    dueDate: z.coerce.date({ error: "Invalid date format" }).optional(),
});

export const updateTaskSchema = z.object({
    title: z.string({ error: "Title is required" }).min(1, "Title cannot be empty").max(255, "Title must be under 255 characters").trim().optional(),
    description: z.string().max(5000, "Description must be under 5000 characters").trim().optional(),
    status: z.enum(TaskStatus).optional(),
    priority: z.enum(TaskPriority).optional(),
    assigneeId: z.uuid({ error: "Invalid assignee ID" }).nullable().optional(),
    dueDate: z.coerce.date({ error: "Invalid date format" }).nullable().optional(),
});

export const updateTaskPositionSchema = z.object({
    status: z.enum(TaskStatus, {
        error: "Invalid status column",
    }),
    position: z.number({ error: "Position is required" }).int().min(0, "Position must be a non-negative integer"),
});

export const createCommentSchema = z.object({
    body: z.string({ error: "Comment body is required" }).min(1, "Comment cannot be empty").max(5000, "Comment must be under 5000 characters").trim(),
});

export const updateCommentSchema = z.object({
    body: z.string({ error: "Comment body is required" }).min(1, "Comment cannot be empty").max(5000, "Comment must be under 5000 characters").trim(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type UpdateTaskPositionInput = z.infer<typeof updateTaskPositionSchema>;
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>;
