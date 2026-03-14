import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/server/auth/admin";
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
  if (!(await isAdminAuthenticated())) {
    return NextResponse.redirect(new URL("/settings?auth=1", request.url), { status: 303 });
  }

  const formData = await request.formData();
  const updates = Object.fromEntries(
    ALLOWED_KEYS.map((key) => [key, String(formData.get(key) ?? "")])
  ) as Partial<Record<SettingsKey, string>>;

  await updateSettings(updates);

  const redirectUrl = new URL("/settings?saved=1", request.url);
  return NextResponse.redirect(redirectUrl, { status: 303 });
}
