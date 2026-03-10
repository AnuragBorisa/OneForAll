# Plan: AI Feed MVP

## Product Decision

Build a web app first. Add WhatsApp only as a digest and alert channel after the core feed is useful.

## Architecture Direction

- Frontend: Next.js web app
- API/backend: Next.js route handlers or a small service boundary if ingestion grows
- Storage: Postgres
- Background jobs: scheduled workers
- AI processing: structured summarization pipeline

## Core Pipeline

1. Fetch content from each source adapter
2. Persist raw payloads
3. Normalize into a shared record
4. Classify topic and content type
5. Deduplicate and cluster
6. Generate explanation blocks
7. Rank for feed placement
8. Publish to feed and digest views

## Key Design Decisions

- Treat sources as separate adapters but one downstream schema.
- Keep ranking separate from summarization.
- Store generated outputs with versioning.
- Start with lightweight heuristics before complex agent loops.

## Phase Order

1. Repo and schema foundation
2. RSS/blog ingestion
3. YouTube ingestion
4. Reddit ingestion
5. X ingestion
6. Summarization and ranking
7. Feed UI
8. Daily digest
