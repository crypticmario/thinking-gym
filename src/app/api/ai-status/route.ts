import { NextResponse } from "next/server";
import { isAIConfigured } from "@/lib/ai";

export async function GET() {
  return NextResponse.json({ configured: isAIConfigured() });
}
