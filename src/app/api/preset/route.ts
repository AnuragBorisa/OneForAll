import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { isContentPresetId } from "@/server/settings/presets";
import { VIEW_PRESET_COOKIE } from "@/server/settings/view-preset";

function getRedirectUrl(nextPath: string, requestUrl: string) {
  return new URL(nextPath.startsWith("/") ? nextPath : "/", requestUrl);
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const preset = String(formData.get("preset") ?? "");
  const next = String(formData.get("next") ?? "/");

  if (!isContentPresetId(preset)) {
    return NextResponse.redirect(getRedirectUrl(next, request.url), { status: 303 });
  }

  const cookieStore = await cookies();
  cookieStore.set(VIEW_PRESET_COOKIE, preset, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365
  });

  return NextResponse.redirect(getRedirectUrl(next, request.url), { status: 303 });
}
