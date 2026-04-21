import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/jwt";
import { RefreshToken, User } from "../models";
import crypto from "node:crypto";
import { hashToken } from "../utils/tokenHash";
import { LoginInput, RegisterInput } from "../schemas/auth.schema";
import { AppError } from "../middlewares/errorHandler";
import { comparePassword, hashPassword } from "../utils/password";
import { sendMail } from "../utils/mailer";
import { resetpasswordTemplate, verifyEmailTemplate } from "../utils/emailTemplates";
import { logger } from "../utils/logger";
import { Op } from "sequelize";
// --types---
export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface AuthResult {
    user: {
        id: string;
        name: string;
        email: string;
        role: string;
        isVerified: boolean;
        avatarUrl?: string;
    };
    tokens: AuthTokens;
}

// --helpers---

const generateRawToken = (): string => {
    return crypto.randomBytes(32).toString("hex");
};

const createTokenPair = async (user: User): Promise<AuthTokens> => {
    const tokenId = crypto.randomUUID();

    const accessToken = signAccessToken({
        userId: user.id,
        email: user.email,
        role: user.role,
    });

    const refreshToken = signRefreshToken({
        userId: user.id,
        tokenId,
    });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // add 7 days

    await RefreshToken.create({
        id: tokenId,
        userId: user.id,
        tokenHash: hashToken(refreshToken),
        expiresAt,
        revoked: false,
    });

    return { accessToken, refreshToken };
};

const safeUser = (user: User) => {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        avatarUrl: user.avatarUrl,
    };
};

// --Service methods---

export const register = async (input: RegisterInput): Promise<{ message: string }> => {
    const existingUser = await User.findOne({ where: { email: input.email } });
    if (existingUser) {
        throw new AppError("An account with that email already exists", 409);
    }

    const passwordHash = await hashPassword(input.password);
    const verifyToken = generateRawToken();
    const verifyTokenHash = hashToken(verifyToken);

    const user = await User.create({
        name: input.name,
        passwordHash: passwordHash,
        email: input.email,
        emailVerifyToken: verifyTokenHash,
        emailVerifyExpires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24hrs
    });

    await sendMail({
        to: user.email,
        subject: "Verify your TaskFlow Pro email",
        html: verifyEmailTemplate(user.name, verifyToken),
    });

    logger.info(`New user registered: ${user.email}`);

    return { message: "Registration successful. Please check your email to verify your account!" };
};

export const login = async (input: LoginInput): Promise<AuthResult> => {
    const user = await User.findOne({ where: { email: input.email } });

    if (!user || !comparePassword(input.password, user.passwordHash)) {
        throw new AppError("Invalid email or password", 401);
    }

    if (!user.isVerified) {
        throw new AppError("Please verify your email before logging in", 403);
    }

    const tokens = await createTokenPair(user);

    return { user: safeUser(user), tokens };
};

export const refreshTokens = async (rawRefreshToken: string): Promise<AuthTokens> => {
    let payload;
    try {
        payload = verifyRefreshToken(rawRefreshToken);
    } catch (error) {
        throw new AppError("Invalid or expired refresh token", 401);
    }

    const storedToken = await RefreshToken.findOne({
        where: {
            id: payload.tokenId,
            userId: payload.userId,
            revoked: false,
        },
    });

    if (!storedToken) {
        throw new AppError("Refresh token not found or already revoked", 401);
    }

    if (storedToken.tokenHash !== hashToken(rawRefreshToken)) {
        //revoke all
        await RefreshToken.update({ revoked: true }, { where: { userId: payload.userId } });
        throw new AppError("Token reuse detected. Please log in again.", 401);
    }

    if (new Date() > storedToken.expiresAt) {
        throw new AppError("Refresh token expired", 401);
    }

    await storedToken.update({ revoked: true });

    const user = await User.findByPk(payload.userId);
    if (!user) {
        throw new AppError("User not found", 401);
    }

    return createTokenPair(user);
};

export const logout = async (rawRefreshToken: string): Promise<void> => {
    try {
        const payload = verifyRefreshToken(rawRefreshToken);
        await RefreshToken.update({ revoked: true }, { where: { id: payload.tokenId } });
    } catch (error) {
        logger.warn("Logout called with invalid refresh token");
    }
};

export const verifyEmail = async (token: string): Promise<void> => {
    const tokenHash = hashToken(token);

    const user = await User.findOne({
        where: {
            emailVerifyToken: tokenHash,
            emailVerifyExpires: { [Op.gt]: new Date() },
        },
    });

    if (!user) {
        throw new AppError("Invalid or expired verification link", 400);
    }

    await user.update({
        isVerified: true,
        emailVerifyToken: null,
        emailVerifyExpires: null,
    });
};

export const forgotPassword = async (email: string): Promise<void> => {
    const user = await User.findOne({ where: { email } });
    // Always return success. don't reveal whether email exists
    if (!user) return;

    const resetToken = generateRawToken();
    const resetTokenHash = hashToken(resetToken);

    await user.update({
        passwordResetToken: resetTokenHash,
        passwordResetExpires: new Date(Date.now() + 60 * 60 * 1000), // 1hr
    });

    await sendMail({
        to: user.email,
        subject: "Reset your TaskFlow Pro password",
        html: resetpasswordTemplate(user.name, resetToken),
    });
};

export const resetPassword = async (token: string, newPassword: string): Promise<void> => {
    const tokenHash = hashToken(token);

    const user = await User.findOne({
        where: {
            passwordResetToken: tokenHash,
            passwordResetExpires: { [Op.gt]: new Date() },
        },
    });

    if (!user) {
        throw new AppError("Invalid or expired reset link", 400);
    }

    const passwordHash = await hashPassword(newPassword);

    await user.update({
        passwordHash,
        passwordResetToken: null,
        passwordResetExpires: null,
    });

    await RefreshToken.update(
        {
            revoked: true,
        },
        {
            where: {
                userId: user.id,
            },
        },
    );
};

export const getMe = async (userId: string) => {
    const user = await User.findByPk(userId);
    if (!user) {
        throw new AppError("User not found", 404);
    }
    return safeUser(user);
};
