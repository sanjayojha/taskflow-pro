import { RedisStore } from "rate-limit-redis";
import { redisConnection } from "./redis";
import rateLimit from "express-rate-limit";

// Shared Redis store factory, each limiter gets its own key prefix.
const createRedisStore = (prefix: string) => {
    return new RedisStore({
        prefix,
        // rate-limit-redis uses sendCommand to stay client-agnostic
        sendCommand: async (...args: string[]) => {
            return redisConnection.call(args[0], ...args.slice(1)) as Promise<number>;
        },
    });
};

// -- Global API limiter --
// Applied to every route, broad safety net against abuse
export const globalLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute window
    limit: 100, // 100 requests per IP per minute
    standardHeaders: "draft-7", // Return RateLimit-* headers
    legacyHeaders: false,
    store: createRedisStore("rl:global:"),
    message: {
        success: false,
        message: "Too many requests. Please slow down.",
    },
    skip: (req) => req.path === "/health", // never limit health checks
});

// -- Auth limiter
// Strictest, prevents brute force on login/register
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minute window
    max: 10, // 10 attempts per IP per 15 min
    standardHeaders: "draft-7",
    legacyHeaders: false,
    store: createRedisStore("rl:auth:"),
    message: {
        success: false,
        message: "Too many authentication attempts. Please try again in 15 minutes.",
    },
});

// -- Password reset limiter
// Tighter than auth, prevents email flooding
export const passwordResetLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour window
    max: 3, // 3 attempts per IP per hour
    standardHeaders: "draft-7",
    legacyHeaders: false,
    store: createRedisStore("rl:pw-reset:"),
    message: {
        success: false,
        message: "Too many password reset attempts. Please try again in 1 hour.",
    },
});

// -- Invite limiter
// Prevents invite email spam
export const inviteLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour window
    max: 20, // 20 invites per IP per hour
    standardHeaders: "draft-7",
    legacyHeaders: false,
    store: createRedisStore("rl:invite:"),
    message: {
        success: false,
        message: "Too many invite requests. Please try again in 1 hour.",
    },
});
