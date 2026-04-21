import { QueryInterface, DataTypes } from "sequelize";

export const up = async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.createTable("project_members", {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true, allowNull: false },
        project_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: "projects", key: "id" },
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
        role: { type: DataTypes.ENUM("manager", "member", "viewer"), allowNull: false, defaultValue: "member" },
        created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    });

    await queryInterface.addIndex("project_members", ["project_id", "user_id"], { unique: true, name: "project_members_project_user_unique" });
};

export const down = async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.dropTable("project_members");
};
