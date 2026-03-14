"use client";

import { useState } from "react";

export function RefreshButton() {
  const [status, setStatus] = useState<"idle" | "running" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleRefresh() {
    setStatus("running");
    setMessage("Refreshing sources...");

    try {
      const response = await fetch("/api/jobs/refresh", {
        method: "POST"
      });

      if (!response.ok) {
        throw new Error(`Refresh failed with ${response.status}`);
      }

      const payload = (await response.json()) as {
        pipeline: { normalizedItems: number };
        digestEntries: number;
      };

      setStatus("done");
      setMessage(`Refreshed ${payload.pipeline.normalizedItems} items and ${payload.digestEntries} digest entries.`);
      window.location.reload();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Refresh failed.");
    }
  }

  return (
    <div style={{ display: "grid", gap: 8 }}>
      <button
        className="primary-button"
        type="button"
        onClick={handleRefresh}
        disabled={status === "running"}
        style={{
          width: "fit-content",
          padding: "12px 18px",
          borderRadius: 999,
          border: "1px solid var(--border)",
          background:
            status === "running"
              ? "rgba(54, 227, 138, 0.12)"
              : "linear-gradient(135deg, #1fa85f 0%, #42f79a 100%)",
          color: status === "running" ? "var(--accent-strong)" : "#031109",
          font: "inherit",
          fontWeight: 700,
          cursor: status === "running" ? "progress" : "pointer",
          boxShadow: "0 14px 30px rgba(54, 227, 138, 0.18)"
        }}
      >
        {status === "running" ? "Refreshing..." : "Refresh feed"}
      </button>
      {message ? <span style={{ fontSize: 13, color: "var(--muted)" }}>{message}</span> : null}
    </div>
  );
}
