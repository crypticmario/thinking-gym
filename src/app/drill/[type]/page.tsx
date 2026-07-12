"use client";

import { use, useMemo, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
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
      )}
    </div>
  );
}
