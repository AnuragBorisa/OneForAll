# AI Feed Project Agents

## Purpose

This repository is for an AI-native feed that ingests AI updates from X, Reddit, YouTube, and RSS/blogs, then explains each item in simple, practical terms with examples and use cases.

## Required Workflow

- Use the real `spec-kit` scaffold in `.specify/` and `.codex/prompts/`.
- Use the real `GSD` install in `.claude/get-shit-done/` and `.claude/commands/gsd/`.
- Do not create parallel homegrown planning or execution frameworks.
- Keep project-specific guidance in this file and product-specific reusable instructions in `skills/`.

## Product Rules

- Aggregate first, explain second, recommend third.
- Distinguish source facts from model inferences.
- Preserve source attribution: platform, author, URL, and publish time.
- Collapse duplicate stories when possible.
- Rank by usefulness and relevance, not only virality.

## Source Priorities

- `X`: workflows, builder threads, launch reactions, tactical tips
- `Reddit`: discussion, experiments, feedback, niche discoveries
- `YouTube`: tutorials, walkthroughs, demos, comparisons
- `RSS/Blogs`: official announcements, research, release notes, deep dives

## Product Surface

- Primary product: web app
- Secondary distribution: WhatsApp digests and alerts

## Engineering Rules

- Normalize all source content into one canonical schema before ranking or summarization.
- Keep raw payloads so improved extraction and summaries can be regenerated.
- Make ingestion jobs idempotent.
- Version structured prompts and generated output schemas.

## Repo Conventions

- `spec-kit` artifacts live under `.specify/` and the generated `specs/` tree created by the upstream workflow.
- `GSD` artifacts live under `.claude/`.
- Project-local Codex skills live under `skills/`.

## Active Technologies
- TypeScript 5.x on Node.js 22 + Next.js 15, React 19, Drizzle ORM, Zod, OpenAI-compatible SDK, RSS parser and source-specific API clients (002-ai-feed-mvp)
- PostgreSQL for application data and processing state (002-ai-feed-mvp)

## Recent Changes
- 002-ai-feed-mvp: Added TypeScript 5.x on Node.js 22 + Next.js 15, React 19, Drizzle ORM, Zod, OpenAI-compatible SDK, RSS parser and source-specific API clients
