import { Router } from "express";
import * as projectController from "../controllers/project.controller";
import { authenticate } from "../middlewares/authenticate";
import { validate } from "../middlewares/validate";
import { addProjectMemberSchema, createProjectSchema, updateProjectMemberRoleSchema, updateProjectSchema } from "../schemas/project.schema";
import { requireOrgRole, requireProjectRole } from "../middlewares/rbac";
import { OrgMemberRole } from "../models/OrgMember";
import { ProjectMemberRole } from "../models/ProjectMember";

const router = Router();

// All org routes need authentication
router.use(authenticate);

// -- Org-scoped project routes (/orgs/:orgId/projects) --
export const orgProjectRouter = Router({ mergeParams: true });
orgProjectRouter.use(authenticate);

orgProjectRouter.get("/", requireOrgRole(OrgMemberRole.MEMBER), projectController.getOrgProjects);
orgProjectRouter.post("/", requireOrgRole(OrgMemberRole.MEMBER), validate(createProjectSchema), projectController.createProject);

// -- Standalone project routes (/projects/:projectId) --
router.get("/:projectId", requireProjectRole(ProjectMemberRole.VIEWER), projectController.getProject);
router.put("/:projectId", requireProjectRole(ProjectMemberRole.MANAGER), validate(updateProjectSchema), projectController.updateProject);
router.delete("/:projectId", requireProjectRole(ProjectMemberRole.MANAGER), projectController.deleteProject);

// -- Project member routes (/projects/:projectId/members) --
router.get("/:projectId/members", requireProjectRole(ProjectMemberRole.VIEWER), projectController.getProjectMembers);
router.post("/:projectId/members", requireProjectRole(ProjectMemberRole.MANAGER), validate(addProjectMemberSchema), projectController.addProjectMember);
router.patch("/:projectId/members/:userId/role", requireProjectRole(ProjectMemberRole.MANAGER), validate(updateProjectMemberRoleSchema), projectController.updateProjectMemberRole);
router.delete("/:projectId/members/:userId", requireProjectRole(ProjectMemberRole.MEMBER), projectController.removeProjectMember);

export default router;
