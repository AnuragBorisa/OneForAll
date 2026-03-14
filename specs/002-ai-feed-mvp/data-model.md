# Data Model: AI Feed MVP

## SourceItem

- **Purpose**: Stores raw content collected from an upstream platform before normalization.
- **Fields**:
  - `id`
  - `source`
  - `source_item_id`
  - `source_url`
  - `author_name`
  - `author_handle`
  - `published_at`
  - `fetched_at`
  - `title`
  - `raw_text`
  - `raw_payload`
  - `media_refs`
  - `engagement_signals`
  - `fetch_status`
- **Validation rules**:
  - `source`, `source_item_id`, `source_url`, and `fetched_at` are required.
  - `raw_payload` must be retained for successful fetches.
  - `source_item_id` must be unique within a source.

## FeedItem

- **Purpose**: Canonical normalized record used for ranking, clustering, and UI display.
- **Fields**:
  - `id`
  - `primary_source_item_id`
  - `canonical_url`
  - `title`
  - `summary_excerpt`
  - `normalized_text`
  - `content_type`
  - `topic_tags`
  - `published_at`
  - `source_attribution`
  - `processing_state`
  - `is_publishable`
- **Validation rules**:
  - Each `FeedItem` must map back to at least one `SourceItem`.
  - `content_type` must use an approved controlled set.
  - `processing_state` must move forward through the pipeline without skipping required states for publishable items.

## StoryCluster

- **Purpose**: Groups related feed items or source items about the same development.
- **Fields**:
  - `id`
  - `cluster_title`
  - `cluster_type`
  - `representative_feed_item_id`
  - `member_count`
  - `confidence_score`
  - `last_updated_at`
- **Validation rules**:
  - A cluster must have one representative item.
  - Clusters must be mergeable or splittable as better information arrives.

## ExplanationBlock

- **Purpose**: Structured generated explanation attached to a feed item.
- **Fields**:
  - `id`
  - `feed_item_id`
  - `simple_explanation`
  - `why_it_matters`
  - `example`
  - `use_cases`
  - `who_should_care`
  - `try_it_next`
  - `credibility_notes`
  - `generation_version`
  - `quality_status`
  - `generated_at`
- **Validation rules**:
  - Published explanations require `simple_explanation`, `why_it_matters`, and `try_it_next`.
  - `quality_status` must indicate whether the explanation is publishable or requires reprocessing.
  - `generation_version` is required for reprocessing traceability.

## DailyDigest

- **Purpose**: Captures a selected set of feed items for catch-up experiences and outbound delivery.
- **Fields**:
  - `id`
  - `digest_date`
  - `title`
  - `summary_intro`
  - `entry_count`
  - `delivery_status`
  - `generated_at`
- **Validation rules**:
  - One digest per user per digest date for MVP.
  - A digest must contain at least one `DigestEntry`.

## DigestEntry

- **Purpose**: Maps a feed item into a digest summary slot.
- **Fields**:
  - `id`
  - `daily_digest_id`
  - `feed_item_id`
  - `position`
  - `short_summary`
  - `reason_selected`
- **Validation rules**:
  - Entry positions must be unique within a digest.
  - Every entry must point to a valid `FeedItem`.

## SavedItem

- **Purpose**: Tracks items saved by a user for later review.
- **Fields**:
  - `id`
  - `user_id`
  - `feed_item_id`
  - `saved_at`
- **Validation rules**:
  - A user can save a given feed item only once.

## State Transitions

- **SourceItem.fetch_status**:
  - `pending` -> `fetched`
  - `pending` -> `failed`
  - `failed` -> `pending` for retry

- **FeedItem.processing_state**:
  - `normalized` -> `classified`
  - `classified` -> `clustered`
  - `clustered` -> `explained`
  - `explained` -> `published`
  - Any non-published state -> `failed`

- **ExplanationBlock.quality_status**:
  - `generated`
  - `publishable`
  - `needs_review`
  - `reprocess_required`
