# Research: AI Feed MVP

## Decision 1: Use a web-first product with WhatsApp as a secondary digest channel

- **Decision**: Build the core experience as a web app and treat WhatsApp as a downstream digest delivery surface.
- **Rationale**: The product needs browsing, filtering, saved items, grouped stories, and detailed explanation cards. Those interactions fit a feed-oriented web app better than a chat-first interface.
- **Alternatives considered**:
  - WhatsApp-first product: rejected because it is strong for summaries and alerts but weak for discovery, filtering, and archive browsing.
  - Native mobile app first: rejected because it increases initial delivery scope without improving the core validation loop.

## Decision 2: Start with a single Next.js TypeScript application

- **Decision**: Implement the MVP as a single Next.js TypeScript application with server-side routes and background job entry points.
- **Rationale**: This keeps the first version simple, supports both UI and API surfaces, and avoids splitting the system into separate deployable services before the ingestion and explanation pipeline is proven.
- **Alternatives considered**:
  - Separate frontend and backend services: rejected as premature complexity for a single-user MVP.
  - Python-first backend plus separate frontend: rejected because the first release benefits more from product speed and integrated web delivery than from service separation.

## Decision 3: Use PostgreSQL as the primary persistence layer

- **Decision**: Store raw source items, normalized feed items, clusters, generated explanations, and user saves in PostgreSQL.
- **Rationale**: The data model is relational, requires durable processing state, and benefits from strong querying for feed ranking, saved views, and operator reprocessing.
- **Alternatives considered**:
  - Document database: rejected because canonical entities and processing state transitions are easier to reason about relationally.
  - Flat files or object-only storage: rejected because feed queries and reprocessing workflows need structured relational access.

## Decision 4: Keep ingestion adapters isolated by source, but force one canonical normalized model

- **Decision**: Build separate adapters for X, Reddit, YouTube, and RSS/blogs, with a shared normalization boundary.
- **Rationale**: Source formats differ substantially, but downstream ranking and explanation quality improve when every item follows one shared schema.
- **Alternatives considered**:
  - Source-specific feed handling all the way to UI: rejected because it would duplicate ranking, display, and explanation logic.
  - One generic fetcher for all sources: rejected because source extraction rules and metadata differ too much.

## Decision 5: Use structured explanation generation with required fields

- **Decision**: Require generated explanation blocks to include simple explanation, why it matters, example, use cases, next step, and credibility notes.
- **Rationale**: The product value depends on consistent useful outputs, and a required schema makes explanations easier to validate before publication.
- **Alternatives considered**:
  - Free-form summaries: rejected because they are harder to validate and often miss practical guidance.
  - Only headline summaries: rejected because they do not differentiate the product from generic news aggregation.

## Decision 6: Use heuristic-first deduplication and ranking for MVP

- **Decision**: Start with deterministic and explainable heuristics for duplicate detection, clustering, and ranking, with room to add learned scoring later.
- **Rationale**: The constitution favors thin vertical slices and source trust. Heuristic methods are easier to inspect and tune early.
- **Alternatives considered**:
  - Agentic cross-source reasoning loop from day one: rejected because it adds operational complexity before core ingestion quality is known.
  - Engagement-only ranking: rejected because the product is meant to optimize usefulness, not virality.
