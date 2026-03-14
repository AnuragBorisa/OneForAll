import { parseEntries } from "@/server/ingestion/adapters/rss-parser";
import type { SourceAdapter, SourceAdapterFetchInput, SourceFetchResult } from "@/server/ingestion/adapters/types";
import { getRuntimeSettings } from "@/server/settings/settings";
import type { SourceItem } from "@/types/feed";

function getFeedUrls(channelIds: string, feedUrls: string): string[] {
  const configuredFeedUrls = feedUrls
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  const channelFeeds = channelIds
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)
    .map((channelId) => `https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(channelId)}`);

  return [...configuredFeedUrls, ...channelFeeds];
}

function toSourceItem(entry: ReturnType<typeof parseEntries>[number], fetchedAt: string): SourceItem {
  return {
    id: `youtube-${entry.id}`,
    source: "youtube",
    sourceItemId: entry.id,
    sourceUrl: entry.url,
    authorName: entry.authorName,
    authorHandle: null,
    publishedAt: entry.publishedAt,
    fetchedAt,
    title: entry.title,
    rawText: entry.rawText,
    rawPayload: entry.rawPayload,
    mediaRefs: [],
    engagementSignals: {},
    fetchStatus: "fetched"
  };
}

export class YouTubeAdapter implements SourceAdapter {
  source = "youtube" as const;

  async fetchLatest(input: SourceAdapterFetchInput): Promise<SourceFetchResult> {
    const settings = await getRuntimeSettings();
    const feedUrls = getFeedUrls(settings.youtubeChannelIds, settings.youtubeFeedUrls);

    if (feedUrls.length === 0) {
      return { sourceItems: [] };
    }

    const fetchedAt = new Date().toISOString();
    const settled = await Promise.allSettled(
      feedUrls.map(async (feedUrl) => {
        const response = await fetch(feedUrl, {
          signal: AbortSignal.timeout(15000),
          headers: {
            Accept: "application/rss+xml, application/atom+xml, application/xml, text/xml"
          }
        });

        if (!response.ok) {
          throw new Error(`YouTube feed fetch failed for ${feedUrl} with ${response.status}`);
        }

        return parseEntries(feedUrl, await response.text());
      })
    );

    const sourceItems = settled
      .flatMap((result) => (result.status === "fulfilled" ? result.value : []))
      .map((entry) => toSourceItem(entry, fetchedAt))
      .filter((item) => !input.since || !item.publishedAt || new Date(item.publishedAt) >= input.since)
      .sort((left, right) => new Date(right.publishedAt ?? right.fetchedAt).getTime() - new Date(left.publishedAt ?? left.fetchedAt).getTime());

    const dedupedItems = Array.from(new Map(sourceItems.map((item) => [item.sourceUrl, item])).values());

    return {
      sourceItems: dedupedItems.slice(0, input.limit ?? 25)
    };
  }
}
