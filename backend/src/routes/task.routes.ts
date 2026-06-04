import { authenticate } from "../middlewares/authenticate";
import { Router } from "express";
import { requireProjectRole } from "../middlewares/rbac";
import { ProjectMemberRole } from "../models";
import * as taskController from "../controllers/task.controller";
import { validate } from "../middlewares/validate";
import { createCommentSchema, createTaskSchema, updateCommentSchema, updateTaskPositionSchema, updateTaskSchema } from "../schemas/task.schema";

import { Request, Response, NextFunction } from "express";
import { Task } from "../models/Task";
import { AppError } from "../middlewares/errorHandler";

// -- Standalone task routes (/tasks/:taskId)
const router = Router();
router.use(authenticate); // all task routes need authentications

// For standalone task routes we need to resolve the projectId from the task
// The requireProjectRole middleware needs :projectId in params, so we use
// a lightweight param middleware to inject it from the task record
const injectProjectId = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
        const task = await Task.findByPk(req.params.taskId as string, {
            attributes: ["projectId"],
        });
        if (!task) {
            throw new AppError("Task not found", 404);
        }
        req.params.projectId = task.projectId;
        next();
    } catch (err) {
        next(err);
    }
};

// Task CRUD
router.get("/:taskId", injectProjectId, requireProjectRole(ProjectMemberRole.VIEWER), taskController.getTask);

router.put("/:taskId", injectProjectId, requireProjectRole(ProjectMemberRole.MEMBER), validate(updateTaskSchema), taskController.updateTask);

router.patch("/:taskId/position", injectProjectId, requireProjectRole(ProjectMemberRole.MEMBER), validate(updateTaskPositionSchema), taskController.updateTaskPosition);

router.delete("/:taskId", injectProjectId, requireProjectRole(ProjectMemberRole.MEMBER), taskController.deleteTask);

// Comments
router.get("/:taskId/comments", injectProjectId, requireProjectRole(ProjectMemberRole.VIEWER), taskController.getTaskComments);

router.post("/:taskId/comments", injectProjectId, requireProjectRole(ProjectMemberRole.MEMBER), validate(createCommentSchema), taskController.createComment);

router.put("/comments/:commentId", validate(updateCommentSchema), taskController.updateComment);

router.delete("/comments/:commentId", taskController.deleteComment);

// Attachments (placeholder)
router.get("/:taskId/attachments", injectProjectId, requireProjectRole(ProjectMemberRole.VIEWER), taskController.getTaskAttachments);

router.delete("/attachments/:attachmentId", taskController.deleteAttachment);

// -- Project-scoped task routes (/projects/:projectId/tasks)
// Mounted on the project router in routes/index.ts
export const projectTaskRouter = Router({ mergeParams: true });
projectTaskRouter.use(authenticate);

projectTaskRouter.get("/", requireProjectRole(ProjectMemberRole.VIEWER), taskController.getProjectTasks);

projectTaskRouter.post("/", requireProjectRole(ProjectMemberRole.MEMBER), validate(createTaskSchema), taskController.createTask);

export default router;
