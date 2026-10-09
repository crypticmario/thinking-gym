import { NextRequest, NextResponse } from "next/server";
import { critiqueDrill, isAIConfigured } from "@/lib/ai";
import type { DrillSource, DrillType } from "@/lib/types";
import { DRILL_INFO } from "@/lib/curriculum";

export async function POST(req: NextRequest) {
  if (!isAIConfigured()) {
    return NextResponse.json(
      { error: "AI not configured. Set ANTHROPIC_API_KEY in your environment." },
      { status: 503 },
    );
  }

  const body = await req.json();
  const { drillType, input, source, modelName } = body as {
    drillType: DrillType;
    input: Record<string, string>;
    source?: DrillSource;
    modelName?: string;
  };

  if (!drillType || !DRILL_INFO[drillType]) {
    return NextResponse.json({ error: "Invalid drillType" }, { status: 400 });
  }

  try {
    const critique = await critiqueDrill(drillType, input, source, modelName);
    return NextResponse.json({ critique });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Critique failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
