import { Column, CreatedAt, DataType, Default, Model, PrimaryKey, UpdatedAt } from "sequelize-typescript";
import { InferAttributes, InferCreationAttributes } from "sequelize";
import { CreationOptional } from "sequelize";

export abstract class BaseModel<T extends BaseModel<T>> extends Model<InferAttributes<T>, InferCreationAttributes<T>> {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    declare id: CreationOptional<string>;

    @CreatedAt
    @Column({ type: DataType.DATE, field: "created_at" })
    declare createdAt: CreationOptional<Date>;

    @UpdatedAt
    @Column({ type: DataType.DATE, field: "updated_at" })
    declare updatedAt: CreationOptional<Date>;
}
