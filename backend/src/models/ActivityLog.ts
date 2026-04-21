import { Table, Column, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import { BaseModel } from "./BaseModel";
import { User } from "./User";

@Table({ tableName: "activity_logs", underscored: true })
export class ActivityLog extends BaseModel<ActivityLog> {
    @Column({ type: DataType.STRING(50), allowNull: false, field: "entity_type" })
    entityType!: string;

    @Column({ type: DataType.UUID, allowNull: false, field: "entity_id" })
    entityId!: string;

    @ForeignKey(() => User)
    @Column({ type: DataType.UUID, allowNull: false, field: "user_id" })
    userId!: string;

    @Column({ type: DataType.STRING(100), allowNull: false })
    action!: string;

    @Column({ type: DataType.JSONB, allowNull: false, defaultValue: {} })
    meta!: Record<string, unknown>;

    @BelongsTo(() => User, "user_id")
    user!: User;
}
