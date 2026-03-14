const LABELS: Record<string, string> = {
  x: "X",
  reddit: "Reddit",
  youtube: "YouTube",
  rss: "RSS/Blogs"
};

export function SourceBadge({ source }: { source: string }) {
  return (
    <span
      className="source-badge"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        width: "fit-content",
        padding: "7px 12px",
        borderRadius: 999,
        background: "var(--accent-soft)",
        color: "var(--accent-strong)",
        fontSize: 12,
        letterSpacing: "0.12em",
        textTransform: "uppercase"
      }}
    >
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: "currentColor",
          boxShadow: "0 0 16px rgba(var(--accent-strong-rgb), 0.8)"
        }}
      />
      {LABELS[source] ?? source}
    </span>
  );
}
