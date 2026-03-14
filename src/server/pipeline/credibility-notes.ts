import type { FeedItem, SourceItem } from "@/types/feed";

export function buildCredibilityNotes({
  feedItem,
  sourceItem
}: {
  feedItem: FeedItem;
  sourceItem?: SourceItem;
}): string | null {
  const rawText = `${sourceItem?.rawText ?? ""}`.trim();
  const text = `${feedItem.title} ${feedItem.normalizedText} ${rawText}`.toLowerCase();
  const hasThinText = !rawText || rawText.trim().toLowerCase() === feedItem.title.trim().toLowerCase();

  if (feedItem.sourceAttribution.source === "rss" && feedItem.contentType === "official_announcement") {
    return "Source appears to be a direct announcement or release-style writeup.";
  }

  if (hasThinText) {
    return "The source text available here is limited, so the explanation is based mostly on the title and source context rather than a detailed body.";
  }

  if (text.includes("thoughts") || text.includes("thread") || text.includes("opinion")) {
    return "This looks closer to an informed opinion or builder thread than a formal verified announcement.";
  }

  if (text.includes("beta") || text.includes("early") || text.includes("preview")) {
    return "This update may describe early or limited-access behavior, so practical results can vary.";
  }

  if (feedItem.sourceAttribution.source === "x" || feedItem.sourceAttribution.source === "reddit") {
    return "Community-sourced workflow posts can be useful, but results should be verified against your own setup.";
  }

  return null;
}
