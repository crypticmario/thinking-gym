import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(req: NextRequest) {
  const db = await getDb();
  const q = req.nextUrl.searchParams.get("q")?.toLowerCase();
  const discipline = req.nextUrl.searchParams.get("discipline");

  let models = [...db.data.models];
  if (discipline) models = models.filter((m) => m.discipline === discipline);
  if (q) {
    models = models.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.discipline.toLowerCase().includes(q)
    );
  }
  models.sort((a, b) => a.name.localeCompare(b.name));

  return NextResponse.json({ models });
}
