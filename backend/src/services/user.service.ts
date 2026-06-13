import { avatarKey, deleteFromS3, getPresignedUrl, uploadToS3 } from "../utils/s3Helper";
import { AppError } from "../middlewares/errorHandler";
import { User } from "../models";
import { UpdateProfileInput } from "../schemas/user.schema";
import { cache } from "../utils/cache";
import { CacheKeys } from "../utils/cacheKeys";

import sharp from "sharp";

// -- get profile
export const getProfile = async (userId: string) => {
    const user = await User.findByPk(userId, {
        attributes: ["id", "name", "email", "avatarUrl", "role", "isVerified", "createdAt"],
    });

    if (!user) {
        throw new AppError("User not found", 404);
    }

    // If user has an avatar, generate a fresh pre-signed URL
    const profile = user.toJSON() as Record<string, unknown>;
    if (user.avatarUrl) {
        profile.avatarUrl = await getPresignedUrl(user.avatarUrl);
    }

    return profile;
};

// -- update profile
export const updateProfile = async (userId: string, input: UpdateProfileInput) => {
    const user = await User.findByPk(userId);
    if (!user) {
        throw new AppError("User not found", 404);
    }

    if (input.name) {
        await user.update({ name: input.name });
    }

    // invalidate cache
    await cache.del(CacheKeys.userOrgs(userId));

    return await getProfile(userId);
};

// -- upload Avatar
export const uploadAvatar = async (userId: string, file: Express.Multer.File): Promise<{ avatarUrl: string }> => {
    const user = await User.findByPk(userId);
    if (!user) {
        throw new AppError("User not found", 404);
    }

    // Resize to 200x200, convert to webp for consistent format + smaller size
    const resizedBuffer = await sharp(file.buffer).resize(200, 200, { fit: "cover", position: "centre" }).webp({ quality: 85 }).toBuffer();

    const key = avatarKey(userId, "webp");

    // Delete old avatar from S3 if one exists
    if (user.avatarUrl) {
        await deleteFromS3(user.avatarUrl);
    }

    await uploadToS3({
        key,
        buffer: resizedBuffer,
        mimeType: "image/webp",
    });

    // Store the S3 key in DB not the URL (URLs expire, keys don't)
    await user.update({ avatarUrl: key });

    // Invalidate caches that contain this user's data
    await cache.del(CacheKeys.userOrgs(userId));

    // Return a fresh pre-signed URL for immediate use by the client
    const presignedUrl = await getPresignedUrl(key);
    return { avatarUrl: presignedUrl };
};
