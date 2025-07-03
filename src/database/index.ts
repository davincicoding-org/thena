import type { NeonQueryFunction } from "@neondatabase/serverless";
import { neon } from "@neondatabase/serverless";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { drizzle as drizzlePostgres } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "@/env";

import * as schema from "./schema";

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  client: NeonQueryFunction<false, false> | postgres.Sql | undefined;
};

// Determine if we're using a local database (contains localhost or 127.0.0.1)
const isLocalDatabase = ["localhost", "127.0.0.1"].includes(
  new URL(env.DATABASE_URL).hostname,
);

// Create the database instance with proper typing
const createDatabase = () => {
  if (isLocalDatabase) {
    // Use postgres driver for local development
    const client =
      (globalForDb.client as postgres.Sql) ?? postgres(env.DATABASE_URL);
    if (env.NODE_ENV !== "production") globalForDb.client = client;

    return drizzlePostgres({
      client,
      schema,
      casing: "snake_case",
    });
  } else {
    // Use Neon serverless driver for production/Neon
    const client =
      (globalForDb.client as NeonQueryFunction<false, false>) ??
      neon(env.DATABASE_URL);
    if (env.NODE_ENV !== "production") globalForDb.client = client;

    return drizzleNeon({
      client,
      schema,
      casing: "snake_case",
    });
  }
};

export const db = createDatabase();
