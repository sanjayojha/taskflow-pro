import { logger } from "../utils/logger";
import { Request, Response, NextFunction } from "express";

export class AppError extends Error {
    statusCode: number;
    isOperational: boolean;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor); //v8 specific feature
    }
}

export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction): void => {
    if (err instanceof AppError) {
        res.status(err.statusCode).json({ success: false, message: err.message });
        return;
    }

    // Sequelize unique constraint (e.g. duplicate email)
    if (err.name === "SequelizeUniqueConstraintError") {
        res.status(409).json({
            success: false,
            message: "A record with that value already exists.",
        });
        return;
    }

    // JWT errors
    if (err.name === "JsonWebTokenError") {
        res.status(401).json({ success: false, message: "Invalid token." });
        return;
    }
    if (err.name === "TokenExpiredError") {
        res.status(401).json({ success: false, message: "Token expired." });
        return;
    }

    logger.error("Unknown error:", err);

    res.status(500).json({
        success: false,
        message: "An unexpected error occurred.",
    });
};
