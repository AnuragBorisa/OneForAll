# Roadmap: AI Feed

## Overview

The first milestone moves from infrastructure to a usable AI feed in thin vertical slices: establish the shared data and pipeline foundation, ship a unified multi-source feed, add practical explanation blocks, then complete the daily usage loop with filtering, saves, and digest views before hardening operations.

## Phases

- [ ] **Phase 1: Foundation** - Establish the app, database, canonical schema, and processing pipeline basics
- [ ] **Phase 2: Unified Feed** - Ship the mixed-source feed with source attribution and duplicate reduction
- [ ] **Phase 3: Explanation Layer** - Add structured AI explanations and item detail views
- [ ] **Phase 4: Personal Workflow** - Add filters, saved items, and daily digest views
- [ ] **Phase 5: Quality and Operations** - Add evaluation fixtures, contract checks, and operator reprocessing

## Phase Details

### Phase 1: Foundation
**Goal**: Create the application and data foundation shared by all later phases.
**Depends on**: Nothing (first phase)
**Requirements**: OPS-01, OPS-02
**Success Criteria** (what must be TRUE):
  1. Canonical source, feed, explanation, digest, and saved-item models exist
  2. A processing pipeline can fetch, normalize, and persist content state
  3. The app has a runnable structure for UI, APIs, and background jobs
**Plans**: 3 plans

Plans:
- [ ] 01-01: Initialize application structure and developer tooling
- [ ] 01-02: Define database schema and shared domain types
- [ ] 01-03: Create pipeline orchestration and normalization boundaries

### Phase 2: Unified Feed
**Goal**: Deliver a usable feed that combines all supported source families into one browsing experience.
**Depends on**: Phase 1
**Requirements**: FEED-01, FEED-02, FEED-03, FEED-04
**Success Criteria** (what must be TRUE):
  1. User can browse one feed containing items from X, Reddit, YouTube, and RSS/blogs
  2. Each visible item retains source attribution and a source link
  3. Duplicate or overlapping stories are reduced enough to keep the feed readable
**Plans**: 3 plans

Plans:
- [ ] 02-01: Implement source adapters for all four source families
- [ ] 02-02: Build duplicate reduction and feed ranking services
- [ ] 02-03: Build feed APIs and the main feed page

### Phase 3: Explanation Layer
**Goal**: Turn the feed into a practical learning product with structured explanations.
**Depends on**: Phase 2
**Requirements**: EXPL-01, EXPL-02, EXPL-03, EXPL-04, EXPL-05
**Success Criteria** (what must be TRUE):
  1. Published items include complete practical explanation blocks
  2. Users can open an item detail view and understand how to use the update
  3. Uncertain or promotional items include appropriate credibility notes
**Plans**: 3 plans

Plans:
- [ ] 03-01: Implement structured explanation generation
- [ ] 03-02: Add publishability and credibility rules
- [ ] 03-03: Build item detail API and UI

### Phase 4: Personal Workflow
**Goal**: Make the product usable as a daily routine with controls and catch-up surfaces.
**Depends on**: Phase 3
**Requirements**: FLOW-01, FLOW-02, FLOW-03, FLOW-04, FLOW-05
**Success Criteria** (what must be TRUE):
  1. User can filter the feed by source and topic
  2. User can save an item and retrieve it later
  3. User can review a short daily digest of important recent updates
**Plans**: 4 plans

Plans:
- [ ] 04-01: Add feed filtering controls and query support
- [ ] 04-02: Build save-item and saved-items flows
- [ ] 04-03: Implement daily digest generation and API
- [ ] 04-04: Build digest UI and WhatsApp-ready rendering

### Phase 5: Quality and Operations
**Goal**: Make the system easier to validate, tune, and operate over time.
**Depends on**: Phase 4
**Requirements**: OPS-03
**Success Criteria** (what must be TRUE):
  1. The team can evaluate normalization and explanation quality with repeatable fixtures
  2. API contracts and key integration paths are validated
  3. Operators can reprocess stored items and rerun digest generation
**Plans**: 3 plans

Plans:
- [ ] 05-01: Add fixtures and evaluation coverage
- [ ] 05-02: Add API contract and integration validation
- [ ] 05-03: Add operator reprocessing and digest rerun workflows

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 3/3 | Complete | 2026-03-10 |
| 2. Unified Feed | 3/3 | Complete | 2026-03-10 |
| 3. Explanation Layer | 3/3 | Complete | 2026-03-10 |
| 4. Personal Workflow | 4/4 | Complete | 2026-03-10 |
| 5. Quality and Operations | 3/3 | Complete | 2026-03-10 |
