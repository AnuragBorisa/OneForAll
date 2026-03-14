import type { SourceAdapter } from "@/server/ingestion/adapters/types";
import { upsertNormalizedRecord } from "@/server/db/repositories/feed-repository";
import { generateExplanation } from "@/server/pipeline/generate-explanation";
import { normalizeSourceItem } from "@/server/pipeline/normalize-item";
import { isPublishableExplanation } from "@/server/pipeline/explanation-schema";
import { markExplanationPublishability } from "@/server/pipeline/publishable-item";
import { createExplanationBlock } from "@/server/pipeline/save-explanation";

export interface PipelineDependencies {
  adapters: SourceAdapter[];
}

export interface PipelineStageSummary {
  source: string;
  fetched: number;
  normalized: number;
}

export interface PipelineRunResult {
  fetchedSources: number;
  normalizedItems: number;
  explanationValidationReady: boolean;
  stages: PipelineStageSummary[];
}

export async function runPipeline({
  adapters
}: PipelineDependencies): Promise<PipelineRunResult> {
  const stageSummaries: PipelineStageSummary[] = [];
  let normalizedItems = 0;

  for (const adapter of adapters) {
    const fetched = await adapter.fetchLatest({ limit: 25 });
    const normalized = await Promise.all(fetched.sourceItems.map(normalizeSourceItem));

    await Promise.all(
      normalized.map(async (record) => {
        const explanationPayload = await generateExplanation(record);
        const explanation = markExplanationPublishability(
          createExplanationBlock(record.feedItem, explanationPayload),
          explanationPayload
        );

        await upsertNormalizedRecord({
          sourceItem: record.sourceItem,
          feedItem: {
            ...record.feedItem,
            processingState: explanation.qualityStatus === "publishable" ? "published" : "explained",
            isPublishable: explanation.qualityStatus === "publishable"
          },
          explanation
        });
      })
    );

    normalizedItems += normalized.length;
    stageSummaries.push({
      source: adapter.source,
      fetched: fetched.sourceItems.length,
      normalized: normalized.length
    });
  }

  return {
    fetchedSources: adapters.length,
    normalizedItems,
    explanationValidationReady: isPublishableExplanation({
      simpleExplanation: "placeholder",
      whyItMatters: "placeholder",
      tryItNext: "placeholder"
    }),
    stages: stageSummaries
  };
}
