import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getDb } from "@/lib/db";
import { dateKey } from "@/lib/curriculum";
import type { DrillType, Entry, Phase, SourceType } from "@/lib/types";
import { DRILL_INFO } from "@/lib/curriculum";

export async function GET(req: NextRequest) {
  const db = await getDb();
  const phase = req.nextUrl.searchParams.get("phase");
  const drillType = req.nextUrl.searchParams.get("drillType");

  let entries = [...db.data.entries].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  if (phase) entries = entries.filter((e) => String(e.phase) === phase);
  if (drillType) entries = entries.filter((e) => e.drillType === drillType);

  return NextResponse.json({ entries });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { drillType, sourceType, source, input, durationSeconds, modelIds, counterArgumentCount } = body as {
    drillType: DrillType;
    sourceType: SourceType;
    source?: Entry["source"];
    input: Record<string, string>;
    durationSeconds?: number;
    modelIds?: string[];
    counterArgumentCount?: number;
  };

  if (!drillType || !DRILL_INFO[drillType]) {
    return NextResponse.json({ error: "Invalid drillType" }, { status: 400 });
  }

  const db = await getDb();
  const now = new Date();

  if (!db.data.startedAt) {
    db.data.startedAt = dateKey(now);
  }

  const phase = DRILL_INFO[drillType].phase === 0 ? (1 as Phase) : (DRILL_INFO[drillType].phase as Phase);

  const entry: Entry = {
    id: randomUUID(),
    date: dateKey(now),
    createdAt: now.toISOString(),
    phase,
    drillType,
    sourceType: sourceType ?? "manual",
    source,
    modelIds,
    input: input ?? {},
    durationSeconds,
    counterArgumentCount,
  };

  db.data.entries.push(entry);

  if (modelIds && modelIds.length > 0) {
    const isIdentify = drillType === "model-identify";
    for (const id of modelIds) {
      const model = db.data.models.find((m) => m.id === id);
      if (model) {
        if (isIdentify) model.timesIdentified += 1;
        else model.timesApplied += 1;
        model.lastSeen = entry.date;
      }
    }
  }

  await db.write();

  return NextResponse.json({ entry }, { status: 201 });
}
