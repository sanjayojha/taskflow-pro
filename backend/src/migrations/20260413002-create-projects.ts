import { QueryInterface, DataTypes } from "sequelize";

export const up = async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.createTable("projects", {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true, allowNull: false },
        org_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: "organizations", key: "id" },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        },
        name: { type: DataTypes.STRING(150), allowNull: false },
        description: { type: DataTypes.TEXT, allowNull: true },
        status: {
            type: DataTypes.ENUM("active", "archived", "completed"),
            allowNull: false,
            defaultValue: "active",
        },
        created_by: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: "users", key: "id" },
            onUpdate: "CASCADE",
            onDelete: "RESTRICT",
        },
        deadline: { type: DataTypes.DATE, allowNull: true },
        created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    });

    await queryInterface.addIndex("projects", ["org_id"], { name: "projects_org_id_idx" });
};

export const down = async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.dropTable("projects");
};
