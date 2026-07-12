"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { MentalModel } from "@/lib/types";
import { Card } from "@/components/Card";

export default function ModelsPage() {
  const [models, setModels] = useState<MentalModel[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const handle = setTimeout(() => {
      api
        .models(query || undefined)
        .then(({ models }) => setModels(models))
        .finally(() => setLoading(false));
    }, 200);
    return () => clearTimeout(handle);
  }, [query]);

  const byDiscipline = models.reduce<Record<string, MentalModel[]>>((acc, m) => {
    (acc[m.discipline] ??= []).push(m);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Mental Models Library</h1>
        <p className="mt-1 text-sm text-neutral-400">
          Meant to be opened mid-argument in real life, not just inside a drill.
        </p>
      </div>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search models…"
        className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus:border-emerald-600 focus:outline-none"
      />

      {loading && <p className="text-neutral-400">Loading…</p>}

      {Object.entries(byDiscipline).map(([discipline, list]) => (
        <div key={discipline}>
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-emerald-500">{discipline}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {list.map((m) => (
              <Card key={m.id}>
                <div className="flex items-baseline justify-between">
                  <p className="font-medium">{m.name}</p>
                  <span className="text-xs text-neutral-500">{m.timesApplied + m.timesIdentified} reps</span>
                </div>
                <p className="mt-1 text-sm text-neutral-400">{m.description}</p>
                <p className="mt-2 text-xs text-neutral-500">e.g. {m.exampleUse}</p>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
