// Minimal migration runner. Tracks applied files in schema_migrations.
// Usage: DATABASE_URL=... node scripts/migrate.mjs
//
// The Neon HTTP driver rejects multiple statements in one prepared statement,
// so statements are split (respecting comments + string literals) and run in order.
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { neon } from "@neondatabase/serverless";

/** Split SQL into statements on top-level semicolons. */
export function splitStatements(sql) {
  const out = [];
  let buf = "";
  let i = 0;
  let inSingle = false;
  let inDollar = null; // dollar-quote tag when inside one
  while (i < sql.length) {
    const ch = sql[i];
    const next = sql[i + 1];
    if (inSingle) {
      buf += ch;
      if (ch === "'" && next === "'") { buf += next; i += 2; continue; }
      if (ch === "'") inSingle = false;
      i++;
      continue;
    }
    if (inDollar) {
      buf += ch;
      if (ch === "$" && sql.startsWith(inDollar, i)) {
        buf += inDollar.slice(1);
        i += inDollar.length;
        inDollar = null;
        continue;
      }
      i++;
      continue;
    }
    // line comment
    if (ch === "-" && next === "-") {
      const nl = sql.indexOf("\n", i);
      if (nl === -1) break;
      i = nl + 1;
      continue;
    }
    // dollar quote start
    if (ch === "$") {
      const m = /^\$[A-Za-z_]*\$/.exec(sql.slice(i));
      if (m) { inDollar = m[0]; buf += inDollar.slice(0, -1) + "$"; i += m[0].length; continue; }
    }
    if (ch === "'") { inSingle = true; buf += ch; i++; continue; }
    if (ch === ";") {
      if (buf.trim()) out.push(buf.trim());
      buf = "";
      i++;
      continue;
    }
    buf += ch;
    i++;
  }
  if (buf.trim()) out.push(buf.trim());
  return out;
}

async function runFile(sql, text) {
  for (const stmt of splitStatements(text)) {
    await sql.query(stmt);
  }
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) {
  const root = join(dirname(fileURLToPath(import.meta.url)), "..", "db", "migrations");
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set. See .env.example.");
    process.exit(1);
  }
  const sql = neon(process.env.DATABASE_URL);
  await runFile(sql, "CREATE TABLE IF NOT EXISTS schema_migrations (name TEXT PRIMARY KEY, applied_at TIMESTAMPTZ NOT NULL DEFAULT now())");
  const applied = new Set((await sql`SELECT name FROM schema_migrations`).map((r) => r.name));
  const files = readdirSync(root).filter((f) => f.endsWith(".sql")).sort();
  for (const f of files) {
    if (applied.has(f)) {
      console.log(`skip ${f}`);
      continue;
    }
    console.log(`apply ${f}`);
    await runFile(sql, readFileSync(join(root, f), "utf8"));
    await sql`INSERT INTO schema_migrations (name) VALUES (${f})`;
  }
  console.log("migrations up to date");
}
