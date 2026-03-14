# Implementation Plan: AI Feed MVP

**Branch**: `002-ai-feed-mvp` | **Date**: 2026-03-10 | **Spec**: [spec.md](/Users/anurag/Documents/ai_feed/specs/002-ai-feed-mvp/spec.md)
**Input**: Feature specification from `/specs/002-ai-feed-mvp/spec.md`

## Summary

Build a web-first AI feed that ingests AI content from X, Reddit, YouTube, and RSS/blogs, normalizes it into a shared feed model, generates practical explanation blocks, and exposes the result through a personalized feed, saved-items view, and daily digest. The initial implementation uses a single Next.js TypeScript application with server-side ingestion modules, a Postgres database for canonical storage, and scheduled jobs for collection, enrichment, and digest generation.

## Technical Context

**Language/Version**: TypeScript 5.x on Node.js 22  
**Primary Dependencies**: Next.js 15, React 19, Drizzle ORM, Zod, OpenAI-compatible SDK, RSS parser and source-specific API clients  
**Storage**: PostgreSQL for application data and processing state  
**Testing**: Vitest for unit/integration coverage, Playwright for core user flows, fixture-based contract checks for source adapters  
**Target Platform**: Web application running on Linux-based serverless or container hosting  
**Project Type**: Web application with background ingestion and processing jobs  
**Performance Goals**: Feed loads first page in under 2 seconds for a typical signed-in user; daily ingest completes within 15 minutes for the tracked source set; digest generation completes within 2 minutes  
**Constraints**: Preserve source attribution on every published item, degrade gracefully when a source adapter fails, avoid publishing incomplete explanation blocks, and keep the architecture simple enough for a single-user MVP  
**Scale/Scope**: Single-user or small alpha deployment, four source families, daily ingestion cadence with periodic refreshes, hundreds to low thousands of items per day

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- `Practical Signal Over Content Volume`: Pass. The plan optimizes for a compact useful feed, digest views, and explanation quality instead of broad social features.
- `Source Transparency Is Mandatory`: Pass. The data model and contracts preserve source platform, author, URL, and timing on every feed item.
- `Normalize Before Intelligence`: Pass. The architecture separates raw source items from normalized feed items and explanation blocks.
- `Explain for Action`: Pass. Explanation blocks require practical sections including why it matters, example, use cases, and next step.
- `Thin Vertical Slices`: Pass. The implementation can ship as vertical slices beginning with ingestion and feed display before adding more advanced ranking and digest delivery.

## Project Structure

### Documentation (this feature)

```text
specs/002-ai-feed-mvp/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── feed-api.yaml
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── (feed)/
│   ├── api/
│   └── saved/
├── components/
├── lib/
├── server/
│   ├── db/
│   ├── ingestion/
│   │   ├── adapters/
│   │   └── jobs/
│   ├── pipeline/
│   ├── ranking/
│   └── digests/
└── types/

scripts/
├── ingest/
└── eval/

tests/
├── contract/
├── fixtures/
├── integration/
└── unit/
```

**Structure Decision**: Use a single full-stack Next.js application with clear server-side domain folders for ingestion, pipeline processing, ranking, and digest generation. This avoids an early split into separate frontend and backend services while keeping source adapters and processing logic isolated enough to extract later if needed.

## Complexity Tracking

No constitution violations currently require justification.
