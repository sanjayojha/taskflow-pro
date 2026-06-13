import { s3Client } from "../config/s3";
import { env } from "../config/env";
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { logger } from "./logger";

// -- uploads
interface UploadOptions {
    key: string;
    buffer: Buffer;
    mimeType: string;
}

export const uploadToS3 = async (options: UploadOptions): Promise<string> => {
    const command = new PutObjectCommand({
        Bucket: env.AWS_S3_BUCKET,
        Key: options.key,
        Body: options.buffer,
        ContentType: options.mimeType,
    });

    await s3Client.send(command);
    logger.info(`S3 upload successful: ${options.key}`);
    return options.key;
};

// -- delete
export const deleteFromS3 = async (key: string): Promise<void> => {
    const command = new DeleteObjectCommand({
        Bucket: env.AWS_S3_BUCKET,
        Key: key,
    });

    await s3Client.send(command);
    logger.info(`S3 delete successful: ${key}`);
};

// --re-signed download URL
// Never expose the raw S3 key to the client — always use a pre-signed URL that expires. This means even if someone gets the URL it stops working.

export const getPresignedUrl = async (
    key: string,
    expiresInSeconds = 900, // 15 minutes
): Promise<string> => {
    const command = new GetObjectCommand({
        Bucket: env.AWS_S3_BUCKET,
        Key: key,
    });

    return getSignedUrl(s3Client, command, { expiresIn: expiresInSeconds });
};

// -- Key generators
// Centralised so the key structure is consistent everywhere

export function avatarKey(userId: string, ext: string): string {
    return `avatars/${userId}/avatar.${ext}`;
}

export function attachmentKey(orgId: string, taskId: string, filename: string): string {
    // uuid prefix prevents filename collisions
    const { v4: uuidv4 } = require("uuid");
    return `attachments/${orgId}/${taskId}/${uuidv4()}-${filename}`;
}
