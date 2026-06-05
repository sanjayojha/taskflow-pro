import { AllowNull, Column, DataType, Default, Table, HasMany, Unique } from "sequelize-typescript";
import { NonAttribute, CreationOptional } from "sequelize";
import { BaseModel } from "./BaseModel";

export enum UserRole {
    MEMBER = "member",
    ADMIN = "admin",
}

@Table({ tableName: "users", underscored: true })
export class User extends BaseModel<User> {
    @Column({ type: DataType.STRING(100), allowNull: false })
    declare name: string;

    @Unique
    @Column({ type: DataType.STRING(255), allowNull: false })
    declare email: string;

    @Column({ type: DataType.STRING(255), allowNull: false, field: "password_hash" })
    declare passwordHash: string;

    @Column({ type: DataType.STRING(500), allowNull: true, field: "avatar_url" })
    declare avatarUrl?: CreationOptional<string>;

    @Default(UserRole.MEMBER)
    @Column({ type: DataType.ENUM(...Object.values(UserRole)), allowNull: false })
    declare role: CreationOptional<UserRole>;

    @Default(false)
    @Column({ type: DataType.BOOLEAN, allowNull: false, field: "is_verified" })
    declare isVerified: CreationOptional<boolean>;

    @AllowNull(true)
    @Column({ type: DataType.STRING(64), field: "email_verify_token" })
    declare emailVerifyToken?: string | null;

    @AllowNull(true)
    @Column({ type: DataType.DATE, field: "email_verify_expires" })
    emailVerifyExpires?: Date | null;

    @AllowNull(true)
    @Column({ type: DataType.STRING(64), field: "password_reset_token" })
    passwordResetToken?: string | null;

    @AllowNull(true)
    @Column({ type: DataType.DATE, field: "password_reset_expires" })
    passwordResetExpires?: Date | null;

    // -- Associations
    @HasMany(() => OrgMember, "user_id")
    declare orgMemberships: NonAttribute<OrgMember[]>;

    @HasMany(() => ProjectMember, "user_id")
    declare projectMemberships: NonAttribute<ProjectMember[]>;

    @HasMany(() => RefreshToken, "user_id")
    declare refreshTokens: NonAttribute<RefreshToken[]>;

    @HasMany(() => Task, "assignee_id")
    declare assignedTasks: NonAttribute<Task[]>;

    @HasMany(() => Comment, "user_id")
    declare comments: NonAttribute<Comment[]>;

    @HasMany(() => Notification, "user_id")
    declare notifications: NonAttribute<Notification[]>;

    @HasMany(() => ActivityLog, "user_id")
    declare activityLogs: NonAttribute<ActivityLog[]>;
}
import { OrgMember } from "./OrgMember";
import { ProjectMember } from "./ProjectMember";
import { RefreshToken } from "./RefreshToken";
import { Task } from "./Task";
import { Comment } from "./Comment";
import { Notification } from "./Notification";
import { ActivityLog } from "./ActivityLog";
