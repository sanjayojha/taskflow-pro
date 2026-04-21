import { NextFunction, Request, Response } from "express";
import { ZodError, ZodType } from "zod";

export const validate = (schema: ZodType) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            req.body = schema.parse(req.body);
            next();
        } catch (err) {
            if (err instanceof ZodError) {
                const errors = err.issues.map((e) => ({
                    field: e.path.join("."),
                    message: e.message,
                }));
                res.status(422).json({
                    success: false,
                    message: "Validation failed",
                    errors,
                });
                return;
            }
            next(err);
        }
    };
};
