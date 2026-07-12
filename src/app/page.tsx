"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, type DashboardData } from "@/lib/api";
import { DRILL_INFO, PHASE_INFO } from "@/lib/curriculum";
import { Card } from "@/components/Card";

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .dashboard()
      .then(setData)
      .catch((e) => setError(e.message));
  }, []);

  if (error) return <p className="text-red-400">{error}</p>;
  if (!data) return <p className="text-neutral-400">Loading...</p>;

  const phaseInfo = PHASE_INFO[data.phase as keyof typeof PHASE_INFO];
  const maxCount = Math.max(1, ...data.threeInThree.map((d) => d.count));

  return (
    <div className="space-y-6">
      <div className="flex items-baseline justify-between">
        <h1 className="text-2xl font-semibold">Day {data.day}</h1>
        <span className="text-sm text-neutral-400">🔥 {data.streak}-day streak</span>
      </div>

      <Card>
        <p className="text-xs uppercase tracking-wide text-emerald-500">{phaseInfo.range}</p>
        <h2 className="text-lg font-semibold">{phaseInfo.name}</h2>
        <p className="mt-1 text-sm text-neutral-400">{phaseInfo.goal}</p>
      </Card>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-neutral-300">Today&apos;s drills</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {data.todaysDrills.map((drillType) => (
            <Link key={drillType} href={`/drill/${drillType}`}>
              <Card className="h-full transition-colors hover:border-emerald-700">
                <p className="font-medium">{DRILL_INFO[drillType].label}</p>
                <p className="mt-1 text-xs text-neutral-400 line-clamp-2">
                  {DRILL_INFO[drillType].instructions}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <Card>
        <h3 className="mb-3 text-sm font-semibold text-neutral-300">
          3-in-3: counter-arguments per rep
        </h3>
        {data.threeInThree.length === 0 ? (
          <p className="text-sm text-neutral-500">
            No 3-in-3 reps yet — this is the curriculum&apos;s core success metric, watch it climb.
          </p>
        ) : (
          <div className="flex items-end gap-1 h-24">
            {data.threeInThree.slice(-30).map((d, i) => (
              <div
                key={i}
                title={`${d.date}: ${d.count}`}
                className="flex-1 rounded-t bg-emerald-600"
                style={{ height: `${(d.count / maxCount) * 100}%`, minHeight: 4 }}
              />
            ))}
          </div>
        )}
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-neutral-300">Mental models mastery</h3>
          <Link href="/models" className="text-xs text-emerald-500 hover:underline">
            browse library →
          </Link>
        </div>
        <p className="text-sm text-neutral-400">
          {data.modelStats.total - data.modelStats.untouched} / {data.modelStats.total} models used at least
          once · {data.modelStats.totalExposure} total reps
        </p>
        <div className="mt-3 flex flex-wrap gap-1">
          {data.models.map((m) => (
            <span
              key={m.id}
              title={`${m.name}: ${m.exposure} reps`}
              className={`h-3 w-3 rounded-sm ${
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
  );
}
