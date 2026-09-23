import type { DrillSource, DrillType, Entry, FeedItem, MentalModel, SourceType, Settings } from "./types";

async function jsonFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  const body = await res.json();
  if (!res.ok) throw new Error(body.error || `Request failed: ${url}`);
  return body as T;
}

export interface DashboardData {
  day: number;
  phase: number;
  streak: number;
  todaysDrills: DrillType[];
  totalEntries: number;
  threeInThree: { date: string; count: number }[];
  models: { id: string; name: string; discipline: string; exposure: number }[];
  modelStats: { total: number; untouched: number; totalExposure: number };
}

export interface FeedData {
  items: FeedItem[];
  drills: DrillType[];
  errors?: string[];
}

export const api = {
  dashboard: () => jsonFetch<DashboardData>("/api/dashboard"),

  feed: () => jsonFetch<FeedData>("/api/feed"),

  source: (kind: SourceType | "any" = "any") =>
    jsonFetch<{ sourceType: SourceType; source: DrillSource }>(`/api/source?kind=${kind}`),

  nextModel: (excludeId?: string) =>
    jsonFetch<{ model: MentalModel }>(`/api/models/next${excludeId ? `?excludeId=${excludeId}` : ""}`),

  models: (q?: string) => jsonFetch<{ models: MentalModel[] }>(`/api/models${q ? `?q=${encodeURIComponent(q)}` : ""}`),

  entries: (params?: { phase?: number; drillType?: DrillType }) => {
    const qs = new URLSearchParams();
    if (params?.phase) qs.set("phase", String(params.phase));
    if (params?.drillType) qs.set("drillType", params.drillType);
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    return jsonFetch<{ entries: Entry[] }>(`/api/entries${suffix}`);
  },

  createEntry: (payload: {
    drillType: DrillType;
    sourceType: SourceType;
    source?: DrillSource;
    input: Record<string, string>;
    durationSeconds?: number;
    modelIds?: string[];
    counterArgumentCount?: number;
  }) =>
    jsonFetch<{ entry: Entry }>("/api/entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),

  settings: () => jsonFetch<{ settings: Settings }>("/api/settings"),

  updateSettings: (payload: Partial<Settings>) =>
    jsonFetch<{ settings: Settings }>("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
};
