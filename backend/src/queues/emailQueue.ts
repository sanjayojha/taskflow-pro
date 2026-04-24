import { Queue } from "bullmq";
import { EmailJobData } from "./emailQueue.types";
import { redisConnection } from "../config/redis";

export const EMAIL_QUEUE_NAME = "email";
export const emailQueue = new Queue<EmailJobData>(EMAIL_QUEUE_NAME, {
    connection: redisConnection,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: "exponential",
            delay: 3000,
        },
        removeOnComplete: { count: 10 }, // keep last 10 completed jobs
        removeOnFail: { count: 50 }, // keep last 50 failed for debugging
    },
});
