import { Table, Column, DataType, ForeignKey, BelongsTo, Default } from "sequelize-typescript";
import { BaseModel } from "./BaseModel";
import { User } from "./User";

export enum NotificationType {
    TASK_ASSIGNED = "task_assigned",
    TASK_COMMENTED = "task_commented",
    TASK_DUE = "task_due",
    ORG_INVITE = "org_invite",
    PROJECT_ADDED = "project_added",
}

@Table({ tableName: "notifications", underscored: true })
export class Notification extends BaseModel<Notification> {
    @ForeignKey(() => User)
    @Column({ type: DataType.UUID, allowNull: false, field: "user_id" })
    userId!: string;

    @Column({ type: DataType.ENUM(...Object.values(NotificationType)), allowNull: false })
    type!: NotificationType;

    @Column({ type: DataType.JSONB, allowNull: false, defaultValue: {} })
    payload!: Record<string, unknown>;

    @Default(false)
    @Column({ type: DataType.BOOLEAN, allowNull: false, field: "is_read" })
    isRead!: boolean;

    @BelongsTo(() => User, "user_id")
    user!: User;
}
