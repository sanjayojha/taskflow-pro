import { sequelize } from "../config/database";
import path from "path";
import { SequelizeStorage, Umzug } from "umzug";

export const migrator = new Umzug({
    migrations: {
        glob: ["[0-9]*.ts", { cwd: path.join(__dirname) }],
        resolve: ({ name, path: migPath }) => {
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const migration = require(migPath!);
            return {
                name,
                up: async () => migration.up(sequelize.getQueryInterface()),
                down: async () => migration.down(sequelize.getQueryInterface()),
            };
        },
    },

    storage: new SequelizeStorage({
        sequelize,
        tableName: "migrations",
    }),

    logger: console,
});

// Run when called directly: ts-node src/migrations/runner.ts
if (require.main === module) {
    migrator
        .up()
        .then(() => {
            console.log("All migrations ran successfully!");
            process.exit(0);
        })
        .catch((err) => {
            console.error("Migration failed:", err);
            process.exit(1);
        });
}
