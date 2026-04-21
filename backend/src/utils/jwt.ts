import { env } from "../config/env";
import jwt from "jsonwebtoken";

export interface AccessTokenPayload {
    userId: string;
    email: string;
    role: string;
}

export interface RefreshTokenPayload {
    userId: string;
    tokenId: string; // ties JWT to the refresh_tokens row
}

export const signAccessToken = (payload: AccessTokenPayload): string => {
    return jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: env.JWT_ACCESS_EXPIRES_IN } as jwt.SignOptions);
};

export const signRefreshToken = (payload: RefreshTokenPayload): string => {
    return jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_EXPIRES_IN } as jwt.SignOptions);
};

export const verifyAccessToken = (token: string): AccessTokenPayload => {
    return jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessTokenPayload;
};

export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
    return jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshTokenPayload;
};
