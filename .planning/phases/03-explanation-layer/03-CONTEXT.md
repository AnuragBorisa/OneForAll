# Phase 3: Explanation Layer - Context

**Gathered:** 2026-03-10
**Status:** Ready for planning

<domain>
## Phase Boundary

Turn the mixed-source feed into a practical learning product with structured explanations. This phase covers explanation generation, credibility and publishability rules, and the item detail API and UI.

</domain>

<decisions>
## Implementation Decisions

### Explanation shape
- Every explanation should include simple explanation, why it matters, example, use cases, who should care, next step, and credibility notes
- Keep the first implementation deterministic and fixture-friendly rather than model-dependent
- Treat explanation generation as a pipeline service, not UI-only formatting

### Trust and quality
- Separate explanation generation from publishability checks
- Add credibility notes when the source looks opinionated, early, or weakly evidenced
- Avoid publishing incomplete explanation payloads

### UI
- Add a dedicated item detail page and route
- Keep the explanation sections structured and easy to scan
- Preserve source attribution and source link on the detail page

### Claude's Discretion
- Exact heuristics used for credibility notes
- How explanation text is generated from normalized feed items as long as it stays structured and practical
- Page layout details within the established visual direction

</decisions>

<specifics>
## Specific Ideas

- The user wants every item explained in the easiest way with examples and use cases
- This phase should make the product feel meaningfully different from a normal news reader

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `.planning/phases/02-unified-feed/*-SUMMARY.md`: Working mixed-source feed API and page
- `src/server/ranking/get-feed.ts`: Current feed assembly service
- `src/server/pipeline/explanation-schema.ts`: Existing explanation shape validator

### Established Patterns
- Server-side services feed both API routes and pages
- Fixture-backed development paths are preferred until live dependencies are required

### Integration Points
- Explanation generation attaches to existing feed items
- Publishability rules feed both API output and later digest selection
- Item detail page will extend the existing feed flow

</code_context>

<deferred>
## Deferred Ideas

- Saved items and digest flows belong to Phase 4
- Evaluation fixtures and contract hardening belong to Phase 5

</deferred>

---

*Phase: 03-explanation-layer*
*Context gathered: 2026-03-10*
