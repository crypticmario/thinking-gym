import type { DbSchema } from "./types";
import { MODEL_SEED } from "./modelSeed";

export function defaultData(): DbSchema {
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
      subreddits: [
        "changemyview",
        "AskPhilosophy",
        "PoliticalDiscussion",
        "TrueAskReddit",
        "NeutralPolitics",
        "ExplainBothSides",
      ],
      rssFeeds: [
        { name: "NYT Opinion", url: "https://rss.nytimes.com/services/xml/rss/nyt/Opinion.xml" },
        { name: "Aeon", url: "https://aeon.co/feed.rss" },
        { name: "The Guardian Opinion", url: "https://www.theguardian.com/commentisfree/rss" },
        { name: "Vox", url: "https://www.vox.com/rss/index.xml" },
        { name: "Reason", url: "https://reason.com/feed/" },
      ],
    },
  };
}

const USE_PG = !!(process.env.DATABASE_URL || process.env.POSTGRES_URL);

export async function getDb() {
  if (USE_PG) {
    const { getPgDb } = await import("./db-pg");
    return getPgDb();
  }
  const { getLocalDb } = await import("./db-local");
  return getLocalDb();
}
