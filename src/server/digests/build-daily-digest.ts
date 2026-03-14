import { getPersistedDailyDigestForDate, upsertDailyDigest } from "@/server/db/repositories/feed-repository";
import { getFeed } from "@/server/ranking/get-feed";
import { getItemDetail } from "@/server/detail/get-item-detail";
import { getActivePreset } from "@/server/settings/settings";

export interface DailyDigestPayload {
  date: string;
  title: string;
  intro: string;
  entries: Array<{
    itemId: string;
    title: string;
    shortSummary: string;
    sourceUrl: string;
  }>;
}

export async function buildDailyDigest(): Promise<DailyDigestPayload> {
  const today = new Date();
  const preset = await getActivePreset();
  const persisted = await getPersistedDailyDigestForDate(today);

  if (persisted && persisted.entries.length > 0 && persisted.digest.title === preset.digestTitle) {
    const feedItems = await getFeed();
    const feedById = new Map(feedItems.map((item) => [item.id, item]));

    return {
      date: persisted.digest.digestDate.slice(0, 10),
      title: persisted.digest.title,
      intro: persisted.digest.summaryIntro ?? "",
      entries: persisted.entries.map((entry) => ({
        itemId: entry.feedItemId,
        title: feedById.get(entry.feedItemId)?.title ?? entry.feedItemId,
        shortSummary: entry.shortSummary,
        sourceUrl: feedById.get(entry.feedItemId)?.sourceUrl ?? "#"
      }))
    };
  }

  const feed = await getFeed();
  const selected = feed.slice(0, 5);

  const entries = await Promise.all(
    selected.map(async (item) => {
      const detail = await getItemDetail(item.id);

      return {
        itemId: item.id,
        title: item.title,
        shortSummary:
          detail?.explanation.simpleExplanation ??
          item.explanationPreview ??
          "Important recent AI update worth reviewing.",
        sourceUrl: item.sourceUrl
      };
    })
  );

  const payload = {
    date: today.toISOString().slice(0, 10),
    title: preset.digestTitle,
    intro: preset.digestIntro,
    entries
  };

  await upsertDailyDigest({
    digestDate: today,
    title: payload.title,
    summaryIntro: payload.intro,
    entries: payload.entries.map((entry) => ({
      feedItemId: entry.itemId,
      shortSummary: entry.shortSummary,
      reasonSelected: "Top recent item in the unified feed."
    }))
  });

  return payload;
}
