# Thinking Gym

A web app that turns the "Thinking in Public" curriculum (see [`Better thought.txt`](../Better%20thought.txt)) into a daily habit: drills for argument anatomy, mental models, counter-argument reflexes, synthesis, and writing, fed by live examples pulled from Reddit, Hacker News, and RSS/news feeds.

## What it does

- **Auto-loads a fresh feed** every time you open the dashboard — live examples from Reddit, Hacker News, and RSS news feeds, ready to practice with in one click.
- **One-click drill start** — tap "Practice" on any feed item and the content is pre-loaded into the drill, no fetching or pasting needed.
- **Runs the curriculum's drills**: 4-line argument diagrams, the "3-in-3" counter-argument sprint (with an on-screen timer), steelmanning, devil's-advocate-for-yourself, unusual connections, and the 5-part post shape.
- **Trains a much bigger mental models library** (~65 models across statistics, economics, game theory, systems thinking, cognitive bias, logic/rhetoric, decision theory, and epistemology) — going well beyond the curriculum's original 12, with both "Apply" and "Identify" drill modes so you train recognizing a model in the wild, not just applying one you're handed.
- **Tracks progress**: a day/phase counter derived from completed drills (not the calendar), a streak counter, a chart of your 3-in-3 counter-argument counts over time, and a model-exposure mastery grid.
- **Keeps a rereadable journal** of every drill you've ever done.
- **AI critique after every drill** (optional) — when an Anthropic API key is configured, you get instant AI feedback on your thinking: a score, specific strengths and weaknesses, and a follow-up question to push you further. Powered by Claude Haiku for cost efficiency.
- **AI-curated feed** — when AI is enabled, the feed is filtered for content with strong, arguable positions worth practicing on, instead of random news.

## Getting started (local)

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Your data lives in `data/db.json`, which is gitignored.

Configure which subreddits and RSS feeds to pull from under **Settings**.

## Deploy to Vercel

This app is ready to deploy to Vercel with Neon Postgres for persistent storage.

1. Push this repo to GitHub (already at [crypticmario/thinking-gym](https://github.com/crypticmario/thinking-gym))
2. Go to [vercel.com](https://vercel.com) and import the GitHub repo
3. In the Vercel dashboard, go to **Storage** → **Create Database** → choose **Neon Postgres**
4. Connect the database to your project — this auto-sets the `DATABASE_URL` environment variable
5. Redeploy (Vercel does this automatically when you connect a database)

That's it. The app detects `DATABASE_URL` and uses Postgres instead of the local JSON file. No other configuration needed.

For local development, no database is required — it falls back to lowdb (`data/db.json`) automatically.

## AI Features (optional)

To enable AI critique and smart feed curation, set your Anthropic API key:

- **Local**: add `ANTHROPIC_API_KEY=sk-ant-...` to a `.env.local` file
- **Vercel**: add `ANTHROPIC_API_KEY` under Project Settings → Environment Variables

The app works fully without the key — AI features are just not shown. Check Settings to see whether AI is active.

## Tech

Next.js (App Router) + TypeScript + Tailwind CSS. Local storage via [lowdb](https://github.com/typicode/lowdb), production storage via [Neon Postgres](https://neon.tech). Content from [rss-parser](https://github.com/rbren/rss-parser), Reddit JSON API, and Hacker News Firebase API. AI via [Anthropic SDK](https://github.com/anthropics/anthropic-sdk-node) (Claude Haiku).

Note: Reddit's public JSON endpoint sometimes returns 403s from certain networks/IPs (e.g. some cloud/CI environments). Hacker News and RSS feeds are more reliable fallbacks.
