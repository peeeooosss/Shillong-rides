// Seed demo fleet + launch coupon. Idempotent (ON CONFLICT DO NOTHING).
// Usage: DATABASE_URL=... node scripts/seed.mjs
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { neon } from "@neondatabase/serverless";
import { splitStatements } from "./migrate.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const seedPath = join(here, "..", "db", "seed.sql");

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set. See .env.example.");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);
const text = readFileSync(seedPath, "utf8");
for (const stmt of splitStatements(text)) {
  await sql.query(stmt);
}
console.log("seed applied");
