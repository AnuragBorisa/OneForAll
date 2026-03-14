import {
  boolean,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex
} from "drizzle-orm/pg-core";

export const sourceFamilyEnum = pgEnum("source_family", ["x", "reddit", "youtube", "rss"]);
export const contentTypeEnum = pgEnum("content_type", [
  "news",
  "workflow",
  "tutorial",
  "launch",
  "discussion",
  "official_announcement"
]);
export const processingStateEnum = pgEnum("processing_state", [
  "normalized",
  "classified",
  "clustered",
  "explained",
  "published",
  "failed"
]);
export const fetchStatusEnum = pgEnum("fetch_status", ["pending", "fetched", "failed"]);
export const explanationQualityEnum = pgEnum("explanation_quality", [
  "generated",
  "publishable",
  "needs_review",
  "reprocess_required"
]);
export const digestDeliveryEnum = pgEnum("digest_delivery", [
  "pending",
  "generated",
  "delivered",
  "failed"
]);

export const sourceItems = pgTable(
  "source_items",
  {
    id: text("id").primaryKey(),
    source: sourceFamilyEnum("source").notNull(),
    sourceItemId: text("source_item_id").notNull(),
    sourceUrl: text("source_url").notNull(),
    authorName: text("author_name"),
    authorHandle: text("author_handle"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    fetchedAt: timestamp("fetched_at", { withTimezone: true }).notNull(),
    title: text("title"),
    rawText: text("raw_text"),
    rawPayload: jsonb("raw_payload").notNull(),
    mediaRefs: jsonb("media_refs").$type<string[]>().notNull().default([]),
    engagementSignals: jsonb("engagement_signals")
      .$type<Record<string, number | string | null>>()
      .notNull()
      .default({}),
    fetchStatus: fetchStatusEnum("fetch_status").notNull().default("pending")
  },
  (table) => ({
    sourceKey: uniqueIndex("source_items_source_item_unique").on(table.source, table.sourceItemId)
  })
);

export const feedItems = pgTable("feed_items", {
  id: text("id").primaryKey(),
  primarySourceItemId: text("primary_source_item_id")
    .notNull()
    .references(() => sourceItems.id),
  canonicalUrl: text("canonical_url").notNull(),
  title: text("title").notNull(),
  summaryExcerpt: text("summary_excerpt"),
  normalizedText: text("normalized_text").notNull(),
  contentType: contentTypeEnum("content_type").notNull(),
  topicTags: jsonb("topic_tags").$type<string[]>().notNull().default([]),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  sourceAttribution: jsonb("source_attribution")
    .$type<{
      source: string;
      authorName: string | null;
      authorHandle: string | null;
      sourceUrl: string;
      publishedAt: string | null;
    }>()
    .notNull(),
  processingState: processingStateEnum("processing_state").notNull().default("normalized"),
  isPublishable: boolean("is_publishable").notNull().default(false)
});

export const storyClusters = pgTable("story_clusters", {
  id: text("id").primaryKey(),
  clusterTitle: text("cluster_title").notNull(),
  clusterType: text("cluster_type").notNull(),
  representativeFeedItemId: text("representative_feed_item_id")
    .notNull()
    .references(() => feedItems.id),
  memberCount: integer("member_count").notNull().default(1),
  confidenceScore: numeric("confidence_score", { precision: 5, scale: 2 }).notNull(),
  lastUpdatedAt: timestamp("last_updated_at", { withTimezone: true }).notNull()
});

export const explanationBlocks = pgTable("explanation_blocks", {
  id: text("id").primaryKey(),
  feedItemId: text("feed_item_id")
    .notNull()
    .references(() => feedItems.id),
  simpleExplanation: text("simple_explanation").notNull(),
  whyItMatters: text("why_it_matters").notNull(),
  example: text("example"),
  useCases: jsonb("use_cases").$type<string[]>().notNull().default([]),
  whoShouldCare: jsonb("who_should_care").$type<string[]>().notNull().default([]),
  tryItNext: text("try_it_next").notNull(),
  credibilityNotes: text("credibility_notes"),
  generationVersion: text("generation_version").notNull(),
  qualityStatus: explanationQualityEnum("quality_status").notNull().default("generated"),
  generatedAt: timestamp("generated_at", { withTimezone: true }).notNull()
});

export const detailedExplanations = pgTable("detailed_explanations", {
  id: text("id").primaryKey(),
  feedItemId: text("feed_item_id")
    .notNull()
    .references(() => feedItems.id),
  whatHappened: text("what_happened").notNull(),
  keyPoints: jsonb("key_points").$type<string[]>().notNull().default([]),
  whyItMatters: text("why_it_matters").notNull(),
  practicalTakeaways: jsonb("practical_takeaways").$type<string[]>().notNull().default([]),
  risksAndUnknowns: jsonb("risks_and_unknowns").$type<string[]>().notNull().default([]),
  nextSteps: jsonb("next_steps").$type<string[]>().notNull().default([]),
  sourceLimits: text("source_limits"),
  generationVersion: text("generation_version").notNull(),
  qualityStatus: explanationQualityEnum("quality_status").notNull().default("generated"),
  generatedAt: timestamp("generated_at", { withTimezone: true }).notNull()
});

export const dailyDigests = pgTable("daily_digests", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  digestDate: timestamp("digest_date", { withTimezone: true }).notNull(),
  title: text("title").notNull(),
  summaryIntro: text("summary_intro"),
  entryCount: integer("entry_count").notNull().default(0),
  deliveryStatus: digestDeliveryEnum("delivery_status").notNull().default("pending"),
  generatedAt: timestamp("generated_at", { withTimezone: true }).notNull()
});

export const digestEntries = pgTable("digest_entries", {
  id: text("id").primaryKey(),
  dailyDigestId: text("daily_digest_id")
    .notNull()
    .references(() => dailyDigests.id),
  feedItemId: text("feed_item_id")
    .notNull()
    .references(() => feedItems.id),
  position: integer("position").notNull(),
  shortSummary: text("short_summary").notNull(),
  reasonSelected: text("reason_selected")
});

export const savedItems = pgTable(
  "saved_items",
  {
    userId: text("user_id").notNull(),
    feedItemId: text("feed_item_id")
      .notNull()
      .references(() => feedItems.id),
    savedAt: timestamp("saved_at", { withTimezone: true }).notNull()
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.feedItemId] })
  })
);

export const appSettings = pgTable("app_settings", {
  key: text("key").primaryKey(),
  value: text("value"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull()
});
