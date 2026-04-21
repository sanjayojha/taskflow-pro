import { QueryInterface, DataTypes } from "sequelize";

export const up = async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.createTable("users", {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true, allowNull: false },
        name: { type: DataTypes.STRING(100), allowNull: false },
        email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
        password_hash: { type: DataTypes.STRING(255), allowNull: false },
        avatar_url: { type: DataTypes.STRING(500), allowNull: true },
        role: {
            type: DataTypes.ENUM("admin", "member"),
            defaultValue: "member",
            allowNull: false,
        },
        is_verified: { type: DataTypes.BOOLEAN, defaultValue: false, allowNull: false },
        created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
        updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    });

    await queryInterface.addIndex("users", ["email"], { unique: true, name: "users_email_unique" });
};

export const down = async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.dropTable("users");
};
