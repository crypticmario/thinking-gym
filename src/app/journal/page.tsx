"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { DRILL_INFO } from "@/lib/curriculum";
import type { DrillType, Entry } from "@/lib/types";
import { Card } from "@/components/Card";

export default function JournalPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [filter, setFilter] = useState<DrillType | "">("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .entries(filter ? { drillType: filter } : undefined)
      .then(({ entries }) => setEntries(entries))
      .finally(() => setLoading(false));
  }, [filter]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Journal</h1>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as DrillType | "")}
          className="rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-1.5 text-sm text-neutral-100"
        >
          <option value="">All drill types</option>
          {Object.entries(DRILL_INFO).map(([key, info]) => (
            <option key={key} value={key}>
              {info.label}
            </option>
          ))}
        </select>
      </div>

      {loading && <p className="text-neutral-400">Loading…</p>}
      {!loading && entries.length === 0 && (
        <p className="text-neutral-500">No entries yet. Go do a drill from the dashboard.</p>
      )}

      <div className="space-y-3">
        {entries.map((entry) => (
          <Card key={entry.id}>
            <div className="flex items-baseline justify-between">
              <p className="font-medium">{DRILL_INFO[entry.drillType].label}</p>
              <span className="text-xs text-neutral-500">{entry.date}</span>
            </div>
            {entry.source?.title && (
              <p className="mt-1 text-xs text-neutral-500">
                Source: {entry.source.title} ({entry.sourceType})
              </p>
            )}
            <div className="mt-2 space-y-1">
              {Object.entries(entry.input).map(([key, value]) => (
                <p key={key} className="text-sm text-neutral-300">
                  <span className="text-neutral-500">{key}: </span>
                  {value}
                </p>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
