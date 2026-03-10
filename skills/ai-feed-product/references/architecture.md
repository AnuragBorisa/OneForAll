# Architecture Reference

## Ingestion Pipeline

1. Fetch source content
2. Persist raw payloads
3. Normalize into canonical content records
4. Classify and tag
5. Deduplicate and cluster
6. Generate explanations
7. Rank and publish

## Suggested Initial Stack

- Frontend: Next.js
- Backend/API: Next.js server routes or FastAPI
- Database: Postgres
- Jobs: cron-triggered workers, then queue workers if needed
- AI summarization: structured prompt + JSON output

## Operational Notes

- Keep source adapters isolated by platform.
- Make jobs idempotent.
- Version prompts and output schemas.
- Preserve raw text and extraction metadata.
