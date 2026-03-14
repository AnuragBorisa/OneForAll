import type { ExplanationBlock as ExplanationBlockType } from "@/types/feed";

export function ExplanationBlock({ explanation }: { explanation: ExplanationBlockType }) {
  return (
    <section
      className="page-section"
      style={{
        display: "grid",
        gap: 18,
        padding: 24,
        borderRadius: 28,
        background: "var(--surface)"
      }}
    >
      <div style={{ display: "grid", gap: 6 }}>
        <h2 style={{ margin: 0, fontSize: 30 }}>Simple explanation</h2>
        <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.7 }}>{explanation.simpleExplanation}</p>
      </div>

      <div style={{ display: "grid", gap: 6 }}>
        <h3 style={{ margin: 0, fontSize: 22 }}>Why it matters</h3>
        <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.7 }}>{explanation.whyItMatters}</p>
      </div>

      {explanation.example ? (
        <div style={{ display: "grid", gap: 6 }}>
          <h3 style={{ margin: 0, fontSize: 22 }}>Example</h3>
          <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.7 }}>{explanation.example}</p>
        </div>
      ) : null}

      <div style={{ display: "grid", gap: 6 }}>
        <h3 style={{ margin: 0, fontSize: 22 }}>Use cases</h3>
        <ul style={{ margin: 0, paddingLeft: 20, color: "var(--muted)", lineHeight: 1.7 }}>
          {explanation.useCases.map((item, index) => (
            <li key={`use-case-${index}`}>{item}</li>
          ))}
        </ul>
      </div>

      <div style={{ display: "grid", gap: 6 }}>
        <h3 style={{ margin: 0, fontSize: 22 }}>Who should care</h3>
        <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.7 }}>{explanation.whoShouldCare.join(", ")}</p>
      </div>

      <div style={{ display: "grid", gap: 6 }}>
        <h3 style={{ margin: 0, fontSize: 22 }}>Try it next</h3>
        <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.7 }}>{explanation.tryItNext}</p>
      </div>

      {explanation.credibilityNotes ? (
        <div
          style={{
            padding: 16,
            borderRadius: 18,
            background: "rgba(54, 227, 138, 0.1)",
            color: "var(--accent-strong)",
            border: "1px solid rgba(114, 255, 176, 0.16)"
          }}
        >
          {explanation.credibilityNotes}
        </div>
      ) : null}
    </section>
  );
}
