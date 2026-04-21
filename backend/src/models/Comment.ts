import { Table, Column, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import { BaseModel } from "./BaseModel";
import { Task } from "./Task";
import { User } from "./User";

@Table({ tableName: "comments", underscored: true })
export class Comment extends BaseModel<Comment> {
    @ForeignKey(() => Task)
    @Column({ type: DataType.UUID, allowNull: false, field: "task_id" })
    taskId!: string;

    @ForeignKey(() => User)
    @Column({ type: DataType.UUID, allowNull: false, field: "user_id" })
    userId!: string;

    @Column({ type: DataType.TEXT, allowNull: false })
    body!: string;

    @BelongsTo(() => Task, "task_id")
    task!: Task;

    @BelongsTo(() => User, "user_id")
    user!: User;
}
