import { Router } from "express";

import authRoutes from "./auth.routes";
import orgRoutes from "./org.routes";
import projectRoutes, { orgProjectRouter } from "./project.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/orgs", orgRoutes);

// Org-scoped: GET /orgs/:orgId/projects
router.use("/orgs/:orgId/projects", orgProjectRouter);
// Standalone: GET /projects/:projectId
router.use("/projects", projectRoutes);

export default router;
