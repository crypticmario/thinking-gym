"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Settings } from "@/lib/types";
import { Button, Card } from "@/components/Card";

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [subredditsText, setSubredditsText] = useState("");
  const [feeds, setFeeds] = useState<{ name: string; url: string }[]>([]);
  const [saved, setSaved] = useState(false);
  const [aiConfigured, setAiConfigured] = useState<boolean | null>(null);

  useEffect(() => {
    api.settings().then(({ settings }) => {
      setSettings(settings);
      setSubredditsText(settings.subreddits.join("\n"));
      setFeeds(settings.rssFeeds);
    });
    api.aiStatus().then(({ configured }) => setAiConfigured(configured)).catch(() => setAiConfigured(false));
  }, []);

  async function save() {
    const subreddits = subredditsText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    const { settings } = await api.updateSettings({ subreddits, rssFeeds: feeds });
    setSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function updateFeed(index: number, key: "name" | "url", value: string) {
    setFeeds((prev) => prev.map((f, i) => (i === index ? { ...f, [key]: value } : f)));
  }

  function addFeed() {
    setFeeds((prev) => [...prev, { name: "", url: "" }]);
  }

  function removeFeed(index: number) {
    setFeeds((prev) => prev.filter((_, i) => i !== index));
  }

  if (!settings) return <p className="text-neutral-400">Loading…</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Settings</h1>

      <Card>
        <h2 className="mb-2 font-medium">Subreddits (free, read-only, no key needed)</h2>
        <p className="mb-2 text-xs text-neutral-500">One subreddit name per line, no r/ prefix.</p>
        <textarea
          value={subredditsText}
          onChange={(e) => setSubredditsText(e.target.value)}
          rows={6}
          className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 font-mono text-sm text-neutral-100 focus:border-emerald-600 focus:outline-none"
        />
      </Card>

      <Card>
        <h2 className="mb-2 font-medium">RSS feeds</h2>
        <div className="space-y-2">
          {feeds.map((feed, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={feed.name}
                onChange={(e) => updateFeed(i, "name", e.target.value)}
                placeholder="Name"
                className="w-1/3 rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 focus:border-emerald-600 focus:outline-none"
              />
              <input
                value={feed.url}
                onChange={(e) => updateFeed(i, "url", e.target.value)}
                placeholder="https://example.com/feed.xml"
                className="flex-1 rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 focus:border-emerald-600 focus:outline-none"
              />
              <Button variant="ghost" onClick={() => removeFeed(i)}>
                ✕
              </Button>
            </div>
          ))}
        </div>
        <Button variant="secondary" onClick={addFeed} className="mt-3">
          + Add feed
        </Button>
      </Card>

      <Button onClick={save}>{saved ? "Saved!" : "Save settings"}</Button>

      <Card>
        <h2 className="mb-2 font-medium">AI Integration</h2>
        {aiConfigured === null ? (
          <p className="text-sm text-neutral-500">Checking…</p>
        ) : aiConfigured ? (
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <p className="text-sm text-emerald-400">AI critique and smart feed curation are active.</p>
            </div>
            <p className="mt-2 text-xs text-neutral-500">
              Powered by Claude Haiku. After each drill, you&apos;ll get instant feedback on your thinking.
              Your feed is also filtered for content with strong, arguable positions.
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-neutral-600" />
              <p className="text-sm text-neutral-400">AI features are not configured.</p>
            </div>
            <p className="mt-2 text-xs text-neutral-500">
              To enable AI critique and smart feed curation, set the <code className="text-neutral-300">ANTHROPIC_API_KEY</code> environment variable.
            </p>
            <p className="mt-1 text-xs text-neutral-500">
              Local: add <code className="text-neutral-300">ANTHROPIC_API_KEY=sk-ant-...</code> to a <code className="text-neutral-300">.env.local</code> file.
              <br />
              Vercel: add it under Project Settings → Environment Variables.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
