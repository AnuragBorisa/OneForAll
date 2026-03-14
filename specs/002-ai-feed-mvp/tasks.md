# Tasks: AI Feed MVP

**Input**: Design documents from `/specs/002-ai-feed-mvp/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/feed-api.yaml, quickstart.md

**Tests**: Explicit standalone test tasks are omitted for now because the feature request did not require a TDD-first workflow. Validation remains part of implementation and quickstart review.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize the application and core developer tooling

- [ ] T001 Create the base application structure in `src/`, `scripts/`, and `tests/` to match `specs/002-ai-feed-mvp/plan.md`
- [ ] T002 Initialize the Next.js TypeScript application and root package configuration in `package.json`, `tsconfig.json`, `next.config.ts`, and `src/app/`
- [ ] T003 [P] Configure code quality and environment file conventions in `eslint.config.*`, `prettier.config.*`, `.env.example`, and `src/lib/env.ts`
- [ ] T004 [P] Set up Drizzle and PostgreSQL configuration in `drizzle.config.ts`, `src/server/db/client.ts`, and `src/server/db/schema/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Build the shared domain and processing foundation that all user stories depend on

**⚠️ CRITICAL**: No user story work should begin until this phase is complete

- [ ] T005 Create shared domain types for sources, content types, processing states, and explanation schema in `src/types/feed.ts`
- [ ] T006 Create database schema definitions for source items, feed items, clusters, explanations, digests, and saved items in `src/server/db/schema/feed.ts`
- [ ] T007 Implement database migration and seed entry points in `scripts/ingest/migrate.ts` and `scripts/ingest/seed-fixtures.ts`
- [ ] T008 [P] Create source adapter interfaces and normalization contracts in `src/server/ingestion/adapters/types.ts`
- [ ] T009 [P] Implement the canonical normalization service boundary in `src/server/pipeline/normalize-item.ts`
- [ ] T010 [P] Implement explanation schema validation and publishability checks in `src/server/pipeline/explanation-schema.ts`
- [ ] T011 Implement shared feed repository queries for listing, filtering, item lookup, and save operations in `src/server/db/repositories/feed-repository.ts`
- [ ] T012 Implement processing job orchestration entry points for fetch, normalize, cluster, explain, and digest stages in `src/server/ingestion/jobs/run-pipeline.ts`

**Checkpoint**: Foundation ready. User story implementation can now proceed in priority order.

---

## Phase 3: User Story 1 - Review one unified AI feed (Priority: P1) 🎯 MVP

**Goal**: Deliver a working mixed-source AI feed with source attribution, canonical normalization, and duplicate reduction.

**Independent Test**: Ingest fixture or live sample content from all four source families, open the feed, and confirm the user can browse a combined feed with grouped duplicates and source links.

- [ ] T013 [P] [US1] Implement the RSS/blog source adapter in `src/server/ingestion/adapters/rss.ts`
- [ ] T014 [P] [US1] Implement the YouTube source adapter in `src/server/ingestion/adapters/youtube.ts`
- [ ] T015 [P] [US1] Implement the Reddit source adapter in `src/server/ingestion/adapters/reddit.ts`
- [ ] T016 [P] [US1] Implement the X source adapter in `src/server/ingestion/adapters/x.ts`
- [ ] T017 [US1] Implement duplicate detection and story clustering heuristics in `src/server/ranking/cluster-stories.ts`
- [ ] T018 [US1] Implement the feed query service that merges normalized items and cluster metadata in `src/server/ranking/get-feed.ts`
- [ ] T019 [US1] Implement the feed list API in `src/app/api/feed/route.ts`
- [ ] T020 [US1] Build the main feed page with mixed-source cards and source attribution in `src/app/(feed)/page.tsx`
- [ ] T021 [US1] Build reusable feed card and source badge components in `src/components/feed-card.tsx` and `src/components/source-badge.tsx`
- [ ] T022 [US1] Add fixture-backed ingestion command support for all adapters in `scripts/ingest/run-fixtures.ts`

**Checkpoint**: User Story 1 is functional as a standalone MVP feed.

---

## Phase 4: User Story 2 - Understand why an item matters and how to use it (Priority: P2)

**Goal**: Add structured AI explanations that turn feed items into practical learning and action.

**Independent Test**: Open any published feed item and confirm it includes a complete explanation block with simple explanation, why it matters, example or use case, next step, and caveat notes where needed.

- [ ] T023 [P] [US2] Implement explanation prompt assembly and structured generation in `src/server/pipeline/generate-explanation.ts`
- [ ] T024 [P] [US2] Implement credibility and caveat scoring rules in `src/server/pipeline/credibility-notes.ts`
- [ ] T025 [US2] Implement explanation persistence and reprocessing workflow in `src/server/pipeline/save-explanation.ts`
- [ ] T026 [US2] Implement the item detail API in `src/app/api/items/[itemId]/route.ts`
- [ ] T027 [US2] Build the feed item detail page with structured explanation sections in `src/app/(feed)/items/[itemId]/page.tsx`
- [ ] T028 [US2] Build explanation section components for practical summaries in `src/components/explanation-block.tsx`
- [ ] T029 [US2] Prevent publication of incomplete explanations in `src/server/pipeline/publishable-item.ts`

**Checkpoint**: User Stories 1 and 2 both work independently, and the product now differentiates itself from a generic aggregator.

---

## Phase 5: User Story 3 - Catch up quickly with personalized filtering and digest views (Priority: P3)

**Goal**: Add feed controls, save-for-later behavior, and a daily digest workflow for fast catch-up.

**Independent Test**: Filter the feed by source and topic, save an item, retrieve it later, and open a daily digest showing the top recent items.

- [ ] T030 [P] [US3] Implement source and topic filter state handling in `src/lib/feed-filters.ts` and `src/app/(feed)/page.tsx`
- [ ] T031 [US3] Implement the save-item API in `src/app/api/items/[itemId]/save/route.ts`
- [ ] T032 [US3] Implement the saved-items API in `src/app/api/saved/route.ts`
- [ ] T033 [US3] Build the saved-items page in `src/app/saved/page.tsx`
- [ ] T034 [US3] Implement daily digest selection and generation logic in `src/server/digests/build-daily-digest.ts`
- [ ] T035 [US3] Implement the daily digest API in `src/app/api/digests/daily/route.ts`
- [ ] T036 [US3] Build the daily digest page in `src/app/(feed)/digest/page.tsx`
- [ ] T037 [US3] Add digest formatting for a future WhatsApp delivery payload in `src/server/digests/render-whatsapp-digest.ts`

**Checkpoint**: All three user stories are independently functional and support a daily usage loop.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Strengthen quality, operator visibility, and execution readiness across stories

- [ ] T038 [P] Add fixture sets for source normalization and explanation evaluation in `tests/fixtures/`
- [ ] T039 [P] Add contract coverage for `specs/002-ai-feed-mvp/contracts/feed-api.yaml` in `tests/contract/feed-api.contract.ts`
- [ ] T040 Add integration coverage for feed, item detail, save flow, and digest flow in `tests/integration/feed-flow.test.ts`
- [ ] T041 Add operator scripts for reprocessing items and rerunning digest generation in `scripts/ingest/reprocess-items.ts` and `scripts/ingest/run-digest.ts`
- [ ] T042 Run the scenarios in `specs/002-ai-feed-mvp/quickstart.md` and document any gaps in `specs/002-ai-feed-mvp/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1: Setup** has no dependencies and starts immediately.
- **Phase 2: Foundational** depends on Phase 1 and blocks all story work.
- **Phase 3: User Story 1** depends on Phase 2 and is the MVP release slice.
- **Phase 4: User Story 2** depends on Phase 2 and on the existence of publishable feed items from User Story 1.
- **Phase 5: User Story 3** depends on Phase 2 and reuses feed and item entities from earlier stories.
- **Phase 6: Polish** depends on the completion of the desired story phases.

### User Story Dependencies

- **User Story 1 (P1)**: No dependency on other stories after the foundational phase.
- **User Story 2 (P2)**: Depends on User Story 1 output because explanations attach to feed items.
- **User Story 3 (P3)**: Depends on User Story 1 feed views and can incorporate User Story 2 explanation blocks where available.

### Parallel Opportunities

- T003 and T004 can run in parallel after T002.
- T008, T009, and T010 can run in parallel after T005 and T006.
- T013 through T016 can run in parallel because each adapter targets a separate file.
- T023 and T024 can run in parallel because prompt assembly and credibility rules are separate modules.
- T038 and T039 can run in parallel during polish.

## Parallel Example: User Story 1

```bash
Task: "Implement the RSS/blog source adapter in src/server/ingestion/adapters/rss.ts"
Task: "Implement the YouTube source adapter in src/server/ingestion/adapters/youtube.ts"
Task: "Implement the Reddit source adapter in src/server/ingestion/adapters/reddit.ts"
Task: "Implement the X source adapter in src/server/ingestion/adapters/x.ts"
```

## Implementation Strategy

### MVP First

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Validate the quickstart scenario for the unified feed before adding explanation logic

### Incremental Delivery

1. Deliver the unified feed first
2. Add explanation depth and publishability controls second
3. Add filters, saves, and daily digest third
4. Finish with validation, evaluation fixtures, and operator workflows

## Notes

- User Story 1 is the narrowest useful MVP and should be executed first.
- X is included in the MVP scope, but adapter implementation should be isolated so constraints on that source do not block the rest of the pipeline.
- WhatsApp is intentionally represented as digest formatting and delivery readiness rather than as the primary browsing experience.
