import {
  validateDetailedExplanationPayload,
  type DetailedExplanationPayload
} from "@/server/pipeline/detailed-explanation-schema";
import { generateModelDetailedExplanation } from "@/server/pipeline/model-detailed-explanation";
import type { FeedItem, SourceItem } from "@/types/feed";

interface ExplanationContext {
  feedItem: FeedItem;
  sourceItem?: SourceItem;
}

function normalizeWhitespace(input: string): string {
  return input.replace(/\s+/g, " ").trim();
}

function getSourceText({ feedItem, sourceItem }: ExplanationContext): string {
  return normalizeWhitespace(sourceItem?.rawText ?? feedItem.normalizedText ?? feedItem.title);
}

function splitSentences(input: string): string[] {
  return input
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => normalizeWhitespace(sentence))
    .filter(Boolean);
}

function toSentence(input: string): string {
  const trimmed = normalizeWhitespace(input).replace(/[.]+$/, "");
  return trimmed ? `${trimmed}.` : "";
}

function truncate(input: string, maxLength: number): string {
  if (input.length <= maxLength) {
    return input;
  }

  return `${input.slice(0, maxLength - 1).trimEnd()}...`;
}

function hasThinSourceText(context: ExplanationContext): boolean {
  const title = normalizeWhitespace(context.feedItem.title).toLowerCase();
  const text = getSourceText(context).toLowerCase();
  return !text || text === title || text.length <= title.length + 24;
}

function buildWhatHappened(context: ExplanationContext): string {
  const sentences = splitSentences(getSourceText(context));
  const title = normalizeWhitespace(context.feedItem.title);

  if (sentences.length >= 2 && !hasThinSourceText(context)) {
    return toSentence(`${title} centers on ${truncate(sentences.slice(0, 2).join(" "), 420)}`);
  }

  return toSentence(
    `${title} is a ${context.feedItem.contentType.replaceAll("_", " ")} signal surfaced from ${context.feedItem.sourceAttribution.source.toUpperCase()}`
  );
}

function buildKeyPoints(context: ExplanationContext): string[] {
  const sentences = splitSentences(getSourceText(context));
  const points = sentences.slice(0, 4).map((sentence) => toSentence(truncate(sentence, 180)));

  while (points.length < 3) {
    points.push(
      toSentence(
        `The item is being treated as a ${context.feedItem.contentType.replaceAll("_", " ")} update with source attribution preserved`
      )
    );
  }

  return points.slice(0, 5);
}

function buildWhyItMatters(context: ExplanationContext): string {
  const source = context.feedItem.sourceAttribution.source.toUpperCase();

  if (hasThinSourceText(context)) {
    return toSentence(
      `This matters mainly as an early signal to watch, but the source text is not strong enough yet to support a deeper factual read than the headline and metadata`
    ) + ` It is still useful because ${source} often surfaces emerging discussion before more complete write-ups appear.`;
  }

  return toSentence(
    `This matters because it can affect how you evaluate tools, research directions, or implementation choices tied to this topic`
  ) + " A longer explanation is useful here because the source contains enough substance to extract practical implications rather than just summarize the headline.";
}

function buildPracticalTakeaways(context: ExplanationContext): string[] {
  const title = normalizeWhitespace(context.feedItem.title);

  return [
    `Use this item as a prompt to verify whether ${title.toLowerCase()} changes any current tooling, evaluation, or research priorities for you.`,
    "Pull the original source and compare its claims against one concrete workflow or decision you already own.",
    "Track whether the same point appears in other sources before turning it into a stronger conclusion."
  ];
}

function buildRisksAndUnknowns(context: ExplanationContext): string[] {
  const risks = [
    "The source may emphasize one angle without giving enough implementation detail, benchmarks, or counterarguments.",
    "Some implications are still inferential unless they are confirmed by fuller documentation, demos, or follow-up reporting."
  ];

  if (hasThinSourceText(context)) {
    risks.unshift("The underlying source text is thin, so a significant part of the interpretation remains constrained by missing context.");
  }

  return risks.slice(0, 4);
}

function buildNextSteps(context: ExplanationContext): string[] {
  return [
    "Open the original source and identify the exact claim, release detail, or result that is directly supported.",
    "Decide whether this belongs in your watchlist, your experimentation queue, or your immediate action list.",
    `Revisit this topic after the next refresh to see whether follow-up posts, comments, or official material add missing context around ${context.feedItem.title}.`
  ];
}

function buildSourceLimits(context: ExplanationContext): string | null {
  if (!hasThinSourceText(context)) {
    return null;
  }

  return "The available source text is limited, so this detailed explanation is constrained by headline-level context and may need follow-up sources for a stronger read.";
}

function buildHeuristicDetailedExplanation(context: ExplanationContext): DetailedExplanationPayload {
  return validateDetailedExplanationPayload({
    whatHappened: buildWhatHappened(context),
    keyPoints: buildKeyPoints(context),
    whyItMatters: buildWhyItMatters(context),
    practicalTakeaways: buildPracticalTakeaways(context),
    risksAndUnknowns: buildRisksAndUnknowns(context),
    nextSteps: buildNextSteps(context),
    sourceLimits: buildSourceLimits(context)
  });
}

export async function generateDetailedExplanation(
  context: ExplanationContext
): Promise<DetailedExplanationPayload> {
  try {
    const modelResult = await generateModelDetailedExplanation(context);
    if (modelResult) {
      return modelResult;
    }
  } catch (error) {
    console.warn("Detailed explanation model generation failed, using heuristic fallback.", error);
  }

  return buildHeuristicDetailedExplanation(context);
}
