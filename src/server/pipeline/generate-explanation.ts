import { buildCredibilityNotes } from "@/server/pipeline/credibility-notes";
import { validateExplanationPayload, type ExplanationPayload } from "@/server/pipeline/explanation-schema";
import { generateModelExplanation } from "@/server/pipeline/model-explanation";
import type { FeedItem, SourceItem } from "@/types/feed";

const STOPWORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "been",
  "for",
  "from",
  "how",
  "i",
  "in",
  "into",
  "is",
  "it",
  "just",
  "my",
  "now",
  "of",
  "on",
  "only",
  "or",
  "other",
  "own",
  "our",
  "that",
  "the",
  "their",
  "them",
  "then",
  "there",
  "this",
  "to",
  "using",
  "with",
  "each",
  "else",
  "guess",
  "you",
  "your"
]);

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

function getTitle(feedItem: FeedItem): string {
  return normalizeWhitespace(feedItem.title);
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
  const title = getTitle(context.feedItem).toLowerCase();
  const text = getSourceText(context).toLowerCase();

  return !text || text === title || text.length <= title.length + 12;
}

function extractKeywords(context: ExplanationContext): string[] {
  const text = `${getTitle(context.feedItem)} ${getSourceText(context)}`.toLowerCase();

  return Array.from(
    new Set(
      text
        .replace(/[^a-z0-9\s-]/g, " ")
        .split(/\s+/)
        .map((word) => word.trim())
        .filter((word) => word.length >= 4 && !STOPWORDS.has(word))
    )
  ).slice(0, 8);
}

function getMeaningfulKeywords(context: ExplanationContext): string[] {
  if (hasThinSourceText(context)) {
    return [];
  }

  return extractKeywords(context);
}

function formatKeywordList(keywords: string[]): string {
  if (keywords.length === 0) {
    return "";
  }

  if (keywords.length === 1) {
    return keywords[0];
  }

  if (keywords.length === 2) {
    return `${keywords[0]} and ${keywords[1]}`;
  }

  return `${keywords.slice(0, -1).join(", ")}, and ${keywords.at(-1)}`;
}

function deriveSpecificAngle(context: ExplanationContext): string {
  const keywords = getMeaningfulKeywords(context);
  const keywordSummary = formatKeywordList(keywords.slice(0, 3));

  if (!keywordSummary) {
    return "";
  }

  return ` The clearest signals here are ${keywordSummary}.`;
}

function buildSimpleExplanation(context: ExplanationContext): string {
  const { feedItem } = context;
  const text = getSourceText(context);
  const firstSentence = splitSentences(text)[0];

  if (!hasThinSourceText(context) && firstSentence) {
    return toSentence(
      `${getTitle(feedItem)} appears to be about ${truncate(firstSentence, 180)}`
    ) + deriveSpecificAngle(context);
  }

  return toSentence(
    `${getTitle(feedItem)} looks like a ${feedItem.contentType.replaceAll("_", " ")} signal from ${feedItem.sourceAttribution.source.toUpperCase()}`
  ) + " The available source text is thin, so this breakdown leans on the title and source context rather than a detailed write-up.";
}

function buildWhyItMatters(context: ExplanationContext): string {
  const { feedItem } = context;
  const keywords = getMeaningfulKeywords(context).slice(0, 3);
  const keywordSummary = formatKeywordList(keywords);

  switch (feedItem.contentType) {
    case "workflow":
      return toSentence(
        `This matters if you want practical AI execution patterns, because it points to a repeatable way of working rather than just a general opinion${keywordSummary ? ` around ${keywordSummary}` : ""}`
      );
    case "tutorial":
      return toSentence(
        `This matters because it can shorten the path from curiosity to implementation${keywordSummary ? `, especially if you are evaluating ${keywordSummary}` : ""}`
      );
    case "launch":
    case "official_announcement":
      return toSentence(
        `This matters if the release changes what tools, models, or product choices are available to you${keywordSummary ? ` in areas like ${keywordSummary}` : ""}`
      );
    case "news":
      return toSentence(
        `This matters because it may signal a broader product or ecosystem shift${keywordSummary ? ` connected to ${keywordSummary}` : ""}`
      );
    default:
      return toSentence(
        `This matters as a signal of what people are reacting to, testing, or arguing about right now${keywordSummary ? ` around ${keywordSummary}` : ""}`
      );
  }
}

function deriveUseCases(context: ExplanationContext): string[] {
  const { feedItem } = context;
  const keywords = getMeaningfulKeywords(context);
  const topKeyword = keywords[0];

  switch (feedItem.contentType) {
    case "workflow":
      return [
        topKeyword
          ? `Use the idea as a template for your own ${topKeyword}-related workflow.`
          : "Use the idea as a template for your own repeatable AI workflow.",
        "Compare the claimed workflow against the steps you already run manually."
      ];
    case "tutorial":
      return [
        "Turn the walkthrough into a short internal checklist or team playbook.",
        topKeyword
          ? `Test the approach on one small ${topKeyword}-style task before adopting it more widely.`
          : "Test the approach on one small real task before adopting it more widely."
      ];
    case "launch":
    case "official_announcement":
      return [
        "Check whether the launch changes a tool choice, budget decision, or evaluation plan.",
        "Summarize the release for teammates who need the practical implications, not the marketing."
      ];
    default:
      return [
        "Treat the item as directional signal and verify whether the claim holds in your own setup.",
        "Track whether this idea shows up repeatedly across other sources before acting on it."
      ];
  }
}

function deriveWhoShouldCare(context: ExplanationContext): string[] {
  const { feedItem } = context;
  const keywords = getMeaningfulKeywords(context);

  if (feedItem.contentType === "workflow") {
    return ["builders", "operators", keywords[0] ? `${keywords[0]} practitioners` : "automation-focused teams"];
  }

  if (feedItem.contentType === "tutorial") {
    return ["technical learners", "implementers", "teams evaluating new tooling"];
  }

  if (feedItem.contentType === "launch" || feedItem.contentType === "official_announcement") {
    return ["tool evaluators", "AI leads", "teams making stack decisions"];
  }

  return ["AI-curious professionals", "research and tooling watchers", "teams tracking practical AI changes"];
}

function deriveExample(context: ExplanationContext): string | null {
  const keywords = getMeaningfulKeywords(context);
  const topKeyword = keywords[0];
  const secondKeyword = keywords[1];

  switch (context.feedItem.contentType) {
    case "workflow":
      return toSentence(
        `Example: adapt the idea into a small internal flow${topKeyword ? ` for ${topKeyword}` : ""}, then measure whether it saves time or improves output quality`
      );
    case "tutorial":
      return toSentence(
        `Example: follow the process once on a low-risk task${topKeyword ? ` involving ${topKeyword}` : ""}, then simplify it into a repeatable checklist`
      );
    case "launch":
    case "official_announcement":
      return toSentence(
        `Example: compare the new release against one existing workflow${secondKeyword ? ` touching ${secondKeyword}` : ""} before changing your stack`
      );
    default:
      return toSentence(
        `Example: use this item as a prompt to review whether your current approach${topKeyword ? ` to ${topKeyword}` : ""} still makes sense`
      );
  }
}

function deriveTryItNext(context: ExplanationContext): string {
  const text = getSourceText(context);
  const secondSentence = splitSentences(text)[1];

  if (secondSentence && !hasThinSourceText(context)) {
    return toSentence(
      `Try this next: open the original source and check whether the supporting detail behind "${truncate(secondSentence, 100)}" is strong enough to test on a small real task`
    );
  }

  switch (context.feedItem.contentType) {
    case "workflow":
      return "Try this next: copy the workflow idea into your notes, identify the smallest version you can test this week, and compare it with your current manual process.";
    case "tutorial":
      return "Try this next: extract the concrete steps from the source, test them on one real task, and keep only the parts that improve speed or clarity.";
    case "launch":
    case "official_announcement":
      return "Try this next: read the original release details, compare them with one tool you already use, and decide whether it deserves a serious evaluation.";
    default:
      return "Try this next: open the original post, separate the concrete claim from the opinion around it, and decide whether it is worth tracking or testing.";
  }
}

export function generateHeuristicExplanation(context: ExplanationContext): ExplanationPayload {
  const payload = {
    simpleExplanation: buildSimpleExplanation(context),
    whyItMatters: buildWhyItMatters(context),
    example: deriveExample(context),
    useCases: deriveUseCases(context),
    whoShouldCare: deriveWhoShouldCare(context),
    tryItNext: deriveTryItNext(context),
    credibilityNotes: buildCredibilityNotes(context)
  };

  return validateExplanationPayload(payload);
}

export async function generateExplanation(context: ExplanationContext): Promise<ExplanationPayload> {
  try {
    const modelPayload = await generateModelExplanation(context);

    if (modelPayload) {
      return modelPayload;
    }
  } catch {
    // Fall back to heuristic generation if the model provider is unavailable or misconfigured.
  }

  return generateHeuristicExplanation(context);
}
