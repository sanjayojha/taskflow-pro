import { BelongsTo, Column, DataType, Default, ForeignKey, Table } from "sequelize-typescript";
import { NonAttribute, CreationOptional } from "sequelize";
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
    declare orgId: string;

    @ForeignKey(() => User)
    @Column({ type: DataType.UUID, allowNull: false, field: "user_id" })
    declare userId: string;

    @Default(OrgMemberRole.MEMBER)
    @Column({ type: DataType.ENUM(...Object.values(OrgMemberRole)), allowNull: false })
    declare role: OrgMemberRole;

    @Default(DataType.NOW) // different than ccweb
    @Column({ type: DataType.DATE, allowNull: false, field: "joined_at" })
    declare joinedAt: CreationOptional<Date>;

    @BelongsTo(() => Organization, "org_id")
    declare organization: NonAttribute<Organization>;

    @BelongsTo(() => User, "user_id")
    declare user: NonAttribute<User>;
}
