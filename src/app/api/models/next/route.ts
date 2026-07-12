import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { pickModel } from "@/lib/modelPicker";

export async function GET(req: NextRequest) {
  const db = await getDb();
  const excludeId = req.nextUrl.searchParams.get("excludeId");

  const pool = excludeId ? db.data.models.filter((m) => m.id !== excludeId) : db.data.models;
  const model = pickModel(pool.length > 0 ? pool : db.data.models);

  return NextResponse.json({ model });
}
