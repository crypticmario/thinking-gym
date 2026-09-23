import { JSONFilePreset } from "lowdb/node";
import fs from "fs";
import path from "path";
import type { DbSchema } from "./types";
import { defaultData } from "./db";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "db.json");

export async function getLocalDb() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  return JSONFilePreset<DbSchema>(DB_PATH, defaultData());
}
