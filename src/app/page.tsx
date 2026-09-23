"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, type DashboardData, type FeedData } from "@/lib/api";
import { DRILL_INFO, PHASE_INFO } from "@/lib/curriculum";
import type { FeedItem } from "@/lib/types";
import { Card, Button } from "@/components/Card";

const SOURCE_LABELS: Record<string, string> = {
  reddit: "Reddit",
  rss: "RSS",
  hackernews: "Hacker News",
  manual: "Manual",
};

function storeFeedItem(item: FeedItem) {
  try {
    sessionStorage.setItem(
      "pendingSource",
      JSON.stringify({ sourceType: item.sourceType, source: item.source })
    );
  } catch {}
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [feed, setFeed] = useState<FeedData | null>(null);
  const [feedLoading, setFeedLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .dashboard()
      .then(setData)
      .catch((e) => setError(e.message));

    api
      .feed()
      .then(setFeed)
      .catch(() => {})
      .finally(() => setFeedLoading(false));
  }, []);

  if (error) return <p className="text-red-400">{error}</p>;
  if (!data) return <p className="text-neutral-400">Loading...</p>;

  const phaseInfo = PHASE_INFO[data.phase as keyof typeof PHASE_INFO];
  const maxCount = Math.max(1, ...data.threeInThree.map((d) => d.count));

  return (
    <div className="space-y-8">
      {/* Header row */}
      <div className="flex items-baseline justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Day {data.day}</h1>
          <p className="text-sm text-neutral-400 mt-0.5">
            {phaseInfo.name} &middot; {phaseInfo.goal}
          </p>
        </div>
        <span className="text-sm text-neutral-400 tabular-nums">
          {data.streak > 0 ? `${data.streak}-day streak` : "Start your streak"}
        </span>
      </div>

      {/* Today's Feed — the main section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Today&apos;s Feed</h2>
          <span className="text-xs text-neutral-500">
            Fresh examples to practice with
          </span>
        </div>

        {feedLoading ? (
          <Card>
            <div className="flex items-center gap-3 text-neutral-400">
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-neutral-600 border-t-emerald-500" />
              Fetching live examples...
            </div>
          </Card>
        ) : feed && feed.items.length > 0 ? (
          <div className="space-y-3">
            {feed.items.map((item) => (
              <Card key={item.id} className="group relative">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-emerald-500/80 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                        {SOURCE_LABELS[item.sourceType] || item.sourceType}
                      </span>
                      <span className="text-[10px] text-neutral-500">
                        {DRILL_INFO[item.suggestedDrill]?.label}
                      </span>
                    </div>
                    <h3 className="font-medium text-sm leading-snug">
                      {item.source.title}
                    </h3>
                    <p className="mt-1.5 text-xs text-neutral-400 line-clamp-3 leading-relaxed">
                      {item.source.excerpt}
                    </p>
                  </div>
                  <Link
                    href={`/drill/${item.suggestedDrill}`}
                    onClick={() => storeFeedItem(item)}
                    className="shrink-0"
                  >
                    <Button variant="secondary" className="text-xs whitespace-nowrap">
                      Practice
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <p className="text-sm text-neutral-500">
              Couldn&apos;t fetch live examples right now.{" "}
              {feed?.errors?.[0] && (
                <span className="text-neutral-600">({feed.errors[0]})</span>
              )}{" "}
              You can still start a drill below and paste your own content.
            </p>
          </Card>
        )}
      </section>

      {/* Quick drill access */}
      <section>
        <h3 className="mb-3 text-sm font-semibold text-neutral-300">
          Today&apos;s drills
        </h3>
        <div className="flex flex-wrap gap-2">
          {data.todaysDrills.map((drillType) => (
            <Link key={drillType} href={`/drill/${drillType}`}>
              <Button variant="ghost" className="text-xs border border-neutral-800">
                {DRILL_INFO[drillType].label}
              </Button>
            </Link>
          ))}
        </div>
      </section>

      {/* Stats — compact */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <h3 className="mb-3 text-sm font-semibold text-neutral-300">
            3-in-3 progress
          </h3>
          {data.threeInThree.length === 0 ? (
            <p className="text-xs text-neutral-500">
              No reps yet — this chart tracks your counter-argument counts.
            </p>
          ) : (
            <div className="flex items-end gap-1 h-20">
              {data.threeInThree.slice(-30).map((d, i) => (
                <div
                  key={i}
                  title={`${d.date}: ${d.count}`}
                  className="flex-1 rounded-t bg-emerald-600"
                  style={{
                    height: `${(d.count / maxCount) * 100}%`,
                    minHeight: 4,
                  }}
                />
              ))}
            </div>
          )}
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-neutral-300">
              Mental models
            </h3>
            <Link
              href="/models"
              className="text-xs text-emerald-500 hover:underline"
            >
              library
            </Link>
          </div>
          <p className="text-xs text-neutral-400">
            {data.modelStats.total - data.modelStats.untouched}/{" "}
            {data.modelStats.total} used &middot;{" "}
            {data.modelStats.totalExposure} reps
          </p>
          <div className="mt-2 flex flex-wrap gap-0.5">
            {data.models.map((m) => (
              <span
                key={m.id}
                title={`${m.name}: ${m.exposure} reps`}
                className={`h-2.5 w-2.5 rounded-sm ${
                  m.exposure === 0
                    ? "bg-neutral-800"
                    : m.exposure < 3
                    ? "bg-emerald-900"
                    : m.exposure < 6
                    ? "bg-emerald-700"
                    : "bg-emerald-500"
                }`}
              />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
