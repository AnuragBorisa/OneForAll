import {
  validateDetailedExplanationPayload,
  type DetailedExplanationPayload
} from "@/server/pipeline/detailed-explanation-schema";
import { getRuntimeSettings } from "@/server/settings/settings";
import type { FeedItem, SourceItem } from "@/types/feed";

interface OpenAICompatibleResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
}

function buildPrompt(feedItem: FeedItem, sourceItem?: SourceItem): string {
  const sourceText = sourceItem?.rawText ?? feedItem.normalizedText ?? "";

  return [
    "You are generating a detailed, source-grounded explanation for a live topic feed product.",
    "Be specific, practical, and materially richer than a short breakdown.",
    "Do not invent facts. Separate what is directly supported from what remains uncertain.",
    "Use the source text heavily. If the source is thin, say so in sourceLimits and keep the explanation honest.",
    "Return JSON only with keys: whatHappened, keyPoints, whyItMatters, practicalTakeaways, risksAndUnknowns, nextSteps, sourceLimits.",
    "",
    `Title: ${feedItem.title}`,
    `Source: ${feedItem.sourceAttribution.source}`,
    `Author: ${feedItem.sourceAttribution.authorName ?? "unknown"}`,
    `Content type: ${feedItem.contentType}`,
    `Published at: ${feedItem.publishedAt ?? "unknown"}`,
    `URL: ${feedItem.sourceAttribution.sourceUrl}`,
    "",
    "Source text:",
    sourceText || "(no additional source text available)"
  ].join("\n");
}

function extractJson(content: string): unknown {
  const fencedMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fencedMatch?.[1] ?? content;
  return JSON.parse(candidate.trim());
}

export async function generateModelDetailedExplanation(params: {
  feedItem: FeedItem;
  sourceItem?: SourceItem;
}): Promise<DetailedExplanationPayload | null> {
  const settings = await getRuntimeSettings();

  if (!settings.openaiModel || !settings.openaiApiBaseUrl) {
    return null;
  }

  const response = await fetch(`${settings.openaiApiBaseUrl.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(settings.openaiApiKey
        ? {
            Authorization: `Bearer ${settings.openaiApiKey}`
          }
        : {})
    },
    body: JSON.stringify({
      model: settings.openaiModel,
      temperature: 0.35,
      response_format: {
        type: "json_object"
      },
      messages: [
        {
          role: "system",
          content: "You produce detailed, source-grounded explanations for fast-moving technical feeds."
        },
        {
          role: "user",
          content: buildPrompt(params.feedItem, params.sourceItem)
        }
      ]
    }),
    signal: AbortSignal.timeout(45000)
  });

  if (!response.ok) {
    throw new Error(`Detailed explanation request failed with ${response.status}`);
  }

  const payload = (await response.json()) as OpenAICompatibleResponse;
  const content = payload.choices?.[0]?.message?.content;

  if (!content) {
    return null;
  }

  return validateDetailedExplanationPayload(extractJson(content));
}
