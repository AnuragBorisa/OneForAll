import type { PersistedFeedRecord } from "@/server/db/repositories/feed-repository";

export interface StoryClusterResult {
  clusterId: string;
  clusterTitle: string;
  items: PersistedFeedRecord[];
}

function storyKey(input: PersistedFeedRecord): string {
  const title = input.feedItem.title.toLowerCase();
  return title
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .slice(0, 5)
    .join("-");
}

export function clusterStories(items: PersistedFeedRecord[]): StoryClusterResult[] {
  const buckets = new Map<string, PersistedFeedRecord[]>();

  for (const item of items) {
    const key = storyKey(item);
    const existing = buckets.get(key) ?? [];
    existing.push(item);
    buckets.set(key, existing);
  }

  return Array.from(buckets.entries())
    .map(([key, clusteredItems]) => ({
      clusterId: key,
      clusterTitle: clusteredItems[0]?.feedItem.title ?? "Untitled cluster",
      items: clusteredItems
    }))
    .sort((left, right) => {
      const leftPublished = new Date(left.items[0]?.feedItem.publishedAt ?? 0).getTime();
      const rightPublished = new Date(right.items[0]?.feedItem.publishedAt ?? 0).getTime();
      return rightPublished - leftPublished;
    });
}
