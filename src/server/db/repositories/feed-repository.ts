import { and, desc, eq, sql } from "drizzle-orm";
import { getEnv } from "@/lib/env";
import { getDb } from "@/server/db/client";
import {
  detailedExplanations,
  explanationBlocks,
  dailyDigests,
  digestEntries,
  feedItems,
  savedItems,
  sourceItems
} from "@/server/db/schema/feed";
import type {
  DailyDigest,
  DetailedExplanation,
  DigestEntry,
  ExplanationBlock,
  FeedItem,
  NormalizedSourceRecord,
  SourceItem
} from "@/types/feed";

export interface FeedRepositoryFilters {
  source?: string | null;
  limit?: number;
}

export interface PersistedFeedRecord extends NormalizedSourceRecord {
  explanation: ExplanationBlock | null;
  detailedExplanation: DetailedExplanation | null;
}

export interface PersistedDailyDigest {
  digest: DailyDigest;
  entries: DigestEntry[];
}

function toIsoString(value: Date | string | null | undefined): string | null {
  if (!value) {
    return null;
  }

  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function mapSourceItem(row: typeof sourceItems.$inferSelect): SourceItem {
  return {
    id: row.id,
    source: row.source,
    sourceItemId: row.sourceItemId,
    sourceUrl: row.sourceUrl,
    authorName: row.authorName,
    authorHandle: row.authorHandle,
    publishedAt: toIsoString(row.publishedAt),
    fetchedAt: toIsoString(row.fetchedAt) ?? new Date().toISOString(),
    title: row.title,
    rawText: row.rawText,
    rawPayload: row.rawPayload,
    mediaRefs: row.mediaRefs,
    engagementSignals: row.engagementSignals,
    fetchStatus: row.fetchStatus
  };
}

function mapFeedItem(row: typeof feedItems.$inferSelect): FeedItem {
  return {
    id: row.id,
    primarySourceItemId: row.primarySourceItemId,
    canonicalUrl: row.canonicalUrl,
    title: row.title,
    summaryExcerpt: row.summaryExcerpt,
    normalizedText: row.normalizedText,
    contentType: row.contentType,
    topicTags: row.topicTags,
    publishedAt: toIsoString(row.publishedAt),
    sourceAttribution: {
      source: row.sourceAttribution.source as FeedItem["sourceAttribution"]["source"],
      authorName: row.sourceAttribution.authorName,
      authorHandle: row.sourceAttribution.authorHandle,
      sourceUrl: row.sourceAttribution.sourceUrl,
      publishedAt: row.sourceAttribution.publishedAt
    },
    processingState: row.processingState,
    isPublishable: row.isPublishable
  };
}

function mapExplanationBlock(
  row: typeof explanationBlocks.$inferSelect | null
): ExplanationBlock | null {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    feedItemId: row.feedItemId,
    simpleExplanation: row.simpleExplanation,
    whyItMatters: row.whyItMatters,
    example: row.example,
    useCases: row.useCases,
    whoShouldCare: row.whoShouldCare,
    tryItNext: row.tryItNext,
    credibilityNotes: row.credibilityNotes,
    generationVersion: row.generationVersion,
    qualityStatus: row.qualityStatus,
    generatedAt: toIsoString(row.generatedAt) ?? new Date().toISOString()
  };
}

function mapDetailedExplanation(
  row: typeof detailedExplanations.$inferSelect | null
): DetailedExplanation | null {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    feedItemId: row.feedItemId,
    whatHappened: row.whatHappened,
    keyPoints: row.keyPoints,
    whyItMatters: row.whyItMatters,
    practicalTakeaways: row.practicalTakeaways,
    risksAndUnknowns: row.risksAndUnknowns,
    nextSteps: row.nextSteps,
    sourceLimits: row.sourceLimits,
    generationVersion: row.generationVersion,
    qualityStatus: row.qualityStatus,
    generatedAt: toIsoString(row.generatedAt) ?? new Date().toISOString()
  };
}

function mapDailyDigest(row: typeof dailyDigests.$inferSelect): DailyDigest {
  return {
    id: row.id,
    digestDate: toIsoString(row.digestDate) ?? new Date().toISOString(),
    title: row.title,
    summaryIntro: row.summaryIntro,
    entryCount: row.entryCount,
    deliveryStatus: row.deliveryStatus,
    generatedAt: toIsoString(row.generatedAt) ?? new Date().toISOString()
  };
}

function mapDigestEntry(row: typeof digestEntries.$inferSelect): DigestEntry {
  return {
    id: row.id,
    dailyDigestId: row.dailyDigestId,
    feedItemId: row.feedItemId,
    position: row.position,
    shortSummary: row.shortSummary,
    reasonSelected: row.reasonSelected
  };
}

function buildBaseConditions(filters: FeedRepositoryFilters) {
  const conditions = [];

  if (filters.source) {
    conditions.push(sql`${feedItems.sourceAttribution} ->> 'source' = ${filters.source}`);
  }

  return conditions.length > 0 ? and(...conditions) : undefined;
}

export async function listNormalizedFeedItems(
  filters: FeedRepositoryFilters = {}
): Promise<NormalizedSourceRecord[]> {
  const records = await listPersistedFeedItems(filters);
  return records.map(({ sourceItem, feedItem }) => ({ sourceItem, feedItem }));
}

export async function listPersistedFeedItems(
  filters: FeedRepositoryFilters = {}
): Promise<PersistedFeedRecord[]> {
  const db = getDb();
  const rows = await db
    .select({
      sourceItem: sourceItems,
      feedItem: feedItems,
      explanation: explanationBlocks,
      detailedExplanation: detailedExplanations
    })
    .from(feedItems)
    .innerJoin(sourceItems, eq(feedItems.primarySourceItemId, sourceItems.id))
    .leftJoin(explanationBlocks, eq(explanationBlocks.feedItemId, feedItems.id))
    .leftJoin(detailedExplanations, eq(detailedExplanations.feedItemId, feedItems.id))
    .where(buildBaseConditions(filters))
    .orderBy(desc(feedItems.publishedAt), desc(sourceItems.fetchedAt))
    .limit(filters.limit ?? 100);

  return rows.map((row) => ({
    sourceItem: mapSourceItem(row.sourceItem),
    feedItem: mapFeedItem(row.feedItem),
    explanation: mapExplanationBlock(row.explanation),
    detailedExplanation: mapDetailedExplanation(row.detailedExplanation)
  }));
}

export async function getFeedItemById(id: string): Promise<PersistedFeedRecord | null> {
  const db = getDb();
  const rows = await db
    .select({
      sourceItem: sourceItems,
      feedItem: feedItems,
      explanation: explanationBlocks,
      detailedExplanation: detailedExplanations
    })
    .from(feedItems)
    .innerJoin(sourceItems, eq(feedItems.primarySourceItemId, sourceItems.id))
    .leftJoin(explanationBlocks, eq(explanationBlocks.feedItemId, feedItems.id))
    .leftJoin(detailedExplanations, eq(detailedExplanations.feedItemId, feedItems.id))
    .where(eq(feedItems.id, id))
    .limit(1);

  const row = rows[0];

  if (!row) {
    return null;
  }

  return {
    sourceItem: mapSourceItem(row.sourceItem),
    feedItem: mapFeedItem(row.feedItem),
    explanation: mapExplanationBlock(row.explanation),
    detailedExplanation: mapDetailedExplanation(row.detailedExplanation)
  };
}

export async function upsertNormalizedRecord({
  sourceItem,
  feedItem,
  explanation
}: Pick<PersistedFeedRecord, "sourceItem" | "feedItem" | "explanation">) {
  const db = getDb();

  await db
    .insert(sourceItems)
    .values({
      id: sourceItem.id,
      source: sourceItem.source,
      sourceItemId: sourceItem.sourceItemId,
      sourceUrl: sourceItem.sourceUrl,
      authorName: sourceItem.authorName,
      authorHandle: sourceItem.authorHandle,
      publishedAt: sourceItem.publishedAt ? new Date(sourceItem.publishedAt) : null,
      fetchedAt: new Date(sourceItem.fetchedAt),
      title: sourceItem.title,
      rawText: sourceItem.rawText,
      rawPayload: sourceItem.rawPayload,
      mediaRefs: sourceItem.mediaRefs,
      engagementSignals: sourceItem.engagementSignals,
      fetchStatus: sourceItem.fetchStatus
    })
    .onConflictDoUpdate({
      target: [sourceItems.source, sourceItems.sourceItemId],
      set: {
        sourceUrl: sourceItem.sourceUrl,
        authorName: sourceItem.authorName,
        authorHandle: sourceItem.authorHandle,
        publishedAt: sourceItem.publishedAt ? new Date(sourceItem.publishedAt) : null,
        fetchedAt: new Date(sourceItem.fetchedAt),
        title: sourceItem.title,
        rawText: sourceItem.rawText,
        rawPayload: sourceItem.rawPayload,
        mediaRefs: sourceItem.mediaRefs,
        engagementSignals: sourceItem.engagementSignals,
        fetchStatus: sourceItem.fetchStatus
      }
    });

  await db
    .insert(feedItems)
    .values({
      id: feedItem.id,
      primarySourceItemId: feedItem.primarySourceItemId,
      canonicalUrl: feedItem.canonicalUrl,
      title: feedItem.title,
      summaryExcerpt: feedItem.summaryExcerpt,
      normalizedText: feedItem.normalizedText,
      contentType: feedItem.contentType,
      topicTags: feedItem.topicTags,
      publishedAt: feedItem.publishedAt ? new Date(feedItem.publishedAt) : null,
      sourceAttribution: feedItem.sourceAttribution,
      processingState: feedItem.processingState,
      isPublishable: feedItem.isPublishable
    })
    .onConflictDoUpdate({
      target: feedItems.id,
      set: {
        primarySourceItemId: feedItem.primarySourceItemId,
        canonicalUrl: feedItem.canonicalUrl,
        title: feedItem.title,
        summaryExcerpt: feedItem.summaryExcerpt,
        normalizedText: feedItem.normalizedText,
        contentType: feedItem.contentType,
        topicTags: feedItem.topicTags,
        publishedAt: feedItem.publishedAt ? new Date(feedItem.publishedAt) : null,
        sourceAttribution: feedItem.sourceAttribution,
        processingState: feedItem.processingState,
        isPublishable: feedItem.isPublishable
      }
    });

  if (!explanation) {
    return;
  }

  await db
    .insert(explanationBlocks)
    .values({
      id: explanation.id,
      feedItemId: explanation.feedItemId,
      simpleExplanation: explanation.simpleExplanation,
      whyItMatters: explanation.whyItMatters,
      example: explanation.example,
      useCases: explanation.useCases,
      whoShouldCare: explanation.whoShouldCare,
      tryItNext: explanation.tryItNext,
      credibilityNotes: explanation.credibilityNotes,
      generationVersion: explanation.generationVersion,
      qualityStatus: explanation.qualityStatus,
      generatedAt: new Date(explanation.generatedAt)
    })
    .onConflictDoUpdate({
      target: explanationBlocks.id,
      set: {
        simpleExplanation: explanation.simpleExplanation,
        whyItMatters: explanation.whyItMatters,
        example: explanation.example,
        useCases: explanation.useCases,
        whoShouldCare: explanation.whoShouldCare,
        tryItNext: explanation.tryItNext,
        credibilityNotes: explanation.credibilityNotes,
        generationVersion: explanation.generationVersion,
        qualityStatus: explanation.qualityStatus,
        generatedAt: new Date(explanation.generatedAt)
      }
    });
}

export async function upsertDetailedExplanation(explanation: DetailedExplanation) {
  const db = getDb();

  await db
    .insert(detailedExplanations)
    .values({
      id: explanation.id,
      feedItemId: explanation.feedItemId,
      whatHappened: explanation.whatHappened,
      keyPoints: explanation.keyPoints,
      whyItMatters: explanation.whyItMatters,
      practicalTakeaways: explanation.practicalTakeaways,
      risksAndUnknowns: explanation.risksAndUnknowns,
      nextSteps: explanation.nextSteps,
      sourceLimits: explanation.sourceLimits,
      generationVersion: explanation.generationVersion,
      qualityStatus: explanation.qualityStatus,
      generatedAt: new Date(explanation.generatedAt)
    })
    .onConflictDoUpdate({
      target: detailedExplanations.id,
      set: {
        whatHappened: explanation.whatHappened,
        keyPoints: explanation.keyPoints,
        whyItMatters: explanation.whyItMatters,
        practicalTakeaways: explanation.practicalTakeaways,
        risksAndUnknowns: explanation.risksAndUnknowns,
        nextSteps: explanation.nextSteps,
        sourceLimits: explanation.sourceLimits,
        generationVersion: explanation.generationVersion,
        qualityStatus: explanation.qualityStatus,
        generatedAt: new Date(explanation.generatedAt)
      }
    });
}

export async function saveFeedItem(itemId: string, userId = getEnv().DEFAULT_USER_ID) {
  const db = getDb();
  const item = await db.select({ id: feedItems.id }).from(feedItems).where(eq(feedItems.id, itemId)).limit(1);

  if (!item[0]) {
    return { saved: false, reason: "not_found" as const };
  }

  await db
    .insert(savedItems)
    .values({
      userId,
      feedItemId: itemId,
      savedAt: new Date()
    })
    .onConflictDoNothing();

  return { saved: true as const };
}

export async function listSavedFeedItems(userId = getEnv().DEFAULT_USER_ID): Promise<PersistedFeedRecord[]> {
  const db = getDb();
  const rows = await db
    .select({
      savedItem: savedItems,
      sourceItem: sourceItems,
      feedItem: feedItems,
      explanation: explanationBlocks,
      detailedExplanation: detailedExplanations
    })
    .from(savedItems)
    .innerJoin(feedItems, eq(savedItems.feedItemId, feedItems.id))
    .innerJoin(sourceItems, eq(feedItems.primarySourceItemId, sourceItems.id))
    .leftJoin(explanationBlocks, eq(explanationBlocks.feedItemId, feedItems.id))
    .leftJoin(detailedExplanations, eq(detailedExplanations.feedItemId, feedItems.id))
    .where(eq(savedItems.userId, userId))
    .orderBy(desc(savedItems.savedAt));

  return rows.map((row) => ({
    sourceItem: mapSourceItem(row.sourceItem),
    feedItem: mapFeedItem(row.feedItem),
    explanation: mapExplanationBlock(row.explanation),
    detailedExplanation: mapDetailedExplanation(row.detailedExplanation)
  }));
}

export async function upsertDailyDigest(params: {
  digestDate: Date;
  title: string;
  summaryIntro: string;
  entries: Array<{
    feedItemId: string;
    shortSummary: string;
    reasonSelected: string | null;
  }>;
  userId?: string;
}): Promise<PersistedDailyDigest> {
  const db = getDb();
  const userId = params.userId ?? getEnv().DEFAULT_USER_ID;
  const digestId = `digest-${userId}-${params.digestDate.toISOString().slice(0, 10)}`;

  await db
    .insert(dailyDigests)
    .values({
      id: digestId,
      userId,
      digestDate: params.digestDate,
      title: params.title,
      summaryIntro: params.summaryIntro,
      entryCount: params.entries.length,
      deliveryStatus: "generated",
      generatedAt: new Date()
    })
    .onConflictDoUpdate({
      target: dailyDigests.id,
      set: {
        title: params.title,
        summaryIntro: params.summaryIntro,
        entryCount: params.entries.length,
        deliveryStatus: "generated",
        generatedAt: new Date()
      }
    });

  await db.delete(digestEntries).where(eq(digestEntries.dailyDigestId, digestId));

  if (params.entries.length > 0) {
    await db.insert(digestEntries).values(
      params.entries.map((entry, index) => ({
        id: `${digestId}-entry-${index + 1}`,
        dailyDigestId: digestId,
        feedItemId: entry.feedItemId,
        position: index + 1,
        shortSummary: entry.shortSummary,
        reasonSelected: entry.reasonSelected
      }))
    );
  }

  return {
    digest: {
      id: digestId,
      digestDate: params.digestDate.toISOString(),
      title: params.title,
      summaryIntro: params.summaryIntro,
      entryCount: params.entries.length,
      deliveryStatus: "generated",
      generatedAt: new Date().toISOString()
    },
    entries: params.entries.map((entry, index) => ({
      id: `${digestId}-entry-${index + 1}`,
      dailyDigestId: digestId,
      feedItemId: entry.feedItemId,
      position: index + 1,
      shortSummary: entry.shortSummary,
      reasonSelected: entry.reasonSelected
    }))
  };
}

export async function getPersistedDailyDigestForDate(
  digestDate: Date,
  userId = getEnv().DEFAULT_USER_ID
): Promise<PersistedDailyDigest | null> {
  const db = getDb();
  const digestId = `digest-${userId}-${digestDate.toISOString().slice(0, 10)}`;

  const digestRows = await db.select().from(dailyDigests).where(eq(dailyDigests.id, digestId)).limit(1);
  const digestRow = digestRows[0];

  if (!digestRow) {
    return null;
  }

  const entryRows = await db
    .select()
    .from(digestEntries)
    .where(eq(digestEntries.dailyDigestId, digestId))
    .orderBy(digestEntries.position);

  return {
    digest: mapDailyDigest(digestRow),
    entries: entryRows.map(mapDigestEntry)
  };
}
