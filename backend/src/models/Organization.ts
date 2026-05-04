import { BelongsTo, Column, DataType, Default, ForeignKey, Table, Unique } from "sequelize-typescript";
import { BaseModel } from "./BaseModel";
import { NonAttribute, CreationOptional } from "sequelize";
import { User } from "./User";

export enum OrgPlan {
    PRO = "pro",
    FREE = "free",
}

@Table({ tableName: "organizations", underscored: true })
export class Organization extends BaseModel<Organization> {
    @Column({ type: DataType.STRING(100), allowNull: false })
    declare name: string;

    @Unique
    @Column({ type: DataType.STRING(100), allowNull: false })
    declare slug: string;

    @ForeignKey(() => User)
    @Column({ type: DataType.UUID, allowNull: false, field: "owner_id" })
    declare ownerId: string;

    @Default(OrgPlan.FREE)
    @Column({ type: DataType.ENUM(...Object.values(OrgPlan)), allowNull: false })
    declare plan: CreationOptional<OrgPlan>;

    @BelongsTo(() => User, "owner_id")
    declare owner: NonAttribute<User>;
}
