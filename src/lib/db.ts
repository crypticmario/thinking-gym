import { JSONFilePreset } from "lowdb/node";
import fs from "fs";
import path from "path";
import type { DbSchema } from "./types";
import { MODEL_SEED } from "./modelSeed";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "db.json");

function defaultData(): DbSchema {
  return {
    startedAt: null,
    entries: [],
    models: MODEL_SEED.map((m) => ({
      ...m,
      timesApplied: 0,
      timesIdentified: 0,
      lastSeen: null,
    })),
    settings: {
      subreddits: ["changemyview", "AskPhilosophy", "PoliticalDiscussion", "TrueAskReddit"],
      rssFeeds: [
        { name: "NYT Opinion", url: "https://rss.nytimes.com/services/xml/rss/nyt/Opinion.xml" },
        { name: "Aeon", url: "https://aeon.co/feed.rss" },
      ],
    },
  };
}

// Next.js can bundle each route handler as its own module instance, so a
// module-level cached db/promise would go stale across routes (writes in one
// route wouldn't be visible from another's in-memory copy). JSONFilePreset's
// db.read() always re-reads the file, so calling it fresh per request keeps
// every route reading the current on-disk state instead.
export function getDb() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  return JSONFilePreset<DbSchema>(DB_PATH, defaultData());
}
