import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { fetchSubredditItems } from "@/lib/reddit";
import { fetchFeedItems } from "@/lib/rss";
import { fetchHNItems } from "@/lib/hackernews";
import { curateFeedItems, isAIConfigured } from "@/lib/ai";
import { currentDayNumber, todaysDrills } from "@/lib/curriculum";
import type { DrillSource, FeedItem, SourceType } from "@/lib/types";

const TARGET_ITEMS = 5;

function makeId(): string {
  return Math.random().toString(36).slice(2, 10);
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickN<T>(items: T[], n: number): T[] {
  return shuffle(items).slice(0, n);
}

export async function GET() {
  const db = await getDb();
  const { subreddits, rssFeeds } = db.data.settings;
  const day = currentDayNumber(db.data.entries);
  const drills = todaysDrills(day);
  const sourceNeededDrills = drills.filter((d) =>
    ["argument-anatomy", "model-apply", "model-identify", "3-in-3", "steelman"].includes(d)
  );

  const pool: { type: SourceType; item: DrillSource }[] = [];
  const errors: string[] = [];

  const fetchers: Array<() => Promise<{ type: SourceType; items: DrillSource[] }>> = [];

  if (rssFeeds.length > 0) {
    const picked = shuffle(rssFeeds).slice(0, 3);
    for (const feed of picked) {
      fetchers.push(async () => ({
        type: "rss" as SourceType,
        items: await fetchFeedItems(feed.url),
      }));
    }
  }

  if (subreddits.length > 0) {
    const picked = shuffle(subreddits).slice(0, 2);
    for (const sub of picked) {
      fetchers.push(async () => ({
        type: "reddit" as SourceType,
        items: await fetchSubredditItems(sub),
      }));
    }
  }

  fetchers.push(async () => ({
    type: "hackernews" as SourceType,
    items: await fetchHNItems(),
  }));

  const results = await Promise.allSettled(fetchers.map((f) => f()));

  for (const result of results) {
    if (result.status === "fulfilled") {
      const { type, items: sourceItems } = result.value;
      const picked = pickN(sourceItems, 3);
      for (const item of picked) {
        pool.push({ type, item });
      }
    } else {
      errors.push(
        result.reason instanceof Error ? result.reason.message : "Source fetch failed"
      );
    }
  }

  const candidates = shuffle(pool).slice(0, TARGET_ITEMS * 2);
  let rawItems: FeedItem[] = candidates.map((s, i) => ({
    id: makeId(),
    sourceType: s.type,
    source: s.item,
    suggestedDrill:
      sourceNeededDrills[i % sourceNeededDrills.length] ||
      sourceNeededDrills[0] ||
      "argument-anatomy",
  }));

  let aiCurated = false;
  if (isAIConfigured() && rawItems.length > TARGET_ITEMS) {
    try {
      rawItems = await curateFeedItems(rawItems);
      aiCurated = true;
    } catch {
      errors.push("AI curation failed, showing unfiltered feed");
    }
  }

  const items = rawItems.slice(0, TARGET_ITEMS);

  return NextResponse.json({
    items,
    drills,
    aiCurated,
    errors: errors.length > 0 ? errors : undefined,
  });
}
