import { Table, Column, DataType, ForeignKey, BelongsTo, Default, Model } from "sequelize-typescript";
import { NonAttribute, CreationOptional } from "sequelize";
import { BaseModel } from "./BaseModel";
import { User } from "./User";

@Table({ tableName: "refresh_tokens", underscored: true })
export class RefreshToken extends BaseModel<RefreshToken> {
    @ForeignKey(() => User)
    @Column({ type: DataType.UUID, allowNull: false, field: "user_id" })
    declare userId: string;

    @Column({ type: DataType.STRING(500), allowNull: false, field: "token_hash" })
    declare tokenHash: string;

    @Column({ type: DataType.DATE, allowNull: false, field: "expires_at" })
    declare expiresAt: Date;

    @Default(false)
    @Column({ type: DataType.BOOLEAN, allowNull: false })
    declare revoked: CreationOptional<boolean>;

    @BelongsTo(() => User, "user_id")
    declare user: NonAttribute<User>;
}
