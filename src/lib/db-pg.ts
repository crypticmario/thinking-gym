import { neon } from "@neondatabase/serverless";
import type { DbSchema } from "./types";
import { defaultData } from "./db";

let tableReady = false;

export async function getPgDb() {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  const sql = neon(url);

  if (!tableReady) {
    await sql`CREATE TABLE IF NOT EXISTS app_data (
      id TEXT PRIMARY KEY,
      data JSONB NOT NULL
    )`;
    tableReady = true;
  }

  const rows = await sql`SELECT data FROM app_data WHERE id = 'main'`;
  let data: DbSchema;

  if (rows.length === 0) {
    data = defaultData();
    await sql`INSERT INTO app_data (id, data) VALUES ('main', ${JSON.stringify(data)}::jsonb)`;
  } else {
    data = rows[0].data as DbSchema;
  }

  return {
    data,
    async write() {
      await sql`UPDATE app_data SET data = ${JSON.stringify(data)}::jsonb WHERE id = 'main'`;
    },
  };
}
