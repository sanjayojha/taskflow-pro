import multer, { FileFilterCallback, MulterError } from "multer";
import { AppError } from "./errorHandler";
import { NextFunction, Request, Response } from "express";

// Store in memory, we pipe the buffer straight to S3.
const storage = multer.memoryStorage();

// Allowed MIME types per upload category
const IMAGE_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const ATTACHMENT_MIME_TYPES = [
    ...IMAGE_MIME_TYPES,
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/plain",
    "text/csv",
    "application/zip",
];

const imageFilter = (_req: Request, file: Express.Multer.File, cb: FileFilterCallback): void => {
    if (IMAGE_MIME_TYPES.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new AppError("Only image files are allowed (JPEG, PNG, WebP, GIF)", 400));
    }
};

const attachmentFilter = (_req: Request, file: Express.Multer.File, cb: FileFilterCallback): void => {
    if (ATTACHMENT_MIME_TYPES.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new AppError("File type not allowed", 400));
    }
};

// Avatar upload (images only, 5MB max)
export const uploadAvatar = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: imageFilter,
}).single("avatar");

// Task attachment (broader types, 10MB max)
export const uploadAttachment = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: attachmentFilter,
}).single("file");

// Multer errors need special handling, wrap in express-compatible middleware.
export const handleMulterError = (err: unknown, _req: Request, res: Response, next: NextFunction): void => {
    if (err instanceof MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
            res.status(400).json({ success: false, message: "File is too large" });
            return;
        }
        res.status(400).json({ success: false, message: err.message });
        return;
    }
    next(err);
};
