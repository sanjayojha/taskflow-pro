import { QueryInterface, DataTypes } from "sequelize";

export const up = async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.createTable("notifications", {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true, allowNull: false },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: "users", key: "id" },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        },
        type: {
            type: DataTypes.ENUM("task_assigned", "task_commented", "task_due", "org_invite", "project_added"),
            allowNull: false,
        },
        payload: { type: DataTypes.JSONB, allowNull: false, defaultValue: {} },
        is_read: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
        created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    });

    await queryInterface.addIndex("notifications", ["user_id", "is_read"], { name: "notifications_user_read_idx" });
};

export const down = async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.dropTable("notifications");
};
