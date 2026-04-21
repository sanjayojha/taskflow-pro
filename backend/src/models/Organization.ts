import { BelongsTo, Column, DataType, Default, ForeignKey, Table, Unique } from "sequelize-typescript";
import { BaseModel } from "./BaseModel";
import { User } from "./User";

export enum OrgPlan {
    PRO = "pro",
    FREE = "free",
}

@Table({ tableName: "organizations", underscored: true })
export class Organization extends BaseModel<Organization> {
    @Column({ type: DataType.STRING(100), allowNull: false })
    name!: string;

    @Unique
    @Column({ type: DataType.STRING(100), allowNull: false })
    slug!: string;

    @ForeignKey(() => User)
    @Column({ type: DataType.UUID, allowNull: false, field: "owner_id" })
    ownerId!: string;

    @BelongsTo(() => User, "owner_id")
    owner!: User;

    @Default(OrgPlan.FREE)
    @Column({ type: DataType.ENUM(...Object.values(OrgPlan)), allowNull: false })
    plan!: OrgPlan;
}
