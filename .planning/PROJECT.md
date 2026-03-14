# AI Feed

## What This Is

AI Feed is a web-first product for staying current on AI without checking X, Reddit, YouTube, and blogs separately. It gathers those sources into one feed, explains each item in simple practical language, and helps the user decide what matters and how to use it.

## Core Value

One place to understand the most useful AI updates quickly enough to act on them the same day.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Unified AI feed across X, Reddit, YouTube, and RSS/blogs
- [ ] AI-powered explanation blocks with examples, use cases, and next-step guidance
- [ ] Filtering, saved items, and daily digest for short catch-up sessions

### Out of Scope

- Full social posting platform — the product is a personalized intelligence feed, not a new public network
- Community comments and social graph — too broad for the MVP and not required to validate the core value
- Native mobile apps — web-first is faster and sufficient for the first release

## Context

- The repo uses `spec-kit` for feature specification and implementation planning.
- The repo uses `GSD` for project execution planning and phased delivery.
- The product must preserve source attribution and distinguish source facts from model-generated interpretation.
- X is strategically important because many AI builders share workflows there, but source integration constraints must not block the rest of the pipeline.

## Constraints

- **Product**: Web app first — browsing, filtering, and archive views need a richer surface than chat alone
- **Delivery**: WhatsApp is secondary — use it for digests and alerts rather than primary browsing
- **Architecture**: Normalize all source content into one canonical model — ranking and explanations depend on shared structure
- **Reliability**: Raw source payloads must be retained — reprocessing is required as prompts and heuristics improve
- **Scope**: Keep the MVP thin and end-to-end — validate ingestion plus explanation before expanding distribution

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Build web-first | Best surface for browsing, filtering, and saved items | — Pending |
| Use a single Next.js app first | Keeps UI, API, and server workflows together for MVP speed | — Pending |
| Use PostgreSQL for canonical storage | Fits relational entities, state transitions, and reprocessing needs | — Pending |
| Treat WhatsApp as a digest channel | Strong for catch-up, weak for deep feed interaction | — Pending |
| Keep source adapters isolated behind one normalized model | Preserves source-specific handling without fragmenting the product | — Pending |

---
*Last updated: 2026-03-10 after initial spec-kit planning for 002-ai-feed-mvp*
