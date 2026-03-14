# AI Feed Constitution

## Core Principles

### I. Practical Signal Over Content Volume
Every feature must improve the user's ability to understand or apply AI developments. The product exists to reduce noise, not to maximize feed length or source count.

### II. Source Transparency Is Mandatory
Every surfaced item must preserve source platform, author, URL, and timing. Generated explanations must clearly separate source-grounded statements from model-generated interpretation.

### III. Normalize Before Intelligence
All ingestion paths must convert source-specific payloads into a canonical content model before classification, ranking, deduplication, or summarization. Downstream logic must not depend on raw platform formats.

### IV. Explain for Action
Each published item must strive to answer: what happened, why it matters, who should care, and how it can be used. Explanations should prefer plain language, one concrete example, and explicit caveats when confidence is limited.

### V. Thin Vertical Slices
Implementation must proceed in small end-to-end slices that run on real content. Reliability of ingestion and normalization takes priority over speculative autonomy or complex recommendation systems.

## Product Constraints

- Primary product surface is a web app.
- WhatsApp is a secondary delivery channel for digests and alerts.
- Required initial sources are X, Reddit, YouTube, and RSS/blogs.
- The system should support reprocessing of stored raw content as prompts, heuristics, and models improve.

## Development Workflow

- Planning follows the actual `spec-kit` workflow from `.codex/prompts/` and `.specify/`.
- Execution follows the actual `GSD` workflow installed under `.claude/`.
- Project-specific operating guidance lives in `AGENTS.md`.
- Reusable product-specific Codex instructions live in `skills/`.

## Governance

This constitution governs product and implementation decisions in this repository. Changes must preserve source transparency, canonical normalization, and action-oriented explanations. Simpler designs should be preferred unless added complexity has a clear product payoff.

**Version**: 1.0.0 | **Ratified**: 2026-03-10 | **Last Amended**: 2026-03-10
