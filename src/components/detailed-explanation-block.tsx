import type { DetailedExplanation } from "@/types/feed";

export function DetailedExplanationBlock({ explanation }: { explanation: DetailedExplanation }) {
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
        <h2 style={{ margin: 0, fontSize: 30 }}>Detailed explanation</h2>
        <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.8 }}>{explanation.whatHappened}</p>
      </div>

      <div style={{ display: "grid", gap: 6 }}>
        <h3 style={{ margin: 0, fontSize: 22 }}>Key points</h3>
        <ul style={{ margin: 0, paddingLeft: 20, color: "var(--muted)", lineHeight: 1.8 }}>
          {explanation.keyPoints.map((item, index) => (
            <li key={`key-point-${index}`}>{item}</li>
          ))}
        </ul>
      </div>

      <div style={{ display: "grid", gap: 6 }}>
        <h3 style={{ margin: 0, fontSize: 22 }}>Why it matters</h3>
        <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.8 }}>{explanation.whyItMatters}</p>
      </div>

      <div style={{ display: "grid", gap: 6 }}>
        <h3 style={{ margin: 0, fontSize: 22 }}>Practical takeaways</h3>
        <ul style={{ margin: 0, paddingLeft: 20, color: "var(--muted)", lineHeight: 1.8 }}>
          {explanation.practicalTakeaways.map((item, index) => (
            <li key={`takeaway-${index}`}>{item}</li>
          ))}
        </ul>
      </div>

      <div style={{ display: "grid", gap: 6 }}>
        <h3 style={{ margin: 0, fontSize: 22 }}>Risks and unknowns</h3>
        <ul style={{ margin: 0, paddingLeft: 20, color: "var(--muted)", lineHeight: 1.8 }}>
          {explanation.risksAndUnknowns.map((item, index) => (
            <li key={`risk-${index}`}>{item}</li>
          ))}
        </ul>
      </div>

      <div style={{ display: "grid", gap: 6 }}>
        <h3 style={{ margin: 0, fontSize: 22 }}>Next steps</h3>
        <ul style={{ margin: 0, paddingLeft: 20, color: "var(--muted)", lineHeight: 1.8 }}>
          {explanation.nextSteps.map((item, index) => (
            <li key={`next-step-${index}`}>{item}</li>
          ))}
        </ul>
      </div>

      {explanation.sourceLimits ? (
        <div
          style={{
            padding: 16,
            borderRadius: 18,
            background: "rgba(54, 227, 138, 0.08)",
            color: "var(--accent-strong)",
            border: "1px solid rgba(114, 255, 176, 0.16)"
          }}
        >
          {explanation.sourceLimits}
        </div>
      ) : null}
    </section>
  );
}
