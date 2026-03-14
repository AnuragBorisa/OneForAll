import { listPersistedFeedItems, type FeedRepositoryFilters } from "@/server/db/repositories/feed-repository";
import { getActivePreset } from "@/server/settings/settings";
import { clusterStories } from "@/server/ranking/cluster-stories";
import { inferTopicTags, isRelevantToPreset } from "@/server/pipeline/topic-taxonomy";

export interface FeedListItem {
  id: string;
  title: string;
  source: string;
  author: string | null;
  sourceUrl: string;
  publishedAt: string | null;
  contentType: string;
  topicTags: string[];
  explanationPreview: string | null;
  relatedCount: number;
}

export async function getFeed(
  filters: FeedRepositoryFilters & { topic?: string | null } = {}
): Promise<FeedListItem[]> {
  const preset = await getActivePreset();
  const items = await listPersistedFeedItems({
    ...filters,
    limit: Math.max(filters.limit ?? 100, 250)
  });
  const scopedItems = items.filter((record) =>
    isRelevantToPreset(preset.id, {
      feedItem: record.feedItem,
      sourceItem: record.sourceItem,
      existingTags: record.feedItem.topicTags
    })
  );
  const clustered = clusterStories(scopedItems);

  return clustered
    .map((cluster) => {
      const primary = cluster.items[0];
      const topicTags = inferTopicTags({
        feedItem: primary.feedItem,
        sourceItem: primary.sourceItem,
        existingTags: primary.feedItem.topicTags
      });

      return {
        id: primary.feedItem.id,
        title: primary.feedItem.title,
        source: primary.feedItem.sourceAttribution.source,
        author: primary.feedItem.sourceAttribution.authorName,
        sourceUrl: primary.feedItem.sourceAttribution.sourceUrl,
        publishedAt: primary.feedItem.publishedAt,
        contentType: primary.feedItem.contentType,
        topicTags,
        explanationPreview: primary.explanation?.simpleExplanation ?? primary.feedItem.summaryExcerpt,
        relatedCount: Math.max(cluster.items.length - 1, 0)
      };
    })
    .filter(
      (item) =>
        !filters.topic || item.contentType === filters.topic || item.topicTags.includes(filters.topic)
    );
}
