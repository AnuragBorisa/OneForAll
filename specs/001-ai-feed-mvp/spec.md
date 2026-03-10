# Spec: AI Feed MVP

## Problem

AI updates are fragmented across X, Reddit, YouTube, and blogs. Users miss important developments or spend too much time collecting and interpreting them. Raw posts are often hard to evaluate and harder to apply.

## Goal

Create a product that gathers important AI content into one personalized feed and adds AI-powered explanations that make each item understandable and actionable.

## Primary User

A user who wants to stay updated on AI every day without manually checking multiple sources, and wants practical takeaways instead of raw links.

## User Stories

- As a user, I want one feed for AI updates from multiple platforms so I stop hunting for information manually.
- As a user, I want simple explanations for each item so I understand it quickly.
- As a user, I want examples and use cases so I can see how a workflow or tool applies in practice.
- As a user, I want filters by topic and source so I can focus on what matters to me.
- As a user, I want a daily digest so I can catch up even when I miss the feed.

## Inputs

- X posts and threads
- Reddit posts and comments where relevant
- YouTube video metadata and transcripts
- RSS/blog articles

## Outputs

- Unified feed cards
- Item detail pages
- Daily digest summaries
- Topic collections

## Explanation Contract

Each feed item should provide:

- simplest explanation
- why it matters
- one example
- practical use cases
- who should care
- suggested next step

## MVP Scope

- Source ingestion for RSS/blogs, YouTube, Reddit, X
- Canonical content model
- Deduplication and basic clustering
- AI-generated explanations
- Web feed UI with filters
- Save/bookmark
- Daily digest generation

## MVP Non-Goals

- User-generated posting
- Comments and social graph
- Full mobile app
- Advanced real-time alerting
- Enterprise team features

## Open Risks

- X API and ingestion constraints
- YouTube transcript quality variance
- Duplicate detection across different content shapes
- Hallucinated or overly confident summaries
