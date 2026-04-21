import { env } from "../config/env";
import nodemailer, { Transporter } from "nodemailer";
import { logger } from "./logger";

let transporter: Transporter;

export const getMailer = (): Transporter => {
    if (!transporter) {
        transporter = nodemailer.createTransport({
            host: env.SMTP_HOST,
            port: env.SMTP_PORT,
            secure: false,
            auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined,
        });
    }
    return transporter;
};

interface SendMailOptions {
    to: string;
    subject: string;
    html: string;
}

export const sendMail = async (options: SendMailOptions): Promise<void> => {
    try {
        const mailer = getMailer();
        await mailer.sendMail({
            from: env.EMAIL_FROM,
            to: options.to,
            subject: options.subject,
            html: options.html,
        });
        logger.info(`Email sent to ${options.to} — "${options.subject}"`);
    } catch (error) {
        logger.error("Failed to send email:", error);
        throw error;
    }
};
