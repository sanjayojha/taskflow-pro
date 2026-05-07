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
    const [command, flag, value] = process.argv.slice(2);

    const run = async () => {
        switch (command) {
            case "up": {
                await migrator.up();
                console.log("All pending migrations ran successfully!");
                break;
            }

            case "down": {
                if (flag === "--to" && value) {
                    await migrator.down({ to: value });
                    console.log(`Rolled back to: ${value}`);
                } else {
                    await migrator.down();
                    console.log("Rolled back last migration");
                }
                break;
            }

            case "status": {
                const executed = await migrator.executed();
                const pending = await migrator.pending();

                console.log("\n-- Executed ---");
                executed.forEach((m) => console.log(" ✅ ", m.name));

                console.log("\n-- Pending ---");
                if (pending.length === 0) {
                    console.log("  (none)");
                } else {
                    pending.forEach((m) => console.log(" ⏳ ", m.name));
                }
                console.log("");
                break;
            }

            default: {
                await migrator.up();
                console.log("All pending migrations ran successfully!");
            }
        }
    };

    run()
        .then(() => process.exit(0))
        .catch((err) => {
            console.error("Migration error:", err);
            process.exit(1);
        });
}
