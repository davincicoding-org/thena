import { defineConfig } from "drizzle-kit";

import { env } from "@/env";

export default defineConfig({
  dialect: "postgresql",
  schema: "./db/schema.ts",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  out: "./db/migrations",
  casing: "snake_case",
});
