import { QueryInterface, DataTypes } from "sequelize";
export const up = async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.addColumn("users", "email_verify_token", {
        type: DataTypes.STRING(64),
        allowNull: true,
    });
    await queryInterface.addColumn("users", "email_verify_expires", {
        type: DataTypes.DATE,
        allowNull: true,
    });
    await queryInterface.addColumn("users", "password_reset_token", {
        type: DataTypes.STRING(64),
        allowNull: true,
    });
    await queryInterface.addColumn("users", "password_reset_expires", {
        type: DataTypes.DATE,
        allowNull: true,
    });
};

export const down = async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.removeColumn("users", "email_verify_token");
    await queryInterface.removeColumn("users", "email_verify_expires");
    await queryInterface.removeColumn("users", "password_reset_token");
    await queryInterface.removeColumn("users", "password_reset_expires");
};
