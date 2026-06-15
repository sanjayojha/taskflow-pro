import { Router } from "express";

import authRoutes from "./auth.routes";
import orgRoutes from "./org.routes";
import projectRoutes, { orgProjectRouter } from "./project.routes";

import taskRoutes, { projectTaskRouter } from "./task.routes";

import userRoutes from "./user.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/orgs", orgRoutes);

// Org-scoped: GET /orgs/:orgId/projects
router.use("/orgs/:orgId/projects", orgProjectRouter);
// Standalone: GET /projects/:projectId
router.use("/projects", projectRoutes);

// Project-scoped tasks: /projects/:projectId/tasks
router.use("/projects/:projectId/tasks", projectTaskRouter);

// Standalone tasks: /tasks/:taskId
router.use("/tasks", taskRoutes);

// users and profile
router.use("/users", userRoutes);

export default router;
