import { getActivePreset } from "@/server/settings/settings";

const sources = ["X", "Reddit", "YouTube", "RSS/Blogs"];

const principles = [
  "Aggregate the useful signal, not every raw post.",
  "Explain each item in plain language before asking the user to act on it.",
  "Preserve source context so users can inspect the original claim."
];

const metrics = [
  { label: "Sources", value: "4 live" },
  { label: "Format", value: "One calm feed" },
  { label: "Mode", value: "Web first" }
];

export default async function HomePage() {
  const preset = await getActivePreset();

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "48px 24px 80px"
      }}
    >
      <section
        style={{
          maxWidth: 1080,
          margin: "0 auto",
          display: "grid",
          gap: 24
        }}
      >
        <div
          className="hero-shell"
          style={{
            display: "grid",
            gap: 24,
            padding: 36,
            borderRadius: 36,
            background: "var(--surface)",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow), var(--glow)",
            backdropFilter: "blur(22px)"
          }}
        >
          <div className="hero-grid" style={{ display: "grid", gap: 28 }}>
            <div style={{ display: "grid", gap: 16 }}>
              <span className="feed-chip" style={{ width: "fit-content" }}>
                Live signal engine
              </span>
              <div style={{ display: "grid", gap: 14 }}>
                <h1 style={{ margin: 0, fontSize: "clamp(3rem, 8vw, 6.4rem)", lineHeight: 0.9, maxWidth: 820 }}>
                  {preset.homeTitle}
                </h1>
                <p style={{ margin: 0, maxWidth: 760, color: "var(--muted)", fontSize: 20, lineHeight: 1.7 }}>
                  {preset.homeDescription}
                </p>
              </div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <a href="/feed" className="primary-button" style={{ fontWeight: 700, textDecoration: "none" }}>
                  Open the feed
                </a>
                <a href="/settings" className="secondary-button" style={{ fontWeight: 700, textDecoration: "none" }}>
                  Tune sources
                </a>
              </div>
            </div>

            <div className="hero-panel" style={{ display: "grid", gap: 16 }}>
              <div style={{ display: "grid", gap: 8 }}>
                <span
                  style={{
                    color: "var(--accent-strong)",
                    fontSize: 12,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase"
                  }}
                >
                  Product posture
                </span>
                <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.8 }}>
                  Built to feel less like doomscrolling and more like a high-signal terminal for
                  tracking what actually changed, why it matters, and what deserves action.
                </p>
              </div>
              <div className="hero-metrics">
                {metrics.map((metric) => (
                  <div key={metric.label} className="metric-card">
                    <strong style={{ fontSize: "clamp(1rem, 1.8vw, 1.35rem)", lineHeight: 1.2 }}>{metric.value}</strong>
                    <span
                      style={{
                        color: "var(--muted)",
                        fontSize: 12,
                        textTransform: "uppercase",
                        letterSpacing: "0.12em"
                      }}
                    >
                      {metric.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div
          className="landing-source-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 18
          }}
        >
          {sources.map((source) => (
            <article
              key={source}
              style={{
                padding: 22,
                borderRadius: 24,
                background: "transparent",
                border: "1px solid rgba(114, 255, 176, 0.1)",
                boxShadow: "none"
              }}
            >
              <div style={{ display: "grid", gap: 10 }}>
                <span className="feed-chip" style={{ width: "fit-content", fontSize: 11 }}>
                  source stream
                </span>
                <h2 style={{ marginTop: 0, marginBottom: 0, fontSize: 22 }}>{source}</h2>
              </div>
              <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.5 }}>
                This source feeds into the active {preset.label.toLowerCase()} update pipeline.
              </p>
            </article>
          ))}
        </div>

        <section
          style={{
            display: "grid",
            gap: 12,
            padding: 24,
            borderRadius: 24,
            border: "1px solid rgba(114, 255, 176, 0.12)",
            background: "transparent",
            boxShadow: "none"
          }}
        >
          <h2 style={{ margin: 0, fontSize: 28 }}>Product rules locked in early</h2>
          <ul style={{ margin: 0, paddingLeft: 20, color: "var(--muted)", lineHeight: 1.7 }}>
            {principles.map((principle) => (
              <li key={principle}>{principle}</li>
            ))}
          </ul>
        </section>
      </section>
    </main>
  );
}
