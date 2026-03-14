import type { SourceFamily, SourceItem } from "@/types/feed";

export interface FixtureSeed {
  id: string;
  title: string;
  url: string;
  authorName: string;
  authorHandle?: string;
  publishedAt: string;
  rawText: string;
  engagementSignals?: Record<string, number | string | null>;
}

export function buildFixtureSourceItems(
  source: SourceFamily,
  seeds: FixtureSeed[]
): SourceItem[] {
  const fetchedAt = new Date().toISOString();

  return seeds.map((seed) => ({
    id: `${source}-${seed.id}`,
    source,
    sourceItemId: seed.id,
    sourceUrl: seed.url,
    authorName: seed.authorName,
    authorHandle: seed.authorHandle ?? null,
    publishedAt: seed.publishedAt,
    fetchedAt,
    title: seed.title,
    rawText: seed.rawText,
    rawPayload: seed,
    mediaRefs: [],
    engagementSignals: seed.engagementSignals ?? {},
    fetchStatus: "fetched"
  }));
}
