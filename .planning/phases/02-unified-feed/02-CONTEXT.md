# Phase 2: Unified Feed - Context

**Gathered:** 2026-03-10
**Status:** Ready for planning

<domain>
## Phase Boundary

Deliver a usable feed that combines supported source families into one browsing experience. This phase covers source adapters, duplicate reduction and ranking foundations, the feed API, and the main feed UI with source attribution and links.

</domain>

<decisions>
## Implementation Decisions

### Source coverage
- Include RSS/blogs, YouTube, Reddit, and X in this phase
- Keep source implementations isolated so one weak integration does not block the full feed
- Start with adapter foundations and fixture-friendly outputs before trying to optimize freshness

### Feed behavior
- Show a single mixed-source feed with clear source attribution
- Keep duplicate reduction heuristic-first and inspectable
- Preserve original links from every feed item

### Delivery style
- Prefer server-rendered feed data flow for the first version
- Build reusable UI pieces for feed cards and source badges so later detail and save flows reuse them

### Claude's Discretion
- Exact adapter fetch implementation details and placeholders where credentials are unavailable
- Internal ranking heuristics as long as they remain simple and explainable
- Feed page composition and card layout details within the product direction

</decisions>

<specifics>
## Specific Ideas

- The user wants the product to feel like their own AI social media, but this phase should stay focused on a strong read-only feed first
- X is especially important for workflows, so the adapter contract should support threads and builder-style items later

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `.planning/phases/01-foundation/*-SUMMARY.md`: Established app shell, schema, normalization, and pipeline boundaries
- `src/types/feed.ts`: Canonical source and feed types
- `src/server/ingestion/adapters/types.ts`: Source adapter interface contracts
- `src/server/pipeline/normalize-item.ts`: Canonical normalization entry point

### Established Patterns
- One Next.js app with server-side domain folders under `src/server/`
- Explicit explanation and processing-state validation rather than implicit assumptions

### Integration Points
- Source adapters feed into pipeline normalization
- Ranking and clustering services feed the feed API
- Feed API powers the main feed page and reusable feed card components

</code_context>

<deferred>
## Deferred Ideas

- Detailed explanation generation belongs to Phase 3
- Saved items and digest flows belong to Phase 4
- Contract and fixture hardening belong to Phase 5

</deferred>

---

*Phase: 02-unified-feed*
*Context gathered: 2026-03-10*
