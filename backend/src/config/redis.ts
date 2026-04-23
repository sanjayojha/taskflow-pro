import Redis from "ioredis";
import { env } from "./env";
import { logger } from "../utils/logger";

export const createRedisConnection = (): Redis => {
    const client = new Redis({
        host: env.REDIS_HOST,
        port: env.REDIS_PORT,
        password: env.REDIS_PASSWORD || undefined,
        maxRetriesPerRequest: null, // required by BullMQ
        enableReadyCheck: false, // required by BullMQ
    });
    client.on("connect", () => logger.info("Redis connected"));
    client.on("error", (err) => logger.error("Redis error:", err));
    return client;
};

export const redisConnection = createRedisConnection();
