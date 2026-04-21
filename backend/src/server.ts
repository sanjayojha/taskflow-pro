import "reflect-metadata";
import app from "./app";
import { connectDatabase } from "./config/database";
import { logger } from "./utils/logger";
import { env } from "./config/env";

const bootstrap = async (): Promise<void> => {
    // 1. Connect to database first
    await connectDatabase();

    // 2. Start HTTP server only if DB connected
    app.listen(env.PORT, () => {
        logger.info(`Server running on http://localhost:${env.PORT}`);
        logger.info(`Enviornment: ${env.NODE_ENV}`);
    });
};

bootstrap().catch((err) => {
    logger.error(`Failed to start server:`, err);
    process.exit(1);
});
