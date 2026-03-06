import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "@/db/schema";
import "dotenv";
import assert from "node:assert";

//with this error thrown at this level, define config won't start
assert(process.env.DATABASE_URL, "You need a DATABASE_URL");

export const sql = neon(process.env.DATABASE_URL);

const db = drizzle(sql, { schema });

export default db;
