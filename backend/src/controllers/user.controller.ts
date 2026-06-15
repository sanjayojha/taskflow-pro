import { Request, Response, NextFunction } from "express";
import * as userService from "../services/user.service";
import { sendSuccess } from "../utils/apiResponse";

export const getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const profile = await userService.getProfile(req.user!.userId);
        sendSuccess(res, { profile });
    } catch (err) {
        next(err);
    }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const profile = await userService.updateProfile(req.user!.userId, req.body);
        sendSuccess(res, { profile }, "Profile updated successfully");
    } catch (err) {
        next(err);
    }
};

export const uploadAvatar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.file) {
            res.status(400).json({ success: false, message: "No file uploaded" });
            return;
        }
        const result = await userService.uploadAvatar(req.user!.userId, req.file);
        sendSuccess(res, result, "Avatar uploaded successfully");
    } catch (err) {
        next(err);
    }
};
