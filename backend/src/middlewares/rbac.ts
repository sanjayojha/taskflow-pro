import { ProjectMember, ProjectMemberRole } from "../models/ProjectMember";
import { OrgMember, OrgMemberRole } from "../models/OrgMember";
import { Organization } from "../models/Organization";
import { Project } from "../models/Project";
import { Request, Response, NextFunction } from "express";
import { AppError } from "./errorHandler";

const ORG_ROLE_HIERARCHY: Record<OrgMemberRole, number> = {
    [OrgMemberRole.OWNER]: 3,
    [OrgMemberRole.ADMIN]: 2,
    [OrgMemberRole.MEMBER]: 1,
};

const PROJECT_ROLE_HIERARCHY: Record<ProjectMemberRole, number> = {
    [ProjectMemberRole.MANAGER]: 3,
    [ProjectMemberRole.MEMBER]: 2,
    [ProjectMemberRole.VIEWER]: 1,
};

declare global {
    namespace Express {
        interface Request {
            orgMember?: OrgMember;
            projectMember?: ProjectMember;
            org?: Organization;
            project?: Project;
        }
    }
}

// --- Org RBAC -----

export const requireOrgRole = (minimumRole: OrgMemberRole) => {
    return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user?.userId;
            const orgId = req.params.orgId as string;

            if (!orgId) {
                throw new AppError("Organization ID is required", 400);
            }

            const org = await Organization.findByPk(orgId);
            if (!org) {
                throw new AppError("Organization not found", 404);
            }

            const member = await OrgMember.findOne({ where: { orgId, userId } });
            if (!member) {
                throw new AppError("You are not a member of this organization", 403);
            }

            const userLevel = ORG_ROLE_HIERARCHY[member.role];
            const requiredLevel = ORG_ROLE_HIERARCHY[minimumRole];

            if (userLevel < requiredLevel) {
                throw new AppError("You do not have permission to perform this action", 403);
            }

            // Attach for use in controllers/services
            req.org = org;
            req.orgMember = member;

            next();
        } catch (err) {
            next(err);
        }
    };
};

// --- Project RBAC -----

export const requireProjectRole = (minimumRole: ProjectMemberRole) => {
    return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user?.userId;
            const projectId = req.params.projectId as string;
            if (!projectId) {
                throw new AppError("Project ID is required", 400);
            }
            const project = await Project.findByPk(projectId);
            if (!project) {
                throw new AppError("Project not found", 404);
            }

            const member = await ProjectMember.findOne({ where: { projectId, userId } });
            if (!member) {
                throw new AppError("You are not a member of this project", 403);
            }

            const userLevel = PROJECT_ROLE_HIERARCHY[member.role];
            const requiredLevel = PROJECT_ROLE_HIERARCHY[minimumRole];

            if (userLevel < requiredLevel) {
                throw new AppError("You do not have permission to perform this action", 403);
            }

            req.project = project;
            req.projectMember = member;

            next();
        } catch (err) {
            next(err);
        }
    };
};
