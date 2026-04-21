import { QueryInterface, DataTypes } from "sequelize";

export const up = async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.createTable("attachments", {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true, allowNull: false },
        task_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: "tasks", key: "id" },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: "users", key: "id" },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        },
        filename: { type: DataTypes.STRING(255), allowNull: false },
        s3_key: { type: DataTypes.STRING(500), allowNull: false },
        size: { type: DataTypes.INTEGER, allowNull: false },
        created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    });

    await queryInterface.addIndex("attachments", ["task_id"], { name: "attachments_task_id_idx" });
};

export const down = async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.dropTable("attachments");
};
