import type { SourceAdapter, SourceAdapterFetchInput, SourceFetchResult } from "@/server/ingestion/adapters/types";
import { parseEntries, type ParsedFeedEntry } from "@/server/ingestion/adapters/rss-parser";
import { getRuntimeSettings } from "@/server/settings/settings";
import type { SourceItem } from "@/types/feed";

function getConfiguredFeedUrls(feedUrls: string): string[] {
  return feedUrls
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

async function fetchFeed(feedUrl: string, timeoutMs: number): Promise<ParsedFeedEntry[]> {
  const response = await fetch(feedUrl, {
    signal: AbortSignal.timeout(timeoutMs),
    headers: {
      Accept: "application/rss+xml, application/atom+xml, application/xml, text/xml"
    }
  });

  if (!response.ok) {
    throw new Error(`RSS fetch failed for ${feedUrl} with ${response.status}`);
  }

  const xml = await response.text();
  return parseEntries(feedUrl, xml);
}

function toSourceItem(entry: ParsedFeedEntry, fetchedAt: string): SourceItem {
  return {
    id: `rss-${entry.id}`,
    source: "rss",
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

export class RssAdapter implements SourceAdapter {
  source = "rss" as const;

  async fetchLatest(input: SourceAdapterFetchInput): Promise<SourceFetchResult> {
    const settings = await getRuntimeSettings();
    const feedUrls = getConfiguredFeedUrls(settings.rssFeedUrls);

    if (feedUrls.length === 0) {
      return {
        sourceItems: []
      };
    }

    const fetchedAt = new Date().toISOString();
    const settled = await Promise.allSettled(
      feedUrls.map((feedUrl) => fetchFeed(feedUrl, 15000))
    );

    const sourceItems = settled
      .flatMap((result) => (result.status === "fulfilled" ? result.value : []))
      .map((entry) => toSourceItem(entry, fetchedAt))
      .filter((item) => {
        if (!input.since || !item.publishedAt) {
          return true;
        }

        return new Date(item.publishedAt).getTime() >= input.since.getTime();
      })
      .sort((left, right) => {
        return new Date(right.publishedAt ?? right.fetchedAt).getTime() - new Date(left.publishedAt ?? left.fetchedAt).getTime();
      });

    const dedupedItems = Array.from(new Map(sourceItems.map((item) => [item.sourceUrl, item])).values());
    const limit = input.limit ?? 25;

    return {
      sourceItems: dedupedItems.slice(0, limit)
    };
  }
}
