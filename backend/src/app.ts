import "reflect-metadata";
import express, { Application, Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import { errorHandler } from "./middlewares/errorHandler";
import { env } from "./config/env";
import router from "./routes";
import cookieParser from "cookie-parser";

const app: Application = express();

app.use(helmet());
app.use(cors({ origin: env.APP_URL, credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

app.get("/health", (_req: Request, res: Response) => {
    res.json({
        status: "OK",
        environment: env.NODE_ENV,
        timestamp: new Date().toISOString(),
    });
});

// Rest of the route will be added here
app.use("/api/v1", router);

// 404
app.use((_req: Request, res: Response) => {
    res.status(404).json({ success: false, message: "Route not found" });
});
app.use(errorHandler);

export default app;
