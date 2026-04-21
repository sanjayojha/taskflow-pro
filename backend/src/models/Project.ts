import { Table, Column, DataType, ForeignKey, BelongsTo, HasMany, Default } from "sequelize-typescript";
import { BaseModel } from "./BaseModel";
import { Organization } from "./Organization";
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
    orgId!: string;

    @Column({ type: DataType.STRING(150), allowNull: false })
    name!: string;

    @Column({ type: DataType.TEXT, allowNull: true })
    description?: string;

    @Default(ProjectStatus.ACTIVE)
    @Column({ type: DataType.ENUM(...Object.values(ProjectStatus)), allowNull: false })
    status!: ProjectStatus;

    @ForeignKey(() => User)
    @Column({ type: DataType.UUID, allowNull: false, field: "created_by" })
    createdBy!: string;

    @Column({ type: DataType.DATE, allowNull: true })
    deadline?: Date;

    @BelongsTo(() => Organization, "org_id")
    organization!: Organization;

    @BelongsTo(() => User, "created_by")
    creator!: User;
}
