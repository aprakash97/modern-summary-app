import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import assert from "node:assert";

//with this error thrown at this level, define config won't start
assert(process.env.DATABASE_URL, "You need a DATABASE_URL");

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  dialect: "postgresql",
});
