import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { isAIConfigured } from "@/lib/ai";
import { TUTORIALS } from "@/lib/tutorials";
import { DRILL_CONFIG } from "@/lib/drillConfig";

export async function POST(req: NextRequest) {
  if (!isAIConfigured()) {
    return NextResponse.json(
      { error: "AI not configured. Set ANTHROPIC_API_KEY in your environment." },
      { status: 503 },
    );
  }

  const { drillType } = (await req.json()) as { drillType: string };

  const tutorial = TUTORIALS.find((t) => t.drillType === drillType);
  if (!tutorial) {
    return NextResponse.json({ error: "Unknown drill type" }, { status: 400 });
  }

  const config = DRILL_CONFIG[tutorial.drillType];
  const fieldLabels = config.fields.map((f) => f.label);

  const systemPrompt = `You generate worked examples for a critical thinking training app. Create a realistic, high-quality example for the "${tutorial.title}" drill.

The drill is: ${tutorial.what}

The user needs to fill in these fields: ${fieldLabels.join(", ")}

Generate a complete worked example with:
1. A source (a realistic but made-up article/post title and a 2-3 sentence excerpt that would actually appear in the wild)
2. Filled-in responses for each field that demonstrate excellent execution of this drill

The example should be on a different topic than common textbook examples. Use current, real-world-feeling topics. The responses should be genuinely good — the kind a skilled practitioner would write.

Respond in this exact JSON format:
{
  "source": {
    "title": "the article or post title",
    "excerpt": "2-3 sentence excerpt from the source"
  },
  "responses": [
    {"label": "field label", "value": "the example response"}
  ]
}`;

  try {
    const client = new Anthropic();
    const response = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 1500,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: `Generate a fresh worked example for the "${tutorial.title}" drill. Pick an interesting, current topic.`,
        },
      ],
    });

    let text = "";
    for (const block of response.content) {
      if (block.type === "text") text = block.text;
    }

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "Failed to generate example" }, { status: 500 });
    }

    const example = JSON.parse(jsonMatch[0]);
    return NextResponse.json({ example });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
