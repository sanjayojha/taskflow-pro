import { env } from "../config/env";
const isDev = env.NODE_ENV === "development";

export const logger = {
    info: (msg: string, ...args: unknown[]) => {
        if (isDev) {
            console.log(`[INFO]: ${msg}`, ...args);
        }
    },

    warn: (msg: string, ...args: unknown[]) => {
        console.log(`[WARN]: ${msg}`, ...args);
    },

    error: (msg: string, ...args: unknown[]) => {
        console.log(`[ERROR]: ${msg}`, ...args);
    },
};
