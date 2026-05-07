import { Request, Response, NextFunction } from "express";
import * as orgService from "../services/org.service";
import { sendSuccess } from "../utils/apiResponse";

export const getUserOrgs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const orgs = await orgService.getUserOrgs(req.user!.userId);
        sendSuccess(res, { orgs });
    } catch (err) {
        next(err);
    }
};

export const createOrg = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const org = await orgService.createOrg(req.user!.userId, req.body);
        sendSuccess(res, { org }, "Organization created successfully", 201);
    } catch (err) {
        next(err);
    }
};

export const getOrg = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const orgId = req.params.orgId as string;
        const org = await orgService.getOrgById(orgId);
        sendSuccess(res, { org });
    } catch (err) {
        next(err);
    }
};

export const updateOrg = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const org = await orgService.updateOrg(req.user!.userId, req.body);
        sendSuccess(res, { org }, "Organization updated successfully");
    } catch (err) {
        next(err);
    }
};

export const deleteOrg = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const orgId = req.params.orgId as string;
        await orgService.deleteOrg(orgId, req.user!.userId);
        sendSuccess(res, null, "Organization deleted successfully");
    } catch (err) {
        next(err);
    }
};

export const getOrgMembers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const orgId = req.params.orgId as string;
        const result = await orgService.getOrgMembers(orgId, {
            page: parseInt(req.query.page as string) || 1,
            limit: parseInt(req.query.limit as string) || 20,
        });
        sendSuccess(res, result);
    } catch (err) {
        next(err);
    }
};

export const inviteMember = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const orgId = req.params.orgId as string;
        const result = await orgService.inviteMember(orgId, req.user!.userId, req.body);
        sendSuccess(res, null, result.message, 201);
    } catch (err) {
        next(err);
    }
};

export const updateMemberRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const orgId = req.params.orgId as string;
        const targetUserId = req.params.userId as string;
        const member = await orgService.updateMemberRole(orgId, targetUserId, req.orgMember!, req.body);
        sendSuccess(res, { member }, "Member role updated");
    } catch (err) {
        next(err);
    }
};

export const removeMember = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const orgId = req.params.orgId as string;
        const targetUserId = req.params.userId as string;
        await orgService.removeMember(orgId, targetUserId, req.orgMember!);
        sendSuccess(res, null, "Member removed from organization");
    } catch (err) {
        next(err);
    }
};
