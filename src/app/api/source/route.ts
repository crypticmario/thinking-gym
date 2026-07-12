import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { fetchSubredditItems, pickRandom } from "@/lib/reddit";
import { fetchFeedItems } from "@/lib/rss";
import type { SourceType } from "@/lib/types";

export async function GET(req: NextRequest) {
  const db = await getDb();
  const kindParam = (req.nextUrl.searchParams.get("kind") || "any") as SourceType | "any";
  const { subreddits, rssFeeds } = db.data.settings;

  const kind: SourceType = kindParam === "any" ? (Math.random() < 0.5 ? "reddit" : "rss") : kindParam;

  try {
    if (kind === "reddit") {
      if (subreddits.length === 0) throw new Error("No subreddits configured");
      const sub = subreddits[Math.floor(Math.random() * subreddits.length)];
      const items = await fetchSubredditItems(sub);
      const item = pickRandom(items);
      if (!item) throw new Error(`No usable posts found in r/${sub} right now`);
      return NextResponse.json({ sourceType: "reddit", source: item });
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
