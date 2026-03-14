# Quickstart: AI Feed MVP

## Goal

Validate the MVP through a thin vertical slice that ingests source content, normalizes it, generates explanations, and presents it in a usable web feed.

## Scenario 1: View a unified feed

1. Run `npm run db:migrate`.
2. Set `RSS_FEED_URLS` to one or more comma-separated RSS or Atom feed URLs.
3. Optionally set `YOUTUBE_CHANNEL_IDS`, `YOUTUBE_FEED_URLS`, `REDDIT_SUBREDDITS`, and `X_BEARER_TOKEN` plus `X_SEARCH_QUERY` to enable the remaining source families.
4. Run `npm run ingest:refresh` to fetch, normalize, explain, and persist all enabled live sources.
5. Open the main feed page.
6. Confirm the feed shows persisted items with title, source attribution, publish time, and a link to the original content.
7. Apply source or topic query filters and confirm the feed narrows correctly.

## Scenario 1A: Trigger a scheduled refresh over HTTP

1. Set `REFRESH_JOB_TOKEN`.
2. Send a `POST` request to `/api/jobs/refresh` with `Authorization: Bearer <token>`.
3. Confirm the response includes per-source pipeline counts and a digest entry count.

## Scenario 1B: Keep local refresh running during development

1. Run `npm run ingest:refresh:watch`.
2. Confirm the command refreshes enabled sources every 5 minutes and upserts items without duplicating existing records.

## Scenario 2: Open an item and understand how to use it

1. Select a workflow or launch item from the feed.
2. Open the expanded view or detail page.
3. Confirm the page shows:
   - simple explanation
   - why it matters
   - example or use case
   - next-step guidance
   - credibility or caveat notes when relevant
4. Confirm the original source is reachable from the page.

## Scenario 3: Filter and save

1. Apply a source filter and confirm the feed narrows to matching items.
2. Apply a topic filter and confirm the result set updates.
3. Save an item for later.
4. Open the saved-items view and confirm the saved item appears with explanation and source link.
5. Restart the app server and confirm the saved item still appears.

## Scenario 4: Review daily digest

1. Generate the daily digest from the most important recent items.
2. Open the digest view.
3. Confirm the digest is short enough for a quick catch-up and links back to the underlying feed items.
4. Confirm the WhatsApp-ready digest preview is present and readable.

## Evaluation Notes

- Use live RSS/blog sources first, then enable YouTube, Reddit, and X through environment configuration as credentials and source lists become available.
- Track failed explanation generations separately from feed rendering failures.
- Treat missing source freshness as a degraded but valid state as long as available content still renders cleanly.
