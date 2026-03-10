# AI Feed Project Agents

## Purpose

This repository builds a personal AI-native feed that ingests AI updates from X, Reddit, YouTube, and RSS/blogs, then converts each item into practical, easy-to-understand explanations with examples and use cases.

## Working Model

- Use `spec-kit` style artifacts as the planning brain.
- Use `GSD` style execution artifacts as the delivery muscle.
- Keep source fidelity high: always preserve the original URL, author, source, and publish time.
- Prefer incremental delivery slices over broad speculative architecture.

## Product Principles

- Aggregate first, explain second, recommend third.
- Explanations must be simpler than the source, not longer than the source by default.
- Every summarized item should answer:
  - What happened?
  - Why does it matter?
  - Who should care?
  - How can someone use it?
- Distinguish facts, source claims, and model inferences.
- Collapse duplicates across platforms into one canonical story when possible.
- Rank for usefulness, not only virality.

## Source Rules

- `X`: prioritize workflows, builder threads, launch reactions, demos.
- `Reddit`: prioritize discussions, case studies, honest evaluations, niche tips.
- `YouTube`: prioritize tutorials, walkthroughs, launches, comparisons.
- `RSS/Blogs`: prioritize official announcements, research, release notes, deep dives.
- Store enough raw content to regenerate improved summaries later.

## Delivery Rules

- Web app is the primary product surface.
- WhatsApp is a secondary distribution channel for alerts and digests.
- Build the MVP around web feed, saved items, explanations, and daily digest.
- Defer complex source-specific edge cases unless they block the MVP.

## Engineering Rules

- Prefer typed interfaces at ingestion and normalization boundaries.
- Normalize all sources into a shared content schema before ranking or summarization.
- Keep summarization prompts structured and versioned.
- Record processing state for every item: `fetched`, `normalized`, `classified`, `summarized`, `published`, `failed`.
- Design for idempotent ingestion jobs.

## Repo Conventions

- Planning artifacts live in `specs/`.
- Execution artifacts live in `gsd/`.
- Reusable Codex skill instructions live in `skills/`.
- Keep docs concise and actionable.
