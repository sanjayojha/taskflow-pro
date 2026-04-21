import { NextFunction, Request, Response } from "express";
import { AppError } from "./errorHandler";
import { verifyAccessToken } from "../utils/jwt";

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new AppError("Auth header missing!", 409);
        }
        const token = authHeader.split(" ")[1];
        const payload = verifyAccessToken(token);
        req.user = payload;
        next();
    } catch (err) {
        next(err);
    }
};
