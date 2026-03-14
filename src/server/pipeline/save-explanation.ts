import type { ExplanationBlock, FeedItem } from "@/types/feed";
import type { ExplanationPayload } from "@/server/pipeline/explanation-schema";

export function createExplanationBlock(
  feedItem: FeedItem,
  payload: ExplanationPayload,
  generationVersion = "phase-3-v2"
): ExplanationBlock {
  return {
    id: `explanation-${feedItem.id}`,
    feedItemId: feedItem.id,
    simpleExplanation: payload.simpleExplanation,
    whyItMatters: payload.whyItMatters,
    example: payload.example ?? null,
    useCases: payload.useCases,
    whoShouldCare: payload.whoShouldCare,
    tryItNext: payload.tryItNext,
    credibilityNotes: payload.credibilityNotes ?? null,
    generationVersion,
    qualityStatus: "generated",
    generatedAt: new Date().toISOString()
  };
}
