import type { DrillSource } from "./types";

const CACHE_TTL_MS = 5 * 60 * 1000;
let cache: { at: number; items: DrillSource[] } | null = null;

interface HNItem {
  id: number;
  title?: string;
  text?: string;
  url?: string;
  type?: string;
  dead?: boolean;
  deleted?: boolean;
}

export async function fetchHNItems(): Promise<DrillSource[]> {
  if (cache && Date.now() - cache.at < CACHE_TTL_MS) {
    return cache.items;
  }

  const res = await fetch(
    "https://hacker-news.firebaseio.com/v0/askstories.json",
    { cache: "no-store" }
  );
  if (!res.ok) throw new Error(`HN fetch failed: ${res.status}`);

  const ids = (await res.json()) as number[];
  const top = ids.slice(0, 20);

  const stories = await Promise.all(
    top.map(async (id): Promise<HNItem | null> => {
      try {
        const r = await fetch(
          `https://hacker-news.firebaseio.com/v0/item/${id}.json`,
          { cache: "no-store" }
        );
        return r.ok ? ((await r.json()) as HNItem) : null;
      } catch {
        return null;
      }
    })
  );

  const items: DrillSource[] = stories
    .filter(
      (s): s is HNItem =>
        s !== null &&
        !s.dead &&
        !s.deleted &&
        !!s.title &&
        !!s.text &&
        s.text.length > 100
    )
    .map((s) => ({
      title: s.title!,
      url: `https://news.ycombinator.com/item?id=${s.id}`,
      excerpt: stripHtml(s.text!).slice(0, 1200),
    }));

  cache = { at: Date.now(), items };
  return items;
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}
