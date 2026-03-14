import { buildDailyDigest } from "@/server/digests/build-daily-digest";
import { getItemDetail } from "@/server/detail/get-item-detail";
import { getFeed } from "@/server/ranking/get-feed";

export async function runFeedFlowScenario() {
  const feed = await getFeed();
  const first = feed[0];
  const detail = first ? await getItemDetail(first.id) : null;
  const digest = await buildDailyDigest();

  return {
    feedCount: feed.length,
    hasDetail: Boolean(detail),
    digestCount: digest.entries.length
  };
}
