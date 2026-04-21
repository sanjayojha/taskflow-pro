import { Response } from "express";
export interface ApiResponse<T = unknown> {
    success: boolean;
    message: string;
    data?: T;
    errors?: Record<string, string>[];
}

export const sendSuccess = <T>(res: Response, data: T, message = "Success", statusCode = 200): void => {
    res.status(statusCode).json({ success: true, message, data });
};

export const sendError = (res: Response, message: string, statusCode = 400, errors?: Record<string, string>[]): void => {
    res.status(statusCode).json({ success: false, message, errors });
};
