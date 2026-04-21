import { QueryInterface, DataTypes } from "sequelize";

export const up = async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.createTable("refresh_tokens", {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true, allowNull: false },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: "users", key: "id" },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        },
        token_hash: { type: DataTypes.STRING(500), allowNull: false },
        expires_at: { type: DataTypes.DATE, allowNull: false },
        revoked: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
        created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    });

    await queryInterface.addIndex("refresh_tokens", ["user_id"], { name: "refresh_tokens_user_id_idx" });
    await queryInterface.addIndex("refresh_tokens", ["token_hash"], { name: "refresh_tokens_token_hash_idx" });
};

export const down = async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.dropTable("refresh_tokens");
};
