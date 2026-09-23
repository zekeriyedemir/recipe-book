import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import nextEnv from "@next/env";
import pg from "pg";

const root = fileURLToPath(new URL("../", import.meta.url));
nextEnv.loadEnvConfig(root);
if (!process.env.PG_URI) {
  console.error("Add PG_URI to .env.local before running database setup.");
  process.exit(1);
}
const pool = new pg.Pool({ connectionString: process.env.PG_URI });
let client;
try {
  client = await pool.connect();
  await client.query("BEGIN");
  await client.query("SELECT pg_advisory_xact_lock(8721901)");
  const { rows: tables } = await client.query("SELECT to_regclass('public.recipes') AS name");
  const count = tables[0].name
    ? Number((await client.query("SELECT COUNT(*) AS count FROM recipes")).rows[0].count) : 0;
  if (count === 0) {
    await client.query(await readFile(new URL("../sql/start.sql", import.meta.url), "utf8"));
    console.log("Imported the instructor's recipes into the empty database.");
  } else {
    console.log(`Kept the ${count} existing recipes; no seed data was inserted.`);
  }
  await client.query(await readFile(new URL("../sql/001-cookbook.sql", import.meta.url), "utf8"));
  await client.query("COMMIT");
  console.log("Cookbook table is ready.");
} catch {
  if (client) await client.query("ROLLBACK").catch(() => {});
  console.error("Database setup failed. Check PG_URI, network access and database permissions. No changes were committed.");
  process.exitCode = 1;
} finally {
  client?.release();
  await pool.end();
}
