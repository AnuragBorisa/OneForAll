import { createHash } from "node:crypto";

export interface ParsedFeedEntry {
  id: string;
  url: string;
  title: string | null;
  authorName: string | null;
  publishedAt: string | null;
  rawText: string | null;
  rawPayload: Record<string, unknown>;
}

function escapeTagName(tagName: string): string {
  return tagName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function decodeHtmlEntities(input: string): string {
  return input
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, "$1")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

export function stripHtml(input: string): string {
  return decodeHtmlEntities(input).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export function extractTagValue(block: string, tagNames: string[]): string | null {
  for (const tagName of tagNames) {
    const escapedTagName = escapeTagName(tagName);
    const match = block.match(new RegExp(`<${escapedTagName}(?:\\s[^>]*)?>([\\s\\S]*?)</${escapedTagName}>`, "i"));

    if (match?.[1]) {
      const value = stripHtml(match[1]);

      if (value) {
        return value;
      }
    }
  }

  return null;
}

export function extractLink(block: string): string | null {
  const atomLinkMatch = block.match(/<link\b[^>]*href=["']([^"']+)["'][^>]*\/?>/i);

  if (atomLinkMatch?.[1]) {
    return atomLinkMatch[1].trim();
  }

  return extractTagValue(block, ["link"]);
}

export function normalizeDate(input: string | null): string | null {
  if (!input) {
    return null;
  }

  const date = new Date(input);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

export function buildSourceItemId(prefix: string, entryId: string): string {
  return createHash("sha256").update(`${prefix}::${entryId}`).digest("hex").slice(0, 24);
}

export function parseEntries(feedUrl: string, xml: string): ParsedFeedEntry[] {
  const entryBlocks = [...xml.matchAll(/<(item|entry)\b[\s\S]*?>([\s\S]*?)<\/\1>/gi)];

  return entryBlocks
    .map(([, , block]): ParsedFeedEntry | null => {
      const url = extractLink(block) ?? feedUrl;
      const title = extractTagValue(block, ["title"]);
      const rawText =
        extractTagValue(block, ["content:encoded", "content", "description", "summary"]) ?? title;
      const authorName =
        extractTagValue(block, ["dc:creator", "author", "name", "itunes:author"]) ?? null;
      const publishedAt = normalizeDate(
        extractTagValue(block, ["pubDate", "published", "updated", "dc:date"])
      );
      const entryId =
        extractTagValue(block, ["guid", "id", "yt:videoId"]) ??
        url ??
        title ??
        createHash("sha256").update(block).digest("hex");

      return {
        id: buildSourceItemId(feedUrl, entryId),
        url,
        title,
        authorName,
        publishedAt,
        rawText,
        rawPayload: {
          feedUrl,
          entryId,
          title,
          url,
          authorName,
          publishedAt
        }
      };
    })
    .filter((entry): entry is ParsedFeedEntry => Boolean(entry?.url));
}
