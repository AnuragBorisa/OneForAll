# Phase 1: Foundation - Context

**Gathered:** 2026-03-10
**Status:** Ready for planning

<domain>
## Phase Boundary

Create the application and data foundation shared by all later phases. This phase covers the app skeleton, environment and developer tooling, canonical types and schemas, and the processing pipeline boundaries needed before any source-specific feature work starts.

</domain>

<decisions>
## Implementation Decisions

### Architecture
- Use a single Next.js TypeScript application for the MVP rather than split frontend and backend services
- Keep server-side ingestion, pipeline, ranking, and digest code in dedicated domain folders under `src/server/`
- Keep the web app as the primary product surface

### Data foundation
- Use PostgreSQL as the main persistence layer
- Define one canonical normalized model for source items, feed items, explanation blocks, digests, and saved items
- Preserve raw payloads for reprocessing

### Reliability
- Make ingestion and processing states explicit and forward-moving
- Validate explanation shape before any item can be published later
- Keep source adapters isolated so a failure in one source does not contaminate the shared pipeline

### Claude's Discretion
- Exact package manager and project bootstrap details
- Internal folder naming below the agreed phase boundary
- Migration and seeding workflow specifics as long as they remain simple and reproducible

</decisions>

<specifics>
## Specific Ideas

- The feed should eventually feel like a personal AI social media product, but this phase should stay focused on the invisible foundation required for that experience
- The architecture should make it easy to reprocess stored content as prompt quality improves

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `specs/002-ai-feed-mvp/`: Product spec, data model, contract, and tasks for the MVP
- `skills/ai-feed-product/`: Project-specific product rules and architecture expectations

### Established Patterns
- `AGENTS.md`: Requires use of real `spec-kit` and `GSD` workflows
- `.planning/ROADMAP.md`: Defines the phase and plan breakdown that this context supports

### Integration Points
- Phase 1 outputs will be consumed by later feed, explanation, and digest phases
- Database and type definitions will anchor all future route and pipeline implementations

</code_context>

<deferred>
## Deferred Ideas

- Source-specific adapter implementation belongs to Phase 2
- AI explanation generation belongs to Phase 3
- Saved items, filtering, and digest experience belong to Phase 4

</deferred>

---

*Phase: 01-foundation*
*Context gathered: 2026-03-10*
