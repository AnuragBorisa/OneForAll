import type { DetailedExplanation, FeedItem } from "@/types/feed";
import type { DetailedExplanationPayload } from "@/server/pipeline/detailed-explanation-schema";

export function createDetailedExplanation(
  feedItem: FeedItem,
  payload: DetailedExplanationPayload,
  generationVersion = "detail-v1"
): DetailedExplanation {
  return {
    id: `detailed-explanation-${feedItem.id}`,
    feedItemId: feedItem.id,
    whatHappened: payload.whatHappened,
    keyPoints: payload.keyPoints,
    whyItMatters: payload.whyItMatters,
    practicalTakeaways: payload.practicalTakeaways,
    risksAndUnknowns: payload.risksAndUnknowns,
    nextSteps: payload.nextSteps,
    sourceLimits: payload.sourceLimits ?? null,
    generationVersion,
    qualityStatus: "generated",
    generatedAt: new Date().toISOString()
  };
}
