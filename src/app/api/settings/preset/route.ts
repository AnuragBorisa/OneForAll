import { NextResponse } from "next/server";
import { applyContentPreset } from "@/server/settings/settings";
import type { ContentPresetId } from "@/server/settings/presets";

function isContentPresetId(value: string): value is ContentPresetId {
  return value === "ai" || value === "quantum";
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const preset = String(formData.get("preset") ?? "");

  if (!isContentPresetId(preset)) {
    return NextResponse.json({ error: "Invalid preset" }, { status: 400 });
  }

  await applyContentPreset(preset);

  const redirectUrl = new URL(`/settings?saved=1&preset=${preset}`, request.url);
  return NextResponse.redirect(redirectUrl, { status: 303 });
}
