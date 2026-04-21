import { QueryInterface, DataTypes } from "sequelize";

export const up = async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.createTable("activity_logs", {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true, allowNull: false },
        entity_type: { type: DataTypes.STRING(50), allowNull: false },
        entity_id: { type: DataTypes.UUID, allowNull: false },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: "users", key: "id" },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        },
        action: { type: DataTypes.STRING(100), allowNull: false },
        meta: { type: DataTypes.JSONB, allowNull: false, defaultValue: {} },
        created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    });

    await queryInterface.addIndex("activity_logs", ["entity_type", "entity_id"], { name: "activity_logs_entity_idx" });
    await queryInterface.addIndex("activity_logs", ["user_id"], { name: "activity_logs_user_id_idx" });
};

export const down = async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.dropTable("activity_logs");
};
