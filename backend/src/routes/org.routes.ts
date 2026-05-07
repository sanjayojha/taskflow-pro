import { Router } from "express";
import * as orgController from "../controllers/org.controller";
import { authenticate } from "../middlewares/authenticate";
import { validate } from "../middlewares/validate";
import { createOrgSchema, inviteMemberSchema, updateMemberRoleSchema, updateOrgSchema } from "../schemas/org.schema";
import { requireOrgRole } from "../middlewares/rbac";
import { OrgMemberRole } from "../models/OrgMember";

const router = Router();

// All org routes need authentication
router.use(authenticate);

// -- org curd ---
router.get("/", orgController.getUserOrgs);
router.post("/", validate(createOrgSchema), orgController.createOrg);

router.get("/:orgId", requireOrgRole(OrgMemberRole.MEMBER), orgController.getOrg);
router.put("/:orgId", requireOrgRole(OrgMemberRole.ADMIN), validate(updateOrgSchema), orgController.updateOrg);
router.delete("/:orgId", requireOrgRole(OrgMemberRole.OWNER), orgController.deleteOrg);

// -- member managment ---
router.get("/:orgId/members", requireOrgRole(OrgMemberRole.MEMBER), orgController.getOrgMembers);
router.post("/:orgId/members/invite", requireOrgRole(OrgMemberRole.ADMIN), validate(inviteMemberSchema), orgController.inviteMember);
router.patch("/:orgId/members/:userId/role", requireOrgRole(OrgMemberRole.ADMIN), validate(updateMemberRoleSchema), orgController.updateMemberRole);
router.delete("/:orgId/members/:userId", requireOrgRole(OrgMemberRole.MEMBER), orgController.removeMember);

export default router;
