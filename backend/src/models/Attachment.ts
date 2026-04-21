import { Table, Column, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import { BaseModel } from "./BaseModel";
import { Task } from "./Task";
import { User } from "./User";

@Table({ tableName: "attachments", underscored: true })
export class Attachment extends BaseModel<Attachment> {
    @ForeignKey(() => Task)
    @Column({ type: DataType.UUID, allowNull: false, field: "task_id" })
    taskId!: string;

    @ForeignKey(() => User)
    @Column({ type: DataType.UUID, allowNull: false, field: "user_id" })
    userId!: string;

    @Column({ type: DataType.STRING(255), allowNull: false })
    filename!: string;

    @Column({ type: DataType.STRING(500), allowNull: false, field: "s3_key" })
    s3Key!: string;

    @Column({ type: DataType.INTEGER, allowNull: false })
    size!: number;

    @BelongsTo(() => Task, "task_id")
    task!: Task;

    @BelongsTo(() => User, "user_id")
    user!: User;
}
