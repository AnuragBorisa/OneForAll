import type { FeedItem, SourceFamily, SourceItem } from "@/types/feed";

export interface SourceFetchResult {
  sourceItems: SourceItem[];
  nextCursor?: string | null;
}

export interface SourceAdapterFetchInput {
  since?: Date;
  cursor?: string | null;
  limit?: number;
}

export interface SourceAdapter {
  source: SourceFamily;
  fetchLatest(input: SourceAdapterFetchInput): Promise<SourceFetchResult>;
}

export interface NormalizationContext {
  fetchedAt: Date;
}

export interface NormalizedFeedResult {
  sourceItem: SourceItem;
  feedItem: FeedItem;
}

export interface SourceNormalizer {
  normalize(sourceItem: SourceItem, context: NormalizationContext): Promise<FeedItem>;
}
