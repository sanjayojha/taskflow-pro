import { QueryInterface, DataTypes } from "sequelize";

export const up = async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.createTable("organizations", {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true, allowNull: false },
        name: { type: DataTypes.STRING(100), allowNull: false },
        slug: { type: DataTypes.STRING(100), allowNull: false, unique: true },
        owner_id: {
            type: DataTypes.UUID,
            references: { model: "users", key: "id" },
            onUpdate: "CASCADE",
            onDelete: "RESTRICT",
            allowNull: false,
        },
        plan: { type: DataTypes.ENUM("free", "pro"), defaultValue: "free", allowNull: false },
        created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
        updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    });

    await queryInterface.addIndex("organizations", ["slug"], { unique: true, name: "orgs_slug_unique" });
};

export const down = async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.dropTable("organizations");
};
