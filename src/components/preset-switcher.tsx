"use client";

import { usePathname, useSearchParams } from "next/navigation";
import type { ContentPresetId } from "@/server/settings/presets";

export function PresetSwitcher({
  activePreset,
  compact = false
}: {
  activePreset: ContentPresetId;
  compact?: boolean;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.toString();
  const next = query ? `${pathname}?${query}` : pathname;

  return (
    <div style={{ display: "inline-flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
      {[
        { id: "ai", label: "AI" },
        { id: "quantum", label: "Quantum" }
      ].map((option) => (
        <form key={option.id} action="/api/preset" method="post">
          <input type="hidden" name="preset" value={option.id} />
          <input type="hidden" name="next" value={next} />
          <button
            type="submit"
            className={`preset-toggle ${activePreset === option.id ? "is-active" : ""} ${compact ? "is-compact" : ""}`}
          >
            {option.label}
          </button>
        </form>
      ))}
    </div>
  );
}
