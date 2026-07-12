import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import type { Settings } from "@/lib/types";

export async function GET() {
  const db = await getDb();
  return NextResponse.json({ settings: db.data.settings });
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as Partial<Settings>;
  const db = await getDb();

  if (body.subreddits) db.data.settings.subreddits = body.subreddits;
  if (body.rssFeeds) db.data.settings.rssFeeds = body.rssFeeds;

  await db.write();
  return NextResponse.json({ settings: db.data.settings });
}
