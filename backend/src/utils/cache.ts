import { redisConnection } from "../config/redis";
import { logger } from "./logger";

export const cache = {
    async get<T>(key: string): Promise<T | null> {
        try {
            const value = await redisConnection.get(key);
            if (!value) {
                return null;
            }
            return JSON.parse(value) as T;
        } catch (err) {
            // Cache failure must never crash the app — log and fall through
            logger.error(`Cache GET error [${key}]:`, err);
            return null;
        }
    },

    async set(key: string, value: unknown, ttlSeconds: number): Promise<void> {
        try {
            await redisConnection.set(key, JSON.stringify(value), "EX", ttlSeconds);
        } catch (err) {
            logger.error(`Cache SET error [${key}]:`, err);
        }
    },

    async del(...keys: string[]): Promise<void> {
        try {
            if (keys.length > 0) {
                await redisConnection.del(...keys);
            }
        } catch (err) {
            logger.error(`Cache DEL error [${keys.join(", ")}]:`, err);
        }
    },

    async delPattern(pattern: string): Promise<void> {
        try {
            const keys = await redisConnection.keys(pattern);
            if (keys.length > 0) {
                await redisConnection.del(...keys);
            }
        } catch (err) {
            logger.error(`Cache DEL pattern error [${pattern}]:`, err);
        }
    },
};
