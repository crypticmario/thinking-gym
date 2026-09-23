export type Phase = 1 | 2 | 3 | 4 | 5;

export type DrillType =
  | "argument-anatomy"
  | "model-apply"
  | "model-identify"
  | "3-in-3"
  | "steelman"
  | "devils-advocate"
  | "unusual-connection"
  | "so-what"
  | "post-draft";

export type SourceType = "reddit" | "rss" | "hackernews" | "manual";

export interface DrillSource {
  title: string;
  url?: string;
  excerpt: string;
}

export interface Entry {
  id: string;
  date: string; // ISO date, YYYY-MM-DD
  createdAt: string; // full ISO timestamp
  phase: Phase;
  drillType: DrillType;
  sourceType: SourceType;
  source?: DrillSource;
  modelIds?: string[];
  input: Record<string, string>;
  durationSeconds?: number;
  counterArgumentCount?: number;
}

export interface MentalModel {
  id: string;
  name: string;
  discipline: string;
  description: string;
  exampleUse: string;
  timesApplied: number;
  timesIdentified: number;
  lastSeen: string | null;
}

export interface Settings {
  subreddits: string[];
  rssFeeds: { name: string; url: string }[];
}

export interface FeedItem {
  id: string;
  sourceType: SourceType;
  source: DrillSource;
  suggestedDrill: DrillType;
}

export interface DbSchema {
  startedAt: string | null;
  entries: Entry[];
  models: MentalModel[];
  settings: Settings;
}
