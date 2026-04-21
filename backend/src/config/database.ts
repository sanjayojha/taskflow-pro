import { Sequelize } from "sequelize-typescript";
import { env } from "./env";

import { User } from "../models/User";
import { Organization } from "../models/Organization";
import { OrgMember } from "../models/OrgMember";
import { Project } from "../models/Project";
import { ProjectMember } from "../models/ProjectMember";
import { Task } from "../models/Task";
import { Comment } from "../models/Comment";
import { Attachment } from "../models/Attachment";
import { Notification } from "../models/Notification";
import { ActivityLog } from "../models/ActivityLog";
import { RefreshToken } from "../models/RefreshToken";

export const sequelize = new Sequelize({
    dialect: "postgres",
    host: env.DB_HOST,
    port: env.DB_PORT,
    database: env.DB_NAME,
    username: env.DB_USER,
    password: env.DB_PASSWORD,
    models: [User, Organization, OrgMember, Project, ProjectMember, Task, Comment, Attachment, Notification, ActivityLog, RefreshToken],

    pool: {
        max: env.DB_POOL_MAX,
        min: env.DB_POOL_MIN,
        acquire: env.DB_POOL_ACQUIRE,
        idle: env.DB_POOL_IDLE,
    },

    logging: env.NODE_ENV === "development" ? (msg: string) => console.log(`[DB]: ${msg}`) : false,
    define: {
        underscored: true, // use snake_case columns in DB
        timestamps: true, // auto createdAt / updatedAt
        createdAt: "created_at",
        updatedAt: "updated_at",
    },
});

export const connectDatabase = async (): Promise<void> => {
    try {
        await sequelize.authenticate();
        console.log(`Database connected successfully!`);
    } catch (error) {
        console.error(`Unable to connect to the database:`, error);
        process.exit(1);
    }
};
