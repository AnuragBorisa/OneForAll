# AI Feed

AI Feed is a web-first product that ingests updates from RSS/blogs, Reddit, YouTube, and X, then turns them into readable feed items with quick breakdowns and optional detailed explanations.

## What it does

- Aggregates live source content into one feed
- Preserves attribution: platform, author, URL, and publish time
- Stores feed items, explanations, saved items, and digests in PostgreSQL
- Supports AI and Quantum content presets
- Uses model-backed explanations when configured, with heuristic fallback
- Lets users refresh and configure sources from the UI

## Stack

- Next.js 15
- React 19
- TypeScript 5
- PostgreSQL
- Drizzle ORM
- OpenAI-compatible model providers

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Copy envs:

```bash
cp .env.example .env
```

3. Start PostgreSQL and create `ai_feed`.

4. Run migrations:

```bash
npm run db:migrate
```

5. Start the app:

```bash
npm run dev
```

6. Refresh live data:

```bash
npm run ingest:refresh
```

## Environment

Core variables:

- `DATABASE_URL`
- `APP_BASE_URL`
- `REFRESH_JOB_TOKEN`

Optional provider variables:

- `OPENAI_API_KEY`
- `OPENAI_API_BASE_URL`
- `OPENAI_MODEL`
- `X_BEARER_TOKEN`

Most content source settings can also be managed from `/settings`.

## Deploy

The simplest low-cost deployment shape for this repo is:

- Vercel for the Next.js app
- Neon for PostgreSQL
- GitHub Actions calling `/api/jobs/refresh` on a schedule

## Open-source notes

- Do not commit `.env`
- Keep admin and refresh secrets private
- If you run a public instance, protect `/settings` and admin actions before wider sharing

## Scripts

- `npm run dev`
- `npm run build`
- `npm run typecheck`
- `npm run db:migrate`
- `npm run ingest:rss`
- `npm run ingest:refresh`
- `npm run digest:run`
