import type { DrillSource } from "./types";

const CACHE_TTL_MS = 3 * 60 * 1000;
const cache = new Map<string, { at: number; items: DrillSource[] }>();

interface RedditChild {
  data: {
    title: string;
    selftext: string;
    permalink: string;
    is_self: boolean;
    stickied: boolean;
  };
}

export async function fetchSubredditItems(subreddit: string): Promise<DrillSource[]> {
  const cached = cache.get(subreddit);
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) {
    return cached.items;
  }

  const res = await fetch(`https://www.reddit.com/r/${encodeURIComponent(subreddit)}/hot.json?limit=25`, {
    headers: {
      "User-Agent": "thinking-gym/0.1 (personal thinking-training app)",
    },
    // Reddit's endpoint isn't cacheable by Next's fetch layer in a useful way here.
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Reddit fetch failed for r/${subreddit}: ${res.status}`);
  }

  const json = (await res.json()) as { data: { children: RedditChild[] } };

  const items: DrillSource[] = json.data.children
    .map((c) => c.data)
    .filter((d) => d.is_self && !d.stickied && d.selftext && d.selftext.length > 200)
    .map((d) => ({
      title: d.title,
      url: `https://reddit.com${d.permalink}`,
      excerpt: d.selftext.slice(0, 1200),
    }));

  cache.set(subreddit, { at: Date.now(), items });
  return items;
}

export function pickRandom<T>(items: T[]): T | null {
  if (items.length === 0) return null;
  return items[Math.floor(Math.random() * items.length)];
}
