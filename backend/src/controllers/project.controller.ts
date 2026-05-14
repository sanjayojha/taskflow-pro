import { Request, Response, NextFunction } from "express";
import * as projectService from "../services/project.service";
import { sendSuccess } from "../utils/apiResponse";

export const getOrgProjects = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const orgId = req.params.orgId as string;
        const result = await projectService.getOrgProjects(orgId, req.user!.userId, {
            page: parseInt(req.query.page as string) || 1,
            limit: parseInt(req.query.limit as string) || 20,
            status: (req.query.status as string) || undefined,
            search: (req.query.search as string) || undefined,
        });
        sendSuccess(res, result);
    } catch (err) {
        next(err);
    }
};

export const createProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const project = await projectService.createProject(req.params.orgId as string, req.user!.userId, req.body);
        sendSuccess(res, { project }, "Project created successfully!", 201);
    } catch (err) {
        next(err);
    }
};

export const getProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const project = await projectService.getProjectById(req.params.projectId as string, req.user!.userId);
        sendSuccess(res, { project });
    } catch (err) {
        next(err);
    }
};

export const updateProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const project = await projectService.updateProject(req.params.projectId as string, req.body);
        sendSuccess(res, { project }, "Project updated successfully!");
    } catch (err) {
        next(err);
    }
};

export const deleteProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const project = await projectService.deleteProject(req.params.projectId as string);
        sendSuccess(res, { project }, "Project deleted successfully!");
    } catch (err) {
        next(err);
    }
};

export const getProjectMembers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const members = await projectService.getProjectMembers(req.params.projectId as string);
        sendSuccess(res, { members });
    } catch (err) {
        next(err);
    }
};

export const addProjectMember = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const member = await projectService.addProjectMember(req.params.projectId as string, req.project!.orgId, req.body);
        sendSuccess(res, { member }, "Member added to project", 201);
    } catch (err) {
        next(err);
    }
};

export const updateProjectMemberRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const member = await projectService.updateProjectMemberRole(req.params.projectId as string, req.params.userId as string, req.projectMember!, req.body);
        sendSuccess(res, { member }, "Member role updated");
    } catch (err) {
        next(err);
    }
};

export const removeProjectMember = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        await projectService.removeProjectMember(req.params.projectId as string, req.params.userId as string, req.projectMember!);
        sendSuccess(res, null, "Member removed from project");
    } catch (err) {
        next(err);
    }
};
