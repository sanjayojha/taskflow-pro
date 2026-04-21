import { env } from "../config/env";
import { Request, Response, NextFunction } from "express";
import * as authService from "../services/auth.service";
import { sendError, sendSuccess } from "../utils/apiResponse";

const COOKIE_OPTIONS = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7days
};

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const result = await authService.register(req.body);
        sendSuccess(res, null, result.message, 201);
    } catch (err) {
        next(err);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const result = await authService.login(req.body);
        res.cookie("refreshToken", result.tokens.refreshToken, COOKIE_OPTIONS);
        const data = { user: result.user, accessToken: result.tokens.accessToken };

        sendSuccess(res, data, "Login successful!");
    } catch (err) {
        next(err);
    }
};

export const refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const rawRefreshToken = req.cookies?.refreshToken;
        if (!rawRefreshToken) {
            sendError(res, "No refresh token provided", 401);
            return;
        }
        const tokens = await authService.refreshTokens(rawRefreshToken);
        res.cookie("refreshToken", tokens.refreshToken, COOKIE_OPTIONS);
        const data = { accessToken: tokens.accessToken };
        sendSuccess(res, data, "Token refreshed");
    } catch (err) {
        next(err);
    }
};

export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const rawRefreshToken = req.cookies?.refreshToken;
        if (rawRefreshToken) {
            await authService.logout(rawRefreshToken);
        }
        res.clearCookie("refreshToken");
        sendSuccess(res, null, "Logged out successfully");
    } catch (err) {
        next(err);
    }
};

export const verifyEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.params.token as string;
        await authService.verifyEmail(token);

        res.redirect(`${env.APP_URL}/login?verified=true`);
    } catch (err) {
        next(err);
    }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        await authService.forgotPassword(req.body.email);
        sendSuccess(res, null, "If that email is registered, you will receive a reset link shortly.");
    } catch (err) {
        next(err);
    }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.params.token as string;
        await authService.resetPassword(token, req.body.password);
        sendSuccess(res, null, "Password reset successful. You can now log in.");
    } catch (err) {
        next(err);
    }
};

export const getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = await authService.getMe(req.user!.userId);
        sendSuccess(res, { user });
    } catch (err) {
        next(err);
    }
};
