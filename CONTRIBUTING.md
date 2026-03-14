# Contributing

## Setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env`.
3. Start PostgreSQL and create a database named `ai_feed`.
4. Run `npm run db:migrate`.
5. Start the app with `npm run dev`.
6. Run a refresh with `npm run ingest:refresh`.

## Before opening a PR

- Run `npm run typecheck`
- Run `npm run build`
- Keep ingestion jobs idempotent
- Preserve source attribution
- Distinguish source facts from model inferences

## Scope guidelines

- Aggregate first, explain second, recommend third.
- Normalize all source content into the canonical schema before ranking.
- Do not remove raw payload storage if you improve extraction or summaries.
- Keep fallback behavior when a live source or model provider is unavailable.
