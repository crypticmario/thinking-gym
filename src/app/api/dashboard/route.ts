import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { currentDayNumber, currentStreak, phaseForDay, todaysDrills } from "@/lib/curriculum";

export async function GET() {
  const db = await getDb();
  const entries = db.data.entries;

  const day = currentDayNumber(entries);
  const phase = phaseForDay(day);
  const streak = currentStreak(entries);
  const drills = todaysDrills(day);

  const threeInThree = entries
    .filter((e) => e.drillType === "3-in-3")
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((e) => ({ date: e.date, count: e.counterArgumentCount ?? 0 }));

  const models = db.data.models;
  const totalExposure = models.reduce((s, m) => s + m.timesApplied + m.timesIdentified, 0);
  const untouched = models.filter((m) => m.timesApplied + m.timesIdentified === 0).length;

  return NextResponse.json({
    day,
    phase,
    streak,
    todaysDrills: drills,
    totalEntries: entries.length,
    threeInThree,
    models: models.map((m) => ({
      id: m.id,
      name: m.name,
      discipline: m.discipline,
      exposure: m.timesApplied + m.timesIdentified,
    })),
    modelStats: { total: models.length, untouched, totalExposure },
  });
}
