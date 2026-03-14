import { listSavedItems } from "@/server/saved/saved-store";
import { FeedCard } from "@/components/feed-card";

export const dynamic = "force-dynamic";

export default async function SavedPage() {
  const items = await listSavedItems();

  return (
    <main style={{ minHeight: "100vh", padding: "48px 24px 80px" }}>
      <section style={{ maxWidth: 900, margin: "0 auto", display: "grid", gap: 20 }}>
        <div
          className="page-hero"
          style={{
            display: "grid",
            gap: 10,
            padding: 32,
            borderRadius: 32,
            background: "var(--surface)"
          }}
        >
          <h1 style={{ margin: 0, fontSize: "clamp(2.1rem, 6vw, 4rem)" }}>Saved items</h1>
          <p style={{ margin: 0, color: "var(--muted)" }}>
            Keep the AI updates and workflows you want to revisit without hunting through the feed again.
          </p>
        </div>

        <div style={{ display: "grid", gap: 16 }}>
          {items.length > 0 ? (
            items.filter((detail): detail is NonNullable<typeof detail> => Boolean(detail)).map((detail) => (
              <FeedCard
                key={detail.item.id}
                item={{
                  ...detail.item,
                  relatedCount: 0
                }}
              />
            ))
          ) : (
            <div
              className="soft-panel"
              style={{
                padding: 24,
                borderRadius: 24,
                border: "1px solid rgba(114, 255, 176, 0.12)"
              }}
            >
              No saved items yet.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
