# Phase 4: Personal Workflow - Context

**Gathered:** 2026-03-10
**Status:** Ready for planning

<domain>
## Phase Boundary

Make the product usable as a daily routine with filters, save-for-later behavior, and daily digest views. This phase covers feed query filtering, save-item APIs and pages, digest generation, digest APIs, and a WhatsApp-ready digest rendering format.

</domain>

<decisions>
## Implementation Decisions

### User workflow
- Add source and topic filtering first at the feed level
- Keep save flows lightweight and local-first for the MVP
- Use a generated digest page as the main catch-up surface before real outbound delivery

### Persistence shape
- Saved items can use in-memory or fixture-backed state for now if database writes are not yet active
- Digest generation should reuse existing feed and explanation services rather than introducing a separate content model

### Delivery
- Daily digest should be short, ranked, and link back to the underlying items
- Add a WhatsApp-oriented text rendering helper even if actual delivery is deferred

### Claude's Discretion
- Exact filter UI shape and query encoding
- Internal storage mechanism for MVP save state
- Digest ranking heuristics as long as they stay understandable and useful

</decisions>

<specifics>
## Specific Ideas

- The user wants this to feel like their own AI social media, so saved items and daily catch-up matter almost as much as the raw feed
- WhatsApp remains a distribution surface, not the primary browsing surface

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `.planning/phases/02-unified-feed/*-SUMMARY.md`: Working feed APIs and feed page
- `.planning/phases/03-explanation-layer/*-SUMMARY.md`: Working explanation generation and item detail views
- `src/server/ranking/get-feed.ts`: Central feed assembly service
- `src/server/detail/get-item-detail.ts`: Detail and explanation assembly service

### Established Patterns
- Services are shared between API routes and pages
- Feature work is fixture-backed first when persistence is not fully wired

### Integration Points
- Filters extend the existing feed service and feed page
- Saves attach to existing feed item IDs
- Digest generation should consume the same feed and detail services

</code_context>

<deferred>
## Deferred Ideas

- Real WhatsApp delivery integration is deferred beyond this phase
- Contract and integration hardening belong to Phase 5

</deferred>

---

*Phase: 04-personal-workflow*
*Context gathered: 2026-03-10*
