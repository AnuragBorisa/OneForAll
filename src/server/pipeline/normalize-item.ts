import type {
  ContentType,
  FeedItem,
  NormalizedSourceRecord,
  SourceAttribution,
  SourceItem
} from "@/types/feed";
import { inferTopicTags } from "@/server/pipeline/topic-taxonomy";

const CONTENT_TYPE_KEYWORDS: Record<ContentType, string[]> = {
  news: ["launch", "announced", "release", "shipping"],
  workflow: ["workflow", "stack", "automation", "agent"],
  tutorial: ["guide", "tutorial", "walkthrough", "how to"],
  launch: ["new", "launch", "available", "beta"],
  discussion: ["discussion", "thread", "thoughts", "debate"],
  official_announcement: ["official", "research", "release notes", "changelog"]
};

function detectContentType(rawText: string | null, title: string | null): ContentType {
  const haystack = `${title ?? ""} ${rawText ?? ""}`.toLowerCase();

  for (const [contentType, keywords] of Object.entries(CONTENT_TYPE_KEYWORDS) as Array<
    [ContentType, string[]]
  >) {
    if (keywords.some((keyword) => haystack.includes(keyword))) {
      return contentType;
    }
  }

  return "discussion";
}

function buildAttribution(sourceItem: SourceItem): SourceAttribution {
  return {
    source: sourceItem.source,
    authorName: sourceItem.authorName,
    authorHandle: sourceItem.authorHandle,
    sourceUrl: sourceItem.sourceUrl,
    publishedAt: sourceItem.publishedAt
  };
}

export async function normalizeSourceItem(sourceItem: SourceItem): Promise<NormalizedSourceRecord> {
  const normalizedText = (sourceItem.rawText ?? sourceItem.title ?? "").trim();
  const contentType = detectContentType(sourceItem.rawText, sourceItem.title);

  const feedItem: FeedItem = {
    id: `${sourceItem.source}-${sourceItem.sourceItemId}`,
    primarySourceItemId: sourceItem.id,
    canonicalUrl: sourceItem.sourceUrl,
    title: sourceItem.title ?? "Untitled source item",
    summaryExcerpt: normalizedText.slice(0, 240) || null,
    normalizedText,
    contentType,
    topicTags: inferTopicTags({
      feedItem: {
        id: `${sourceItem.source}-${sourceItem.sourceItemId}`,
        primarySourceItemId: sourceItem.id,
        canonicalUrl: sourceItem.sourceUrl,
        title: sourceItem.title ?? "Untitled source item",
        summaryExcerpt: normalizedText.slice(0, 240) || null,
        normalizedText,
        contentType,
        topicTags: [],
        publishedAt: sourceItem.publishedAt,
        sourceAttribution: buildAttribution(sourceItem),
        processingState: "normalized",
        isPublishable: false
      },
      sourceItem
    }),
    publishedAt: sourceItem.publishedAt,
    sourceAttribution: buildAttribution(sourceItem),
    processingState: "normalized",
    isPublishable: false
  };

  return {
    sourceItem,
    feedItem
  };
}
