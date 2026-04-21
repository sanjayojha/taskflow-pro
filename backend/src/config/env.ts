import dotenv from "dotenv";
dotenv.config();

function requireEnv(key: string): string {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
}

export const env = {
    NODE_ENV: process.env.NODE_ENV || "development",
    PORT: parseInt(process.env.PORT || "5000", 10),

    APP_URL: process.env.APP_URL || "http://localhost:3000",
    API_URL: process.env.API_URL || "http://localhost:5000",

    DB_HOST: requireEnv("DB_HOST"),
    DB_PORT: parseInt(process.env.DB_PORT || "5432", 10),
    DB_NAME: requireEnv("DB_NAME"),
    DB_USER: requireEnv("DB_USER"),
    DB_PASSWORD: requireEnv("DB_PASSWORD"),
    DB_POOL_MAX: parseInt(process.env.DB_POOL_MAX || "10", 10),
    DB_POOL_MIN: parseInt(process.env.DB_POOL_MIN || "2", 10),
    DB_POOL_ACQUIRE: parseInt(process.env.DB_POOL_ACQUIRE || "30000", 10),
    DB_POOL_IDLE: parseInt(process.env.DB_POOL_IDLE || "10000", 10),

    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || "default_key",
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "default_key",
    JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
    JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "7d",

    // add inside the env object:
    SMTP_HOST: process.env.SMTP_HOST || "localhost",
    SMTP_PORT: parseInt(process.env.SMTP_PORT || "1025", 10),
    SMTP_USER: process.env.SMTP_USER || "",
    SMTP_PASS: process.env.SMTP_PASS || "",
    EMAIL_FROM: process.env.EMAIL_FROM || "noreply@taskflow.local",
};
