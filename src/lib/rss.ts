import Parser from "rss-parser";
import type { DrillSource } from "./types";

const CACHE_TTL_MS = 10 * 60 * 1000;
const cache = new Map<string, { at: number; items: DrillSource[] }>();
const parser = new Parser();

export async function fetchFeedItems(feedUrl: string): Promise<DrillSource[]> {
  const cached = cache.get(feedUrl);
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) {
    return cached.items;
  }

  const feed = await parser.parseURL(feedUrl);

  const items: DrillSource[] = (feed.items || [])
    .filter((i) => i.title)
    .map((i) => ({
      title: i.title as string,
      url: i.link,
      excerpt: (i.contentSnippet || i.content || i.summary || "").slice(0, 1200),
    }));

  cache.set(feedUrl, { at: Date.now(), items });
  return items;
}
