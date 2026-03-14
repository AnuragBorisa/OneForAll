import { SourceBadge } from "@/components/source-badge";
import type { FeedListItem } from "@/server/ranking/get-feed";

function formatPublishedAt(input: string | null) {
  if (!input) {
    return "Unknown time";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(input));
}

export function FeedCard({ item }: { item: FeedListItem }) {
  return (
    <article
      className="feed-card"
      style={{
        padding: 24,
        borderRadius: 30,
        background: "transparent",
        border: "1px solid var(--border)",
        display: "grid",
        gap: 18,
        boxShadow: "none",
        position: "relative",
        overflow: "hidden"
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: "0 0 auto 0",
          height: 1,
          background: "linear-gradient(90deg, transparent, rgba(114, 255, 176, 0.6), transparent)"
        }}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          alignItems: "start",
          flexWrap: "wrap"
        }}
      >
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <SourceBadge source={item.source} />
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "6px 10px",
              borderRadius: 999,
              border: "1px solid rgba(114, 255, 176, 0.12)",
              background: "transparent",
              color: "var(--muted)",
              fontSize: 12,
              letterSpacing: "0.08em",
              textTransform: "uppercase"
            }}
          >
            {item.contentType.replaceAll("_", " ")}
          </span>
        </div>
        <span style={{ color: "var(--muted)", fontSize: 13 }}>{formatPublishedAt(item.publishedAt)}</span>
      </div>

      <div style={{ display: "grid", gap: 8 }}>
        <h2 style={{ margin: 0, fontSize: "clamp(1.4rem, 2vw, 1.75rem)", lineHeight: 1.08, maxWidth: 860 }}>
          {item.title}
        </h2>
        <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.7, maxWidth: 820 }}>
          {item.explanationPreview ?? "Explanation preview unavailable for this item yet."}
        </p>
      </div>

      {item.topicTags.length > 0 ? (
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {item.topicTags.slice(0, 5).map((tag) => (
            <span key={tag} className="feed-chip" style={{ fontSize: 12 }}>
              {tag.replaceAll("_", " ")}
            </span>
          ))}
        </div>
      ) : null}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 14,
          flexWrap: "wrap",
          alignItems: "end"
        }}
      >
        <div style={{ display: "grid", gap: 6 }}>
          <span style={{ color: "var(--muted)", fontSize: 14 }}>
            {item.author ? `By ${item.author}` : "Source author unavailable"}
          </span>
          {item.relatedCount > 0 ? (
            <span style={{ color: "var(--muted)", fontSize: 13 }}>
              {item.relatedCount} related item{item.relatedCount === 1 ? "" : "s"}
            </span>
          ) : null}
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <a href={`/feed/items/${item.id}`} className="action-link" style={{ fontWeight: 700 }}>
            Read breakdown
          </a>
          <a href={`/feed/items/${item.id}?view=detailed`} className="action-link" style={{ fontWeight: 700 }}>
            Detailed explanation
          </a>
          <a
            href={item.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="action-link"
            style={{ fontWeight: 700 }}
          >
            Open source
          </a>
        </div>
      </div>
    </article>
  );
}
