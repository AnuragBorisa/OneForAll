import {
  getFeedItemById,
  upsertDetailedExplanation
} from "@/server/db/repositories/feed-repository";
import { generateDetailedExplanation } from "@/server/pipeline/generate-detailed-explanation";
import { generateExplanation } from "@/server/pipeline/generate-explanation";
import { markExplanationPublishability } from "@/server/pipeline/publishable-item";
import { createExplanationBlock } from "@/server/pipeline/save-explanation";
import { createDetailedExplanation } from "@/server/pipeline/save-detailed-explanation";

export async function getItemDetail(itemId: string) {
  const record = await getFeedItemById(itemId);

  if (!record) {
    return null;
  }

  const explanationPayload = await generateExplanation(record);
  const explanation =
    record.explanation ??
    markExplanationPublishability(createExplanationBlock(record.feedItem, explanationPayload), explanationPayload);

  return {
    item: {
      id: record.feedItem.id,
      title: record.feedItem.title,
      source: record.feedItem.sourceAttribution.source,
      author: record.feedItem.sourceAttribution.authorName,
      sourceUrl: record.feedItem.sourceAttribution.sourceUrl,
      publishedAt: record.feedItem.publishedAt,
      contentType: record.feedItem.contentType,
      topicTags: record.feedItem.topicTags,
      explanationPreview: explanation.simpleExplanation ?? record.feedItem.summaryExcerpt
    },
    explanation,
    detailedExplanation: record.detailedExplanation,
    cluster: null
  };
}

export async function getOrCreateDetailedExplanation(itemId: string) {
  const record = await getFeedItemById(itemId);

  if (!record) {
    return null;
  }

  if (record.detailedExplanation) {
    return record.detailedExplanation;
  }

  const payload = await generateDetailedExplanation(record);
  const detailedExplanation = createDetailedExplanation(record.feedItem, payload);
  await upsertDetailedExplanation(detailedExplanation);

  return detailedExplanation;
}
