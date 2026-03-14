"use client";

import { useEffect, useState } from "react";
import { DetailedExplanationBlock } from "@/components/detailed-explanation-block";
import type { DetailedExplanation } from "@/types/feed";

interface DetailedExplanationPanelProps {
  itemId: string;
  initialExplanation: DetailedExplanation | null;
  autoLoad?: boolean;
}

export function DetailedExplanationPanel({
  itemId,
  initialExplanation,
  autoLoad = false
}: DetailedExplanationPanelProps) {
  const [explanation, setExplanation] = useState<DetailedExplanation | null>(initialExplanation);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadDetailedExplanation() {
    if (isLoading) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/items/${itemId}/detailed-explanation`, {
        method: "POST"
      });

      if (!response.ok) {
        throw new Error(`Request failed with ${response.status}`);
      }

      const payload = (await response.json()) as { explanation: DetailedExplanation };
      setExplanation(payload.explanation);
    } catch (requestError) {
      console.error(requestError);
      setError("Could not generate the detailed explanation right now.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (autoLoad && !explanation) {
      void loadDetailedExplanation();
    }
  }, [autoLoad, explanation]);

  return (
    <section style={{ display: "grid", gap: 14 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          alignItems: "center",
          flexWrap: "wrap"
        }}
      >
        <div style={{ display: "grid", gap: 4 }}>
          <strong style={{ fontSize: 18 }}>Need more than the quick breakdown?</strong>
          <span style={{ color: "var(--muted)", lineHeight: 1.6 }}>
            Generate a longer explanation with more context, practical takeaways, and unknowns.
          </span>
        </div>
        <button
          className={explanation ? "secondary-button" : "primary-button"}
          type="button"
          onClick={() => void loadDetailedExplanation()}
          disabled={isLoading}
          style={{
            width: "fit-content",
            padding: "12px 18px",
            background: explanation ? "var(--surface-plain)" : "linear-gradient(135deg, #1fa85f 0%, #42f79a 100%)",
            color: explanation ? "var(--ink)" : "#031109",
            font: "inherit",
            fontWeight: 600,
            cursor: isLoading ? "progress" : "pointer",
            boxShadow: explanation ? "var(--glow)" : "0 14px 30px rgba(54, 227, 138, 0.18)"
          }}
        >
          {isLoading ? "Generating..." : explanation ? "Regenerate detailed explanation" : "Detailed explanation"}
        </button>
      </div>

      {error ? (
        <div
          style={{
            padding: 14,
            borderRadius: 16,
            border: "1px solid rgba(255, 110, 110, 0.18)",
            background: "rgba(35, 10, 10, 0.92)",
            color: "#ff9898"
          }}
        >
          {error}
        </div>
      ) : null}

      {explanation ? <DetailedExplanationBlock explanation={explanation} /> : null}
    </section>
  );
}
