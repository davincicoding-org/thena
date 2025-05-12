import "client-only";

import type { PgliteDatabase } from "drizzle-orm/pglite";

import * as schema from "../db/schema";
import MIGRATION_META from "./migrations/meta/_journal.json";

let dbPromise: Promise<PgliteDatabase<typeof schema>> | undefined;

export const getClientDB = async (): Promise<PgliteDatabase<typeof schema>> => {
  if (dbPromise) return dbPromise;

  dbPromise = (async () => {
    const { drizzle } = await import("drizzle-orm/pglite");
    const db = drizzle({
      logger: true,
      connection: { dataDir: "idb://thena" },
      schema,
      casing: "snake_case",
    });

    const latestClientMigration = await db.query.clientMigrations
      .findFirst({
        orderBy: (migrations, { desc }) => [desc(migrations.appliedAt)],
      })
      .catch(() => undefined);

    const migrations = MIGRATION_META.entries.map((entry) => entry.tag);

    const migrationsToApply = latestClientMigration?.tag
      ? migrations.slice(migrations.indexOf(latestClientMigration.tag) + 1)
      : migrations;

    for (const migration of migrationsToApply) {
      const migrationFile = (await import(`./migrations/${migration}.sql`)) as {
        default: string;
      };

      const statements = migrationFile.default.split(
        "--> statement-breakpoint\n",
      );

      for (const statement of statements) {
        await db.execute(statement).catch((e) => console.error(e));
      }

      await db.insert(schema.clientMigrations).values({ tag: migration });
    }

    return db;
  })();

  return dbPromise;
};
