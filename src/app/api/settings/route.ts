import { NextResponse } from "next/server";
import { updateSettings, type SettingsKey } from "@/server/settings/settings";

const ALLOWED_KEYS: SettingsKey[] = [
  "openaiApiBaseUrl",
  "openaiApiKey",
  "openaiModel",
  "rssFeedUrls",
  "redditSubreddits",
  "redditUserAgent",
  "youtubeChannelIds",
  "youtubeFeedUrls",
  "xBearerToken",
  "xSearchQuery",
  "xMaxResults",
  "refreshJobToken"
];

export async function POST(request: Request) {
  const formData = await request.formData();
  const updates = Object.fromEntries(
    ALLOWED_KEYS.map((key) => [key, String(formData.get(key) ?? "")])
  ) as Partial<Record<SettingsKey, string>>;

  await updateSettings(updates);

  const redirectUrl = new URL("/settings?saved=1", request.url);
  return NextResponse.redirect(redirectUrl, { status: 303 });
}
