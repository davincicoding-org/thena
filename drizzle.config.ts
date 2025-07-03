import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env.development.local" });
config({ path: ".env.local" });
config({ path: ".env" });

console.log(process.env.DATABASE_URL);

export default defineConfig({
  dialect: "postgresql",
  schema: "./database/schema.ts",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  out: "./database/migrations",
  casing: "snake_case",
});
