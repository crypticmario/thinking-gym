import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { fetchSubredditItems, pickRandom } from "@/lib/reddit";
import { fetchFeedItems } from "@/lib/rss";
import { fetchHNItems } from "@/lib/hackernews";
import type { SourceType } from "@/lib/types";

export async function GET(req: NextRequest) {
  const db = await getDb();
  const kindParam = (req.nextUrl.searchParams.get("kind") || "any") as SourceType | "any";
  const { subreddits, rssFeeds } = db.data.settings;

  let kind: SourceType;
  if (kindParam === "any") {
    const roll = Math.random();
    kind = roll < 0.4 ? "rss" : roll < 0.7 ? "reddit" : "hackernews";
  } else {
    kind = kindParam;
  }

  try {
    if (kind === "reddit") {
      if (subreddits.length === 0) throw new Error("No subreddits configured");
      const sub = subreddits[Math.floor(Math.random() * subreddits.length)];
      const items = await fetchSubredditItems(sub);
      const item = pickRandom(items);
      if (!item) throw new Error(`No usable posts found in r/${sub} right now`);
      return NextResponse.json({ sourceType: "reddit", source: item });
    } else if (kind === "hackernews") {
      const items = await fetchHNItems();
      const item = pickRandom(items);
      if (!item) throw new Error("No usable Ask HN posts right now");
      return NextResponse.json({ sourceType: "hackernews", source: item });
    } else {
      if (rssFeeds.length === 0) throw new Error("No RSS feeds configured");
      const feed = rssFeeds[Math.floor(Math.random() * rssFeeds.length)];
      const items = await fetchFeedItems(feed.url);
      const item = pickRandom(items);
      if (!item) throw new Error(`No items found in feed "${feed.name}" right now`);
      return NextResponse.json({ sourceType: "rss", source: item });
    }
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fetch a live source" },
      { status: 502 }
    );
  }
}
