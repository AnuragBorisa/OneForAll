import type { DailyDigestPayload } from "@/server/digests/build-daily-digest";

export function renderWhatsAppDigest(digest: DailyDigestPayload): string {
  const lines = [
    `*${digest.title}*`,
    digest.intro,
    ""
  ];

  digest.entries.forEach((entry, index) => {
    lines.push(`${index + 1}. ${entry.title}`);
    lines.push(`${entry.shortSummary}`);
    lines.push(entry.sourceUrl);
    lines.push("");
  });

  return lines.join("\n").trim();
}
