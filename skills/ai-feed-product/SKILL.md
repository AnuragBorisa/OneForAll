---
name: ai-feed-product
description: Use this skill when working on the AI feed product that aggregates AI updates from X, Reddit, YouTube, and RSS/blogs, explains them simply, ranks them by usefulness, and distributes them through a web app and digest channels.
---

# AI Feed Product Skill

Use this skill for product, architecture, and implementation work on the AI feed application.

## Core Objective

Build a system that turns noisy AI content streams into a useful, personalized feed with practical explanations.

## Required Source Model

Treat each source differently:

- `X`: workflows, builder threads, launch reactions, tactical tips
- `Reddit`: discussions, experiments, niche findings, sentiment
- `YouTube`: tutorials, walkthroughs, launches, demos
- `RSS/Blogs`: official announcements, research, release notes, explainers

Normalize all content into one shared schema before downstream processing.

## Canonical Item Shape

Every normalized item should aim to include:

- `source`
- `source_item_id`
- `url`
- `author`
- `published_at`
- `title`
- `raw_text`
- `engagement_signals`
- `media_refs`
- `topic_tags`
- `content_type`

## AI Output Shape

Every explanation card should aim to include:

- `simple_explanation`
- `why_it_matters`
- `example`
- `use_cases`
- `who_should_care`
- `try_it_next`
- `credibility_notes`

## Product Priorities

1. Reliable ingestion
2. Clean normalization
3. Useful deduplication and clustering
4. Practical summaries
5. Feed ranking and filtering
6. Digest delivery

## Product Boundaries

- Do not treat engagement as the main quality signal.
- Do not present generated advice as source-grounded fact.
- Do not rely on a single platform for major story detection.
- Do not overbuild agentic automation before the ingestion pipeline is trustworthy.

## References

- For the product vision and MVP scope, read `references/product.md`.
- For ingestion and pipeline guidance, read `references/architecture.md`.
- For ranking and summarization expectations, read `references/output.md`.
