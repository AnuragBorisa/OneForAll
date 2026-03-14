# Phase 5: Quality and Operations - Context

**Gathered:** 2026-03-10
**Status:** Ready for planning

<domain>
## Phase Boundary

Make the system easier to validate, tune, and operate. This phase covers fixture sets for normalization and explanation evaluation, API contract and integration validation scaffolding, and operator scripts for reprocessing items and rerunning digest generation.

</domain>

<decisions>
## Implementation Decisions

### Validation
- Prefer fixture-backed validation over broad runtime dependencies for now
- Add lightweight contract and integration scaffolding even if full test execution is deferred
- Keep validation close to the current contract and quickstart scenarios

### Operator workflows
- Operators need direct scripts for reprocessing feed items and rerunning digest generation
- Scripts should reuse the existing services instead of reimplementing business logic

### Claude's Discretion
- Exact fixture format and example coverage
- Whether validation files are executable tests or clearly structured scaffolds, as long as they are concrete and useful

</decisions>

<specifics>
## Specific Ideas

- The user wants this product to become a dependable daily system, so hardening and reprocessing matter
- Reprocessing is especially important because explanation quality will evolve over time

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `scripts/ingest/run-fixtures.ts`: Existing fixture ingestion path
- `src/server/digests/build-daily-digest.ts`: Reusable digest service
- `src/server/detail/get-item-detail.ts`: Reusable item detail and explanation assembly
- `specs/002-ai-feed-mvp/contracts/feed-api.yaml`: Contract source of truth
- `specs/002-ai-feed-mvp/quickstart.md`: Scenario source of truth

### Established Patterns
- Services are reused across routes, pages, and scripts
- Fixture-backed development has been the default path across earlier phases

### Integration Points
- Fixtures should feed the same normalization and explanation services used by the app
- Reprocessing scripts should call existing pipeline and digest services

</code_context>

<deferred>
## Deferred Ideas

- Full dependency installation and executable runtime test suite remain outside this turn unless explicitly requested
- Production delivery infrastructure is beyond this hardening phase

</deferred>

---

*Phase: 05-quality-and-operations*
*Context gathered: 2026-03-10*
