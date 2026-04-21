import { DataTypes, QueryInterface } from "sequelize";

export const up = async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.createTable("org-members", {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true, allowNull: false },
        org_id: {
            type: DataTypes.UUID,
            references: {
                model: "organizations",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
            allowNull: false,
        },
        user_id: {
            type: DataTypes.UUID,
            references: {
                model: "users",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM("owner", "admin", "member"),
            defaultValue: "member",
            allowNull: false,
        },
        joined_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    });
};

export const down = async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.dropTable("org_members");
};
