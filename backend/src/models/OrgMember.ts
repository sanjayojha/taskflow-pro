import { BelongsTo, Column, DataType, Default, ForeignKey, Table } from "sequelize-typescript";
import { BaseModel } from "./BaseModel";
import { Organization } from "./Organization";
import { User } from "./User";

export enum OrgMemberRole {
    OWNER = "owner",
    ADMIN = "admin",
    MEMBER = "member",
}

@Table({ tableName: "org_members", underscored: true })
export class OrgMember extends BaseModel<OrgMember> {
    @ForeignKey(() => Organization)
    @Column({ type: DataType.UUID, allowNull: false, field: "org_id" })
    orgId!: string;

    @ForeignKey(() => User)
    @Column({ type: DataType.UUID, allowNull: false, field: "user_id" })
    userId!: string;

    @Default(OrgMemberRole.MEMBER)
    @Column({ type: DataType.ENUM(...Object.values(OrgMemberRole)), allowNull: false })
    role!: OrgMemberRole;

    @Default(DataType.NOW) // different than ccweb
    @Column({ type: DataType.DATE, allowNull: false, field: "joined_at" })
    joinedAt!: Date;

    @BelongsTo(() => Organization, "org_id")
    organization!: Organization;

    @BelongsTo(() => User, "user_id")
    user!: User;
}
