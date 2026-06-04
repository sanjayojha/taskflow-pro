import { Request, Response, NextFunction } from "express";
import * as taskService from "../services/task.service";
import { sendSuccess } from "../utils/apiResponse";

// -- Tasks
export const getProjectTasks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const result = await taskService.getProjectTasks(req.params.projectId as string, {
            page: parseInt(req.query.page as string) || 1,
            limit: parseInt(req.query.limit as string) || 50,
            status: req.query.status as string | undefined,
            priority: req.query.priority as string | undefined,
            assigneeId: req.query.assigneeId as string | undefined,
            search: req.query.search as string | undefined,
            sortBy: req.query.sortBy as string | undefined,
            sortOrder: req.query.sortOrder as string | undefined,
        });
        sendSuccess(res, result);
    } catch (err) {
        next(err);
    }
};

export const createTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const task = await taskService.createTask(req.params.projectId as string, req.user!.userId, req.body);
        sendSuccess(res, { task }, "Task created successfully", 201);
    } catch (err) {
        next(err);
    }
};

export const getTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const task = await taskService.getTaskById(req.params.taskId as string);
        sendSuccess(res, { task });
    } catch (err) {
        next(err);
    }
};

export const updateTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const task = await taskService.updateTask(req.params.taskId as string, req.params.projectId as string, req.body);
        sendSuccess(res, { task }, "Task updated successfully");
    } catch (err) {
        next(err);
    }
};

export const updateTaskPosition = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const task = await taskService.updateTaskPosition(req.params.taskId as string, req.params.projectId as string, req.body);
        sendSuccess(res, { task }, "Task position updated");
    } catch (err) {
        next(err);
    }
};

export const deleteTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        await taskService.deleteTask(req.params.taskId as string, req.params.projectId as string);
        sendSuccess(res, null, "Task deleted successfully");
    } catch (err) {
        next(err);
    }
};

// --- Comments

export const getTaskComments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const comments = await taskService.getTaskComments(req.params.taskId as string);
        sendSuccess(res, { comments });
    } catch (err) {
        next(err);
    }
};

export const createComment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const comment = await taskService.createComment(req.params.taskId as string, req.user!.userId, req.body);
        sendSuccess(res, { comment }, "Comment added", 201);
    } catch (err) {
        next(err);
    }
};

export const updateComment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const comment = await taskService.updateComment(req.params.commentId as string, req.user!.userId, req.body);
        sendSuccess(res, { comment }, "Comment updated");
    } catch (err) {
        next(err);
    }
};

export const deleteComment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        await taskService.deleteComment(req.params.commentId as string, req.user!.userId);
        sendSuccess(res, null, "Comment deleted");
    } catch (err) {
        next(err);
    }
};

// --- Attachments
export const getTaskAttachments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const attachments = await taskService.getTaskAttachments(req.params.taskId as string);
        sendSuccess(res, { attachments });
    } catch (err) {
        next(err);
    }
};

export const deleteAttachment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        await taskService.deleteAttachment(req.params.attachmentId as string, req.user!.userId);
        sendSuccess(res, null, "Attachment deleted");
    } catch (err) {
        next(err);
    }
};
