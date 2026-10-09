"use client";

import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import type { CritiqueResult } from "@/lib/ai";
import { DRILL_INFO } from "@/lib/curriculum";
import { DRILL_CONFIG } from "@/lib/drillConfig";
import type { DrillSource, DrillType, Entry, MentalModel, SourceType } from "@/lib/types";
import { wordCount } from "@/lib/util";
import { Button, Card, TextArea } from "@/components/Card";
import { SourcePicker } from "@/components/SourcePicker";
import { ModelPanel } from "@/components/ModelPanel";
import { Timer } from "@/components/Timer";
import { EntryPicker } from "@/components/EntryPicker";

function isDrillType(value: string): value is DrillType {
  return value in DRILL_INFO;
}

function buildCritiqueMarkdown(drillType: DrillType, input: Record<string, string>): string {
  const config = DRILL_CONFIG[drillType];
  const lines = [`**${DRILL_INFO[drillType].label}**`, ""];
  for (const field of config.fields) {
    lines.push(`**${field.label}**`, input[field.key] || "", "");
  }
  return lines.join("\n");
}

export default function DrillPage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = use(params);

  if (!isDrillType(type)) {
    return (
      <div>
        <p className="text-red-400">Unknown drill type &quot;{type}&quot;.</p>
        <Link href="/" className="text-emerald-500 hover:underline">
          Back to dashboard
        </Link>
      </div>
    );
  }

  return <DrillForm drillType={type} />;
}

function DrillForm({ drillType }: { drillType: DrillType }) {
  const config = DRILL_CONFIG[drillType];
  const info = DRILL_INFO[drillType];

  const initialInput = useMemo(
    () => Object.fromEntries(config.fields.map((f) => [f.key, ""])),
    [config.fields]
  );

  const [input, setInput] = useState<Record<string, string>>(initialInput);
  const [sourceType, setSourceType] = useState<SourceType>("manual");
  const [source, setSource] = useState<DrillSource | undefined>(undefined);
  const [model, setModel] = useState<MentalModel | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [critique, setCritique] = useState<CritiqueResult | null>(null);
  const [critiqueLoading, setCritiqueLoading] = useState(false);
  const [critiqueError, setCritiqueError] = useState<string | null>(null);
  const [aiAvailable, setAiAvailable] = useState(false);

  useEffect(() => {
    api.aiStatus().then(({ configured }) => setAiAvailable(configured)).catch(() => {});
  }, []);

  const allFilled = config.fields.every((f) => input[f.key]?.trim());

  const wordTotal = config.wordTarget
    ? config.fields.reduce((sum, f) => sum + wordCount(input[f.key] || ""), 0)
    : 0;

  function setField(key: string, value: string) {
    setInput((prev) => ({ ...prev, [key]: value }));
  }

  function handleEntryPicked(entry: Entry) {
    setSource({ title: `${entry.drillType} (${entry.date})`, excerpt: Object.values(entry.input).join(" / ") });
    setSourceType("manual");
  }

  async function save() {
    setSaving(true);
    try {
      const counterArgumentCount =
        drillType === "3-in-3"
          ? ["counter1", "counter2", "counter3"].filter((k) => input[k]?.trim()).length
          : undefined;

      await api.createEntry({
        drillType,
        sourceType,
        source,
        input,
        modelIds: model ? [model.id] : undefined,
        counterArgumentCount,
      });
      setSaved(true);

      if (aiAvailable) {
        setCritiqueLoading(true);
        setCritiqueError(null);
        api
          .critique({ drillType, input, source, modelName: model?.name })
          .then(({ critique }) => setCritique(critique))
          .catch((err) => setCritiqueError(err instanceof Error ? err.message : "Critique failed"))
          .finally(() => setCritiqueLoading(false));
      }
    } finally {
      setSaving(false);
    }
  }

  async function copyForCritique() {
    const markdown = buildCritiqueMarkdown(drillType, input);
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/" className="text-xs text-neutral-500 hover:text-neutral-300">
          ← Dashboard
        </Link>
        <h1 className="mt-1 text-2xl font-semibold">{info.label}</h1>
        <p className="mt-1 text-sm text-neutral-400">{info.instructions}</p>
      </div>

      {config.timerSeconds && (
        <Card>
          <Timer seconds={config.timerSeconds} />
        </Card>
      )}

      {config.needsSource && (
        <Card>
          <SourcePicker
            onChange={({ sourceType, source }) => {
              setSourceType(sourceType);
              setSource(source);
            }}
          />
        </Card>
      )}

      {config.needsEntryPicker && (
        <Card>
          <EntryPicker onSelect={handleEntryPicked} />
          {source && <p className="mt-2 text-sm text-neutral-400">{source.excerpt}</p>}
        </Card>
      )}

      {config.needsModel && (
        <ModelPanel mode={config.needsModel} onModel={setModel} />
      )}

      <div className="space-y-4">
        {config.fields.map((field) => (
          <div key={field.key}>
            <label className="mb-1 block text-sm font-medium text-neutral-300">{field.label}</label>
            <TextArea value={input[field.key]} onChange={(v) => setField(field.key, v)} rows={field.rows} />
          </div>
        ))}
      </div>

      {config.wordTarget && (
        <p className={`text-xs ${wordTotal >= config.wordTarget[0] && wordTotal <= config.wordTarget[1] ? "text-emerald-500" : "text-neutral-500"}`}>
          {wordTotal} words (target {config.wordTarget[0]}-{config.wordTarget[1]})
        </p>
      )}

      {!saved ? (
        <Button onClick={save} disabled={!allFilled || saving}>
          {saving ? "Saving…" : "Save entry"}
        </Button>
      ) : (
        <div className="space-y-4">
          <Card className="border-emerald-700">
            <p className="text-sm text-emerald-400">Saved to your journal.</p>
            <div className="mt-3 flex gap-2">
              {drillType === "post-draft" && (
                <Button variant="secondary" onClick={copyForCritique}>
                  {copied ? "Copied!" : "Copy for critique"}
                </Button>
              )}
              <Link href="/journal">
                <Button variant="ghost">View journal</Button>
              </Link>
              <Link href="/">
                <Button variant="ghost">Back to dashboard</Button>
              </Link>
            </div>
          </Card>

          {critiqueLoading && (
            <Card>
              <div className="flex items-center gap-3">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
                <p className="text-sm text-neutral-400">Getting AI feedback…</p>
              </div>
            </Card>
          )}

          {critiqueError && (
            <Card className="border-amber-800">
              <p className="text-sm text-amber-400">Could not get AI feedback: {critiqueError}</p>
            </Card>
          )}

          {critique && <CritiquePanel critique={critique} />}
        </div>
      )}
    </div>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 8
      ? "bg-emerald-900 text-emerald-300 border-emerald-700"
      : score >= 6
        ? "bg-blue-900 text-blue-300 border-blue-700"
        : score >= 4
          ? "bg-amber-900 text-amber-300 border-amber-700"
          : "bg-red-900 text-red-300 border-red-700";

  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-lg font-bold ${color}`}>
      {score}/10
    </span>
  );
}

function CritiquePanel({ critique }: { critique: CritiqueResult }) {
  return (
    <Card className="border-blue-800">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wide">AI Feedback</h3>
        {critique.score > 0 && <ScoreBadge score={critique.score} />}
      </div>

      <p className="mt-3 text-sm text-neutral-200 leading-relaxed">{critique.feedback}</p>

      {critique.strengths.length > 0 && (
        <div className="mt-4">
          <h4 className="text-xs font-medium text-emerald-500 uppercase tracking-wide mb-1">Strengths</h4>
          <ul className="space-y-1">
            {critique.strengths.map((s, i) => (
              <li key={i} className="text-sm text-neutral-300 pl-4 relative before:content-['+'] before:absolute before:left-0 before:text-emerald-500 before:font-bold">
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {critique.improvements.length > 0 && (
        <div className="mt-4">
          <h4 className="text-xs font-medium text-amber-500 uppercase tracking-wide mb-1">To improve</h4>
          <ul className="space-y-1">
            {critique.improvements.map((s, i) => (
              <li key={i} className="text-sm text-neutral-300 pl-4 relative before:content-['-'] before:absolute before:left-0 before:text-amber-500 before:font-bold">
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {critique.followUp && (
        <div className="mt-4 rounded-lg bg-neutral-800/50 p-3">
          <h4 className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">Think about this</h4>
          <p className="text-sm text-neutral-200 italic">{critique.followUp}</p>
        </div>
      )}
    </Card>
  );
}
