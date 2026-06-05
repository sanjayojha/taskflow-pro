import { Table, Column, DataType, ForeignKey, BelongsTo, HasMany, Default } from "sequelize-typescript";
import { BaseModel } from "./BaseModel";
import { Organization } from "./Organization";
import { NonAttribute, CreationOptional } from "sequelize";
import { User } from "./User";

export enum ProjectStatus {
    ACTIVE = "active",
    ARCHIVED = "archived",
    COMPLETED = "completed",
}

@Table({ tableName: "projects", underscored: true })
export class Project extends BaseModel<Project> {
    @ForeignKey(() => Organization)
    @Column({ type: DataType.UUID, allowNull: false, field: "org_id" })
    declare orgId: string;

    @Column({ type: DataType.STRING(150), allowNull: false })
    declare name: string;

    @Column({ type: DataType.TEXT, allowNull: true })
    declare description?: string;

    @Default(ProjectStatus.ACTIVE)
    @Column({ type: DataType.ENUM(...Object.values(ProjectStatus)), allowNull: false })
    declare status: ProjectStatus;

    @ForeignKey(() => User)
    @Column({ type: DataType.UUID, allowNull: false, field: "created_by" })
    declare createdBy: string;

    @Column({ type: DataType.DATE, allowNull: true })
    declare deadline?: Date;

    @BelongsTo(() => Organization, "org_id")
    declare organization: NonAttribute<Organization>;

    @BelongsTo(() => User, "created_by")
    declare creator: NonAttribute<User>;

    @HasMany(() => ProjectMember, "project_id")
    declare members: NonAttribute<ProjectMember[]>;

    @HasMany(() => Task, "project_id")
    declare tasks: NonAttribute<Task[]>;
}

// Avoid circular import — import after class declaration
import { ProjectMember } from "./ProjectMember";
import { Task } from "./Task";
