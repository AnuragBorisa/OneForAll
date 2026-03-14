import { PresetSwitcher } from "@/components/preset-switcher";
import { FeedCard } from "@/components/feed-card";
import { RefreshButton } from "@/components/refresh-button";
import { getFeed } from "@/server/ranking/get-feed";
import { getActivePreset } from "@/server/settings/settings";
import { getPresetTopicOptions } from "@/server/pipeline/topic-taxonomy";
import { buildFilterHref } from "@/lib/feed-filters";

const SOURCES = ["x", "reddit", "youtube", "rss"] as const;
export const dynamic = "force-dynamic";

export default async function FeedPage({
  searchParams
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedParams = (await searchParams) ?? {};
  const source = typeof resolvedParams.source === "string" ? resolvedParams.source : null;
  const topic = typeof resolvedParams.topic === "string" ? resolvedParams.topic : null;
  const preset = await getActivePreset();
  const topicOptions = getPresetTopicOptions(preset.id);
  const items = await getFeed({ source, topic });

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "48px 24px 80px",
        background: "#020203"
      }}
    >
      <section
        style={{
          maxWidth: 960,
          margin: "0 auto",
          display: "grid",
          gap: 20
        }}
      >
        <div
          className="feed-hero page-hero"
          style={{
            display: "grid",
            gap: 12,
            padding: 32,
            borderRadius: 32
          }}
        >
          <span
            style={{
              width: "fit-content",
              padding: "6px 12px",
              borderRadius: 999,
              background: "var(--accent-soft)",
              color: "var(--accent-strong)",
              fontSize: 13,
              letterSpacing: "0.12em",
              textTransform: "uppercase"
            }}
          >
            {preset.label} Feed
          </span>
          <PresetSwitcher activePreset={preset.id} />
          <h1 style={{ margin: 0, fontSize: "clamp(2.2rem, 6vw, 4.4rem)", lineHeight: 0.95 }}>
            {preset.feedTitle}
          </h1>
          <p style={{ margin: 0, color: "var(--muted)", maxWidth: 760, fontSize: 18 }}>
            {preset.feedDescription}
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
            <RefreshButton />
            <a href="/settings" className="secondary-button" style={{ fontWeight: 700, textDecoration: "none" }}>
              Configure sources
            </a>
          </div>
        </div>

        <section
          className="filter-shell"
          style={{
            display: "grid",
            gap: 14,
            padding: 20,
            borderRadius: 24,
            background: "transparent",
            border: "1px solid var(--border)",
            boxShadow: "none"
          }}
        >
          <div style={{ display: "grid", gap: 8 }}>
            <strong>Filter by source</strong>
            <div className="chip-row">
              <a
                href={buildFilterHref("/feed", { topic })}
                className={`filter-chip ${!source ? "is-active" : ""}`}
              >
                All
              </a>
              {SOURCES.map((value) => (
                <a
                  key={value}
                  href={buildFilterHref("/feed", { source: value, topic })}
                  className={`filter-chip ${source === value ? "is-active" : ""}`}
                >
                  {value}
                </a>
              ))}
            </div>
          </div>
          <div style={{ display: "grid", gap: 8 }}>
            <strong>Filter by topic</strong>
            <div className="chip-row">
              <a
                href={buildFilterHref("/feed", { source })}
                className={`filter-chip ${!topic ? "is-active" : ""}`}
              >
                All
              </a>
              {topicOptions.map((value) => (
                <a
                  key={value}
                  href={buildFilterHref("/feed", { source, topic: value })}
                  className={`filter-chip ${topic === value ? "is-active" : ""}`}
                >
                  {value}
                </a>
              ))}
            </div>
          </div>
        </section>

        <div style={{ display: "grid", gap: 16 }}>
          {items.length > 0 ? (
            items.map((item) => <FeedCard key={item.id} item={item} />)
          ) : (
            <div
              style={{
                padding: 24,
                borderRadius: 24,
                border: "1px solid var(--border)",
                background: "transparent",
                boxShadow: "none"
              }}
            >
              No ingested items yet. Run `npm run ingest:rss` after setting `RSS_FEED_URLS` to
              populate the live feed.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
