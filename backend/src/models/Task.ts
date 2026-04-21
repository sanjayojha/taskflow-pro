import { Table, Column, DataType, ForeignKey, BelongsTo, HasMany, Default } from "sequelize-typescript";
import { BaseModel } from "./BaseModel";
import { Project } from "./Project";
import { User } from "./User";

export enum TaskStatus {
    BACKLOG = "backlog",
    IN_PROGRESS = "in_progress",
    REVIEW = "review",
    DONE = "done",
}

export enum TaskPriority {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    CRITICAL = "critical",
}

@Table({ tableName: "tasks", underscored: true })
export class Task extends BaseModel<Task> {
    @ForeignKey(() => Project)
    @Column({ type: DataType.UUID, allowNull: false, field: "project_id" })
    projectId!: string;

    @Column({ type: DataType.STRING(255), allowNull: false })
    title!: string;

    @Column({ type: DataType.TEXT, allowNull: true })
    description?: string;

    @Default(TaskStatus.BACKLOG)
    @Column({ type: DataType.ENUM(...Object.values(TaskStatus)), allowNull: false })
    status!: TaskStatus;

    @Default(TaskPriority.MEDIUM)
    @Column({ type: DataType.ENUM(...Object.values(TaskPriority)), allowNull: false })
    priority!: TaskPriority;

    @ForeignKey(() => User)
    @Column({ type: DataType.UUID, allowNull: true, field: "assignee_id" })
    assigneeId?: string;

    @Column({ type: DataType.DATE, allowNull: true, field: "due_date" })
    dueDate?: Date;

    @Default(0)
    @Column({ type: DataType.INTEGER, allowNull: false })
    position!: number;

    @BelongsTo(() => Project, "project_id")
    project!: Project;

    @BelongsTo(() => User, "assignee_id")
    assignee!: User;
}
