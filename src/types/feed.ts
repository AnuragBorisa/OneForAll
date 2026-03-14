export const SOURCE_FAMILIES = ["x", "reddit", "youtube", "rss"] as const;
export type SourceFamily = (typeof SOURCE_FAMILIES)[number];

export const CONTENT_TYPES = [
  "news",
  "workflow",
  "tutorial",
  "launch",
  "discussion",
  "official_announcement"
] as const;
export type ContentType = (typeof CONTENT_TYPES)[number];

export const PROCESSING_STATES = [
  "normalized",
  "classified",
  "clustered",
  "explained",
  "published",
  "failed"
] as const;
export type ProcessingState = (typeof PROCESSING_STATES)[number];

export const FETCH_STATUSES = ["pending", "fetched", "failed"] as const;
export type FetchStatus = (typeof FETCH_STATUSES)[number];

export const EXPLANATION_QUALITY_STATES = [
  "generated",
  "publishable",
  "needs_review",
  "reprocess_required"
] as const;
export type ExplanationQualityState = (typeof EXPLANATION_QUALITY_STATES)[number];

export interface SourceAttribution {
  source: SourceFamily;
  authorName: string | null;
  authorHandle: string | null;
  sourceUrl: string;
  publishedAt: string | null;
}

export interface SourceItem {
  id: string;
  source: SourceFamily;
  sourceItemId: string;
  sourceUrl: string;
  authorName: string | null;
  authorHandle: string | null;
  publishedAt: string | null;
  fetchedAt: string;
  title: string | null;
  rawText: string | null;
  rawPayload: unknown;
  mediaRefs: string[];
  engagementSignals: Record<string, number | string | null>;
  fetchStatus: FetchStatus;
}

export interface FeedItem {
  id: string;
  primarySourceItemId: string;
  canonicalUrl: string;
  title: string;
  summaryExcerpt: string | null;
  normalizedText: string;
  contentType: ContentType;
  topicTags: string[];
  publishedAt: string | null;
  sourceAttribution: SourceAttribution;
  processingState: ProcessingState;
  isPublishable: boolean;
}

export interface StoryCluster {
  id: string;
  clusterTitle: string;
  clusterType: string;
  representativeFeedItemId: string;
  memberCount: number;
  confidenceScore: number;
  lastUpdatedAt: string;
}

export interface ExplanationBlock {
  id: string;
  feedItemId: string;
  simpleExplanation: string;
  whyItMatters: string;
  example: string | null;
  useCases: string[];
  whoShouldCare: string[];
  tryItNext: string;
  credibilityNotes: string | null;
  generationVersion: string;
  qualityStatus: ExplanationQualityState;
  generatedAt: string;
}

export interface DetailedExplanation {
  id: string;
  feedItemId: string;
  whatHappened: string;
  keyPoints: string[];
  whyItMatters: string;
  practicalTakeaways: string[];
  risksAndUnknowns: string[];
  nextSteps: string[];
  sourceLimits: string | null;
  generationVersion: string;
  qualityStatus: ExplanationQualityState;
  generatedAt: string;
}

export interface DailyDigest {
  id: string;
  digestDate: string;
  title: string;
  summaryIntro: string | null;
  entryCount: number;
  deliveryStatus: "pending" | "generated" | "delivered" | "failed";
  generatedAt: string;
}

export interface DigestEntry {
  id: string;
  dailyDigestId: string;
  feedItemId: string;
  position: number;
  shortSummary: string;
  reasonSelected: string | null;
}

export interface SavedItem {
  id: string;
  userId: string;
  feedItemId: string;
  savedAt: string;
}

export interface NormalizedSourceRecord {
  sourceItem: SourceItem;
  feedItem: FeedItem;
}
