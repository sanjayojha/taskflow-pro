import { Table, Column, DataType, ForeignKey, BelongsTo, Default } from "sequelize-typescript";
import { BaseModel } from "./BaseModel";
import { Project } from "./Project";
import { User } from "./User";

export enum ProjectMemberRole {
    MANAGER = "manager",
    MEMBER = "member",
    VIEWER = "viewer",
}

@Table({ tableName: "project_members", underscored: true })
export class ProjectMember extends BaseModel<ProjectMember> {
    @ForeignKey(() => Project)
    @Column({ type: DataType.UUID, allowNull: false, field: "project_id" })
    projectId!: string;

    @ForeignKey(() => User)
    @Column({ type: DataType.UUID, allowNull: false, field: "user_id" })
    userId!: string;

    @Default(ProjectMemberRole.MEMBER)
    @Column({ type: DataType.ENUM(...Object.values(ProjectMemberRole)), allowNull: false })
    role!: ProjectMemberRole;

    @BelongsTo(() => Project, "project_id")
    project!: Project;

    @BelongsTo(() => User, "user_id")
    user!: User;
}
