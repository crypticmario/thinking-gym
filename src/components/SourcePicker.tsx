"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import type { DrillSource, SourceType } from "@/lib/types";
import { Button, TextArea } from "@/components/Card";

export function SourcePicker({
  onChange,
}: {
  onChange: (value: { sourceType: SourceType; source?: DrillSource }) => void;
}) {
  const [mode, setMode] = useState<"none" | "fetched" | "manual">("none");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<DrillSource | null>(null);
  const [manualText, setManualText] = useState("");
  const [manualTitle, setManualTitle] = useState("");

  async function fetchFresh() {
    setLoading(true);
    setError(null);
    try {
      const { sourceType, source } = await api.source("any");
      setSource(source);
      setMode("fetched");
      onChange({ sourceType, source });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch a live example");
    } finally {
      setLoading(false);
    }
  }

  function useManual() {
    setMode("manual");
    onChange({ sourceType: "manual", source: { title: manualTitle || "Untitled", excerpt: manualText } });
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Button variant={mode === "fetched" ? "primary" : "secondary"} onClick={fetchFresh} disabled={loading}>
          {loading ? "Fetching…" : "Fetch a fresh example"}
        </Button>
        <Button variant={mode === "manual" ? "primary" : "secondary"} onClick={() => setMode("manual")}>
          Paste your own
        </Button>
      </div>

      {error && (
        <p className="text-sm text-red-400">
          {error} — try again, or use &quot;Paste your own&quot; instead.
        </p>
      )}

      {mode === "fetched" && source && (
        <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-3 text-sm">
          <p className="font-medium">{source.title}</p>
          {source.url && (
            <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-500 hover:underline">
              {source.url}
            </a>
          )}
          <p className="mt-2 whitespace-pre-wrap text-neutral-400">{source.excerpt}</p>
        </div>
      )}

      {mode === "manual" && (
        <div className="space-y-2">
          <input
            value={manualTitle}
            onChange={(e) => {
              setManualTitle(e.target.value);
            }}
            onBlur={useManual}
            placeholder="Title / source (optional)"
            className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus:border-emerald-600 focus:outline-none"
          />
          <TextArea
            value={manualText}
            onChange={(v) => {
              setManualText(v);
              onChange({ sourceType: "manual", source: { title: manualTitle || "Untitled", excerpt: v } });
            }}
            placeholder="Paste the tweet / post / article text here"
            rows={5}
          />
        </div>
      )}
    </div>
  );
}
