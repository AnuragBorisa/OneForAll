import { buildDailyDigest } from "@/server/digests/build-daily-digest";
import { renderWhatsAppDigest } from "@/server/digests/render-whatsapp-digest";

export const dynamic = "force-dynamic";

export default async function DigestPage() {
  const digest = await buildDailyDigest();
  const whatsappPreview = renderWhatsAppDigest(digest);

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
          <h1 style={{ margin: 0, fontSize: "clamp(2.1rem, 6vw, 4rem)" }}>{digest.title}</h1>
          <p style={{ margin: 0, color: "var(--muted)" }}>{digest.intro}</p>
        </div>

        <div style={{ display: "grid", gap: 14 }}>
          {digest.entries.map((entry, index) => (
            <article
              className="soft-panel"
              key={entry.itemId}
              style={{
                padding: 20,
                borderRadius: 24,
                background: "transparent",
                border: "1px solid rgba(var(--accent-strong-rgb), 0.12)",
                display: "grid",
                gap: 8
              }}
            >
              <strong>
                {index + 1}. {entry.title}
              </strong>
              <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.7 }}>{entry.shortSummary}</p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <a href={`/feed/items/${entry.itemId}`}>Read breakdown</a>
                <a href={entry.sourceUrl} target="_blank" rel="noreferrer">
                  Open source
                </a>
              </div>
            </article>
          ))}
        </div>

        <section
          className="soft-panel"
          style={{
            display: "grid",
            gap: 10,
            padding: 24,
            borderRadius: 24,
            border: "1px solid rgba(var(--accent-strong-rgb), 0.12)",
            background: "rgba(var(--accent-rgb), 0.05)"
          }}
        >
          <h2 style={{ margin: 0 }}>WhatsApp-ready preview</h2>
          <pre
            style={{
              margin: 0,
              whiteSpace: "pre-wrap",
              fontFamily: "ui-monospace, SFMono-Regular, monospace",
              fontSize: 14
            }}
          >
            {whatsappPreview}
          </pre>
        </section>
      </section>
    </main>
  );
}
