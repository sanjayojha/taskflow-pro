import { logger } from "../utils/logger";
import { EmailJobData } from "../queues/emailQueue.types";
import { Job, Worker } from "bullmq";
import { sendMail } from "../utils/mailer";
import { inviteEmailTemplate, resetpasswordTemplate, verifyEmailTemplate } from "../utils/emailTemplates";
import { createRedisConnection } from "../config/redis";
import { EMAIL_QUEUE_NAME } from "../queues/emailQueue";

const processEmailJob = async (job: Job<EmailJobData>): Promise<void> => {
    const { data } = job;
    logger.info(`Processing email job [${data.type}] for ${data.to}`);

    switch (data.type) {
        case "VERIFY_EMAIL":
            await sendMail({
                to: data.to,
                subject: "Verify your TaskFlow Pro email",
                html: verifyEmailTemplate(data.name, data.token),
            });
            break;

        case "RESET_PASSWORD":
            await sendMail({
                to: data.to,
                subject: "Reset your TaskFlow Pro password",
                html: resetpasswordTemplate(data.name, data.token),
            });
            break;

        case "ORG_INVITE":
            await sendMail({
                to: data.to,
                subject: `You've been invited to join ${data.orgName} on TaskFlow Pro`,
                html: inviteEmailTemplate(data.inviterName, data.orgName, data.token),
            });

        default: {
            logger.warn("Unknown email job type received", data);
        }
    }
};

export const startEmailWorker = (): Worker<EmailJobData> => {
    // Workers need their own Redis connection — never share with the queue
    const workerConnection = createRedisConnection();
    const worker = new Worker(EMAIL_QUEUE_NAME, processEmailJob, {
        connection: workerConnection,
        concurrency: 3,
    });

    worker.on("completed", (job) => {
        logger.info(`Email job completed [${job.id}] type=${job.data.type}`);
    });

    worker.on("failed", (job, err) => {
        logger.error(`Email job failed [${job?.id}] type=${job?.data.type}:`, err);
    });

    worker.on("error", (err) => {
        logger.error("Email worker error:", err);
    });

    logger.info(`Email worker started`);

    return worker;
};
