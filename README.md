# Thinking Gym

A local, single-user web app that turns the "Thinking in Public" curriculum (see [`Better thought.txt`](../Better%20thought.txt)) into a daily habit: drills for argument anatomy, mental models, counter-argument reflexes, synthesis, and writing, fed by live examples pulled from Reddit and RSS/news feeds.

## What it does

- **Fetches fresh examples** from Reddit (free, no API key) and RSS/news feeds to argue with, or lets you paste your own.
- **Runs the curriculum's drills**: 4-line argument diagrams, the "3-in-3" counter-argument sprint (with an on-screen timer), steelmanning, devil's-advocate-for-yourself, unusual connections, and the 5-part post shape.
- **Trains a much bigger mental models library** (~65 models across statistics, economics, game theory, systems thinking, cognitive bias, logic/rhetoric, decision theory, and epistemology) — going well beyond the curriculum's original 12, with both "Apply" and "Identify" drill modes so you train recognizing a model in the wild, not just applying one you're handed.
- **Tracks progress**: a day/phase counter derived from completed drills (not the calendar), a streak counter, a chart of your 3-in-3 counter-argument counts over time, and a model-exposure mastery grid.
- **Keeps a rereadable journal** of every drill you've ever done.
- **No built-in AI critique or API key.** Per the curriculum's own Phase 5 instruction, bring your drafts to a Claude chat for honest critique — the app's "Copy for critique" button on the writing drill formats an entry as markdown ready to paste in.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Your data (journal entries, model exposure, settings) lives in `data/db.json`, which is gitignored — it's yours, not meant to be committed or shared.

Configure which subreddits and RSS feeds to pull from under **Settings**.

## Tech

Next.js (App Router) + TypeScript + Tailwind CSS, with [lowdb](https://github.com/typicode/lowdb) for local JSON storage and [rss-parser](https://github.com/rbren/rss-parser) for feeds. No database server, no auth, no billing dependencies.

Note: Reddit's public JSON endpoint sometimes returns 403s from certain networks/IPs (e.g. some cloud/CI environments) — it should work fine from a normal home connection. If it doesn't, use "Paste your own" or rely on RSS feeds.
