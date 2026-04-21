import { QueryInterface, DataTypes } from "sequelize";

export const up = async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.createTable("tasks", {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true, allowNull: false },
        project_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: "projects", key: "id" },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        },
        title: { type: DataTypes.STRING(255), allowNull: false },
        description: { type: DataTypes.TEXT, allowNull: true },
        status: {
            type: DataTypes.ENUM("backlog", "in_progress", "review", "done"),
            allowNull: false,
            defaultValue: "backlog",
        },
        priority: {
            type: DataTypes.ENUM("low", "medium", "high", "critical"),
            allowNull: false,
            defaultValue: "medium",
        },
        assignee_id: {
            type: DataTypes.UUID,
            allowNull: true,
            references: { model: "users", key: "id" },
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
        },
        due_date: { type: DataTypes.DATE, allowNull: true },
        position: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    });
};

export const down = async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.dropTable("tasks");
};
