// Minimal migration runner. Tracks applied files in schema_migrations.
// Usage: DATABASE_URL=... node scripts/migrate.mjs
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { neon } from "@neondatabase/serverless";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "db", "migrations");
const sql = neon(process.env.DATABASE_URL);
if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set. See .env.example.");
  process.exit(1);
}

await sql`CREATE TABLE IF NOT EXISTS schema_migrations (name TEXT PRIMARY KEY, applied_at TIMESTAMPTZ NOT NULL DEFAULT now())`;
const applied = new Set((await sql`SELECT name FROM schema_migrations`).map((r) => r.name));
const files = readdirSync(root).filter((f) => f.endsWith(".sql")).sort();

for (const f of files) {
  if (applied.has(f)) {
    console.log(`skip ${f}`);
    continue;
  }
  console.log(`apply ${f}`);
  await sql.query(readFileSync(join(root, f), "utf8"));
  await sql`INSERT INTO schema_migrations (name) VALUES (${f})`;
}
console.log("migrations up to date");
