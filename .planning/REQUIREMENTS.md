# Requirements: AI Feed

**Defined:** 2026-03-10
**Core Value:** One place to understand the most useful AI updates quickly enough to act on them the same day.

## v1 Requirements

### Feed Aggregation

- [ ] **FEED-01**: User can view AI updates from X, Reddit, YouTube, and RSS/blogs in one unified feed
- [ ] **FEED-02**: Every feed item shows source platform, original link, publish time, and author or channel when available
- [ ] **FEED-03**: Duplicate or overlapping stories are grouped or reduced before cluttering the feed
- [ ] **FEED-04**: User can open the original source from any feed item

### Explanations

- [ ] **EXPL-01**: Published feed items include a simple explanation of what happened
- [ ] **EXPL-02**: Published feed items explain why the update matters
- [ ] **EXPL-03**: Published feed items include at least one example, use case, or practical application when supported
- [ ] **EXPL-04**: Published feed items include a suggested next step
- [ ] **EXPL-05**: The product distinguishes source facts from inferred guidance and shows caveats where confidence is limited

### Personal Workflow

- [ ] **FLOW-01**: User can filter the feed by source
- [ ] **FLOW-02**: User can filter the feed by topic or content category
- [ ] **FLOW-03**: User can save an item for later review
- [ ] **FLOW-04**: User can open a saved-items view with the saved explanations and source links
- [ ] **FLOW-05**: User can review a daily digest of the most important recent items

### Operations

- [ ] **OPS-01**: The system continues to show available content when a source integration is temporarily unavailable
- [ ] **OPS-02**: The system stores enough source data to regenerate explanations later
- [ ] **OPS-03**: Operators can reprocess previously collected items after prompt or ranking updates

## v2 Requirements

### Distribution

- **DIST-01**: User receives a WhatsApp digest directly from the system
- **DIST-02**: User can configure digest timing and delivery preferences

### Personalization

- **PERS-01**: Feed ranking learns from long-term reading and save behavior
- **PERS-02**: User can define topic priorities and suppression rules

## Out of Scope

| Feature | Reason |
|---------|--------|
| Public posting and creator tools | Not required to validate the feed and explanation loop |
| Community comments | Adds moderation and community complexity too early |
| Native iOS or Android app | Web-first delivery is sufficient for MVP |
| Real-time alert engine for every source event | Too noisy for the initial product value test |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| FEED-01 | Phase 2 | Pending |
| FEED-02 | Phase 2 | Pending |
| FEED-03 | Phase 2 | Pending |
| FEED-04 | Phase 2 | Pending |
| EXPL-01 | Phase 3 | Pending |
| EXPL-02 | Phase 3 | Pending |
| EXPL-03 | Phase 3 | Pending |
| EXPL-04 | Phase 3 | Pending |
| EXPL-05 | Phase 3 | Pending |
| FLOW-01 | Phase 4 | Pending |
| FLOW-02 | Phase 4 | Pending |
| FLOW-03 | Phase 4 | Pending |
| FLOW-04 | Phase 4 | Pending |
| FLOW-05 | Phase 4 | Pending |
| OPS-01 | Phase 1 | Pending |
| OPS-02 | Phase 1 | Pending |
| OPS-03 | Phase 5 | Pending |

**Coverage:**
- v1 requirements: 17 total
- Mapped to phases: 17
- Unmapped: 0

---
*Requirements defined: 2026-03-10*
*Last updated: 2026-03-10 after creating roadmap from spec-kit feature 002-ai-feed-mvp*
