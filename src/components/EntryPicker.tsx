"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Entry } from "@/lib/types";

function summarize(entry: Entry): string {
  const firstValue = Object.values(entry.input)[0] || "";
  return firstValue.slice(0, 80) || entry.source?.title || entry.drillType;
}

export function EntryPicker({ onSelect }: { onSelect: (entry: Entry) => void }) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");

  useEffect(() => {
    api.entries().then(({ entries }) => setEntries(entries.slice(0, 25)));
  }, []);

  return (
    <select
      value={selectedId}
      onChange={(e) => {
        setSelectedId(e.target.value);
        const entry = entries.find((en) => en.id === e.target.value);
        if (entry) onSelect(entry);
      }}
      className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 focus:border-emerald-600 focus:outline-none"
    >
      <option value="">Pick an earlier entry from this week…</option>
      {entries.map((e) => (
        <option key={e.id} value={e.id}>
          {e.date} · {e.drillType} · {summarize(e)}
        </option>
      ))}
    </select>
  );
}
