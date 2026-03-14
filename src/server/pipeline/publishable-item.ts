import { isPublishableExplanation, type ExplanationPayload } from "@/server/pipeline/explanation-schema";
import type { ExplanationBlock } from "@/types/feed";

export function isPublishableExplanationPayload(payload: ExplanationPayload): boolean {
  return isPublishableExplanation(payload);
}

export function markExplanationPublishability(
  explanationBlock: ExplanationBlock,
  payload: ExplanationPayload
): ExplanationBlock {
  return {
    ...explanationBlock,
    qualityStatus: isPublishableExplanationPayload(payload) ? "publishable" : "needs_review"
  };
}
