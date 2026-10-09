import Anthropic from "@anthropic-ai/sdk";
import type { DrillType, DrillSource, FeedItem } from "./types";
import { DRILL_CONFIG } from "./drillConfig";
import { DRILL_INFO } from "./curriculum";

const MODEL = "claude-haiku-4-5";

function getClient(): Anthropic | null {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return null;
  return new Anthropic({ apiKey: key });
}

export function isAIConfigured(): boolean {
  return !!process.env.ANTHROPIC_API_KEY;
}

const DRILL_CRITIQUE_PROMPTS: Record<DrillType, string> = {
  "argument-anatomy": `The user practiced breaking down an argument into four parts: Claim, Main Reason, Evidence, and Hidden Assumption.

Evaluate their analysis:
- Is the claim correctly identified as the core assertion?
- Is the reason actually the main supporting reason, not a secondary one?
- Is the evidence genuinely evidence (data, examples, citations) or just another opinion/reason?
- Is the hidden assumption truly hidden (not explicitly stated) and load-bearing (if false, the argument falls apart)?
- Are there other hidden assumptions they missed?

Be specific. Quote their words when pointing out issues.`,

  "model-apply": `The user applied a specific mental model to a piece of content.

Evaluate their application:
- Did they correctly understand the mental model?
- Does their application genuinely reveal something non-obvious, or is it surface-level?
- Did they identify the most interesting angle, or is there a stronger application they missed?
- Is their reasoning sound?

Push them to go deeper if their application is too shallow.`,

  "model-identify": `The user tried to identify which mental model(s) explain a piece of content before being shown the answer.

Evaluate:
- Was their guess reasonable given the content?
- Did their reflection show genuine learning from the gap between guess and answer?
- Are there models they didn't consider that also apply?`,

  "3-in-3": `The user generated counter-arguments against a claim under time pressure (3 minutes).

Evaluate their counter-arguments:
- Are they genuinely distinct from each other, or variations of the same objection?
- Are they strong (attacking the core reasoning) or weak (nitpicking, tangential)?
- Do any commit logical fallacies (straw man, ad hominem, false dichotomy)?
- What's the strongest counter-argument they missed?

Rate each counter-argument as Strong, Medium, or Weak.`,

  steelman: `The user steelmanned a position (articulated the strongest version of it) and then responded.

Evaluate:
- Is their steelman genuinely the strongest version, or did they soften it?
- Did they add reasoning or evidence the original didn't include?
- Does their response actually engage with the steelman, or does it attack a weaker version?
- Did the exercise visibly shift their thinking?`,

  "devils-advocate": `The user argued against something they actually believe (devil's advocate).

Evaluate:
- Is the argument genuinely trying to win, or pulling punches?
- Does it use real evidence and reasoning, not just "some people say"?
- Would someone who holds this opposing view find the argument compelling?
- Does it avoid straw-manning the opposing side?`,

  "unusual-connection": `The user found a structural connection between two seemingly unrelated things.

Evaluate:
- Is the connection genuinely structural (shared pattern, mechanism, or dynamic), or just surface similarity?
- Is it non-obvious? Would most people see this connection?
- Could the connection generate a useful insight or prediction?`,

  "so-what": `The user took a previous drill entry and extracted the "so what" — the practical implication.

Evaluate:
- Does it identify a genuine, actionable implication?
- Is the implication specific enough to change behavior, or too vague ("think more carefully")?
- Does it follow logically from the original insight?`,

  "post-draft": `The user wrote a short post following the 5-part structure: Hook, Tension, Insight, Evidence, So What.

Evaluate each part:
- Hook: Is it a specific, concrete claim that makes someone want to read more?
- Tension: Does it genuinely show why the obvious take is wrong or incomplete?
- Insight: Is it one clear sentence? Is it actually insightful?
- Evidence: Is the evidence concrete and relevant?
- So What: Does it land — would someone actually think or act differently?

Also evaluate the whole: Does it flow? Is the voice confident? Would you share this?`,
};

export interface CritiqueResult {
  feedback: string;
  score: number;
  strengths: string[];
  improvements: string[];
  followUp: string;
}

export async function critiqueDrill(
  drillType: DrillType,
  input: Record<string, string>,
  source?: DrillSource,
  modelName?: string,
): Promise<CritiqueResult> {
  const client = getClient();
  if (!client) throw new Error("AI not configured");

  const config = DRILL_CONFIG[drillType];
  const info = DRILL_INFO[drillType];

  let userContent = `Drill: ${info.label}\n\n`;

  if (source) {
    userContent += `Source material:\nTitle: ${source.title}\n`;
    if (source.excerpt) userContent += `Excerpt: ${source.excerpt.slice(0, 1000)}\n`;
    userContent += "\n";
  }

  if (modelName) {
    userContent += `Mental model being used: ${modelName}\n\n`;
  }

  userContent += "User's responses:\n";
  for (const field of config.fields) {
    userContent += `${field.label}: ${input[field.key] || "(empty)"}\n\n`;
  }

  const systemPrompt = `You are a critical thinking coach. You give honest, specific, constructive feedback on thinking exercises. You're encouraging but never flattering — you point out genuine strengths AND genuine weaknesses.

${DRILL_CRITIQUE_PROMPTS[drillType]}

Respond in this exact JSON format:
{
  "score": <1-10 integer>,
  "feedback": "<2-3 sentences of overall assessment>",
  "strengths": ["<specific strength 1>", "<specific strength 2>"],
  "improvements": ["<specific improvement 1>", "<specific improvement 2>"],
  "followUp": "<one thought-provoking question to push their thinking further>"
}

Score guide: 1-3 = needs fundamental rethinking, 4-5 = decent attempt with clear gaps, 6-7 = good work with room to sharpen, 8-9 = strong analysis, 10 = exceptional insight.`;

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 1024,
    system: systemPrompt,
    messages: [{ role: "user", content: userContent }],
  });

  let text = "";
  for (const block of response.content) {
    if (block.type === "text") text = block.text;
  }

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON in response");
    const parsed = JSON.parse(jsonMatch[0]) as CritiqueResult;
    return {
      score: Math.max(1, Math.min(10, parsed.score)),
      feedback: parsed.feedback || "No feedback generated.",
      strengths: parsed.strengths || [],
      improvements: parsed.improvements || [],
      followUp: parsed.followUp || "",
    };
  } catch {
    return {
      score: 0,
      feedback: text,
      strengths: [],
      improvements: [],
      followUp: "",
    };
  }
}

export interface CurationScore {
  id: string;
  score: number;
  reason: string;
}

export async function curateFeedItems(
  items: FeedItem[],
): Promise<FeedItem[]> {
  const client = getClient();
  if (!client || items.length === 0) return items;

  const itemDescriptions = items.map((item, i) => (
    `[${i}] "${item.source.title}" — ${item.source.excerpt.slice(0, 200)}`
  )).join("\n");

  const systemPrompt = `You filter content for a critical thinking practice app. Score each item 1-10 for how good it is for practicing argument analysis, counter-arguments, and steelmanning.

High scores (7-10): Has a clear arguable claim or position. Takes a side. Contains reasoning that can be analyzed. Has genuine tension or a non-obvious angle.
Medium scores (4-6): Has some opinion or analysis but is vague, or the claim is too obvious/uncontroversial to practice with.
Low scores (1-3): Pure news reporting with no argument. Listicles. How-to guides. Too short or vague to engage with. Celebrity gossip. Weather/sports scores.

Respond with a JSON array of objects, one per item, in the same order:
[{"index": 0, "score": 8, "reason": "clear claim about X with supporting reasoning"}]

Be strict. Most news items should score 3-5. Only items with genuine, arguable positions deserve 7+.`;

  try {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: "user", content: `Score these items:\n${itemDescriptions}` }],
    });

    let text = "";
    for (const block of response.content) {
      if (block.type === "text") text = block.text;
    }

    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return items;

    const scores = JSON.parse(jsonMatch[0]) as { index: number; score: number }[];
    const goodIndices = new Set(
      scores.filter((s) => s.score >= 5).map((s) => s.index),
    );

    const filtered = items.filter((_, i) => goodIndices.has(i));
    return filtered.length > 0 ? filtered : items.slice(0, 3);
  } catch {
    return items;
  }
}
