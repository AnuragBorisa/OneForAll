import { validateExplanationPayload, type ExplanationPayload } from "@/server/pipeline/explanation-schema";
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
    "You are generating a structured explanation for an AI feed product.",
    "Be practical, grounded, and concise but richer than a headline rewrite.",
    "Do not invent facts missing from the source.",
    "If the source text is thin, say that clearly in credibilityNotes and avoid overclaiming.",
    "Return JSON only with keys: simpleExplanation, whyItMatters, example, useCases, whoShouldCare, tryItNext, credibilityNotes.",
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

export async function generateModelExplanation(params: {
  feedItem: FeedItem;
  sourceItem?: SourceItem;
}): Promise<ExplanationPayload | null> {
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
      temperature: 0.3,
      response_format: {
        type: "json_object"
      },
      messages: [
        {
          role: "system",
          content:
            "You produce structured, source-grounded explanations for AI news and workflow items."
        },
        {
          role: "user",
          content: buildPrompt(params.feedItem, params.sourceItem)
        }
      ]
    }),
    signal: AbortSignal.timeout(30000)
  });

  if (!response.ok) {
    throw new Error(`Model explanation request failed with ${response.status}`);
  }

  const payload = (await response.json()) as OpenAICompatibleResponse;
  const content = payload.choices?.[0]?.message?.content;

  if (!content) {
    return null;
  }

  return validateExplanationPayload(extractJson(content));
}
