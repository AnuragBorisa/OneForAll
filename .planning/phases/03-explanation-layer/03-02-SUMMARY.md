---
phase: 03-explanation-layer
plan: 02
subsystem: api
tags: [credibility, validation, publishability]
requires:
  - phase: 03-explanation-layer
    provides: Structured explanation payloads
provides:
  - Credibility note heuristics
  - Publishability decision helpers
affects: [detail-api, digests, saved-items]
tech-stack:
  added: [credibility heuristics]
  patterns: [separate trust signals from core explanation generation]
key-files:
  created: [src/server/pipeline/credibility-notes.ts, src/server/pipeline/publishable-item.ts]
  modified: []
key-decisions:
  - "Separate credibility note generation from explanation generation."
  - "Use a single publishability helper so later routes and jobs share the same gate."
patterns-established:
  - "Trust metadata augments explanation content instead of being hard-coded in UI."
  - "Routes and pages should rely on publishability helpers rather than ad hoc checks."
requirements-completed: [EXPL-05]
duration: 11min
completed: 2026-03-10
---

# Phase 3: Explanation Layer Summary

**Credibility notes and publishability rules now prevent weak explanation output from looking fully trusted**

## Performance

- **Duration:** 11 min
- **Started:** 2026-03-10T19:09:00Z
- **Completed:** 2026-03-10T19:20:00Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- Added credibility note heuristics based on source and textual signals
- Added a publishability gate for explanation payloads
- Established a trust-layer boundary for later API, digest, and save flows

## Task Commits

Commits were not created in this session.

## Files Created/Modified
- `src/server/pipeline/credibility-notes.ts` - Credibility and caveat note heuristics
- `src/server/pipeline/publishable-item.ts` - Explanation publishability helpers

## Decisions Made

- Treated credibility as separate metadata so uncertainty can be added without changing core explanation fields.
- Reused the explanation schema as the minimum completeness gate.

## Deviations from Plan

None - plan executed as intended without changing scope.

## Issues Encountered

- Heuristics are intentionally simple and will need refinement once live source noise is available.

## User Setup Required

None.

## Next Phase Readiness

- The detail route can now return explanation output with a clear trust signal.
- Later digest selection can reuse the same publishability checks.

---
*Phase: 03-explanation-layer*
*Completed: 2026-03-10*
