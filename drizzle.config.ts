import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env.development.local" });
config({ path: ".env.local" });
config({ path: ".env" });

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/database/schema.ts",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  out: "./src/database/migrations",
  casing: "snake_case",
});
