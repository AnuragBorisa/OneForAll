import { desc, eq } from "drizzle-orm";
import { getEnv } from "@/lib/env";
import { getDb } from "@/server/db/client";
import { appSettings } from "@/server/db/schema/feed";
import { getContentPreset, type ContentPresetId } from "@/server/settings/presets";

export const SETTINGS_KEYS = [
  "contentPreset",
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
] as const;

export type SettingsKey = (typeof SETTINGS_KEYS)[number];

export interface RuntimeSettings {
  contentPreset: string;
  openaiApiBaseUrl: string;
  openaiApiKey: string;
  openaiModel: string;
  rssFeedUrls: string;
  redditSubreddits: string;
  redditUserAgent: string;
  youtubeChannelIds: string;
  youtubeFeedUrls: string;
  xBearerToken: string;
  xSearchQuery: string;
  xMaxResults: string;
  refreshJobToken: string;
}

const DEFAULT_RUNTIME_SETTINGS = {
  contentPreset: "ai",
  openaiApiBaseUrl: "",
  openaiApiKey: "",
  openaiModel: "",
  rssFeedUrls: "",
  redditSubreddits: "",
  redditUserAgent: "",
  youtubeChannelIds: "",
  youtubeFeedUrls: "",
  xBearerToken: "",
  xSearchQuery: "",
  xMaxResults: "",
  refreshJobToken: ""
} satisfies RuntimeSettings;

function fromEnv(): RuntimeSettings {
  const env = getEnv();

  return {
    contentPreset: "ai",
    openaiApiBaseUrl: env.OPENAI_API_BASE_URL,
    openaiApiKey: env.OPENAI_API_KEY ?? "",
    openaiModel: env.OPENAI_MODEL,
    rssFeedUrls: env.RSS_FEED_URLS,
    redditSubreddits: env.REDDIT_SUBREDDITS,
    redditUserAgent: env.REDDIT_USER_AGENT,
    youtubeChannelIds: env.YOUTUBE_CHANNEL_IDS,
    youtubeFeedUrls: env.YOUTUBE_FEED_URLS,
    xBearerToken: env.X_BEARER_TOKEN ?? "",
    xSearchQuery: env.X_SEARCH_QUERY,
    xMaxResults: String(env.X_MAX_RESULTS),
    refreshJobToken: env.REFRESH_JOB_TOKEN ?? ""
  };
}

export async function getStoredSettings(): Promise<Partial<RuntimeSettings>> {
  try {
    const db = getDb();
    const rows = await db.select().from(appSettings).orderBy(desc(appSettings.updatedAt));

    return rows.reduce<Partial<RuntimeSettings>>((accumulator, row) => {
      if ((SETTINGS_KEYS as readonly string[]).includes(row.key)) {
        accumulator[row.key as SettingsKey] = row.value ?? "";
      }

      return accumulator;
    }, {});
  } catch {
    return {};
  }
}

export async function getRuntimeSettings(): Promise<RuntimeSettings> {
  const envSettings = fromEnv();
  const storedSettings = await getStoredSettings();
  const merged = {
    ...DEFAULT_RUNTIME_SETTINGS,
    ...envSettings,
    ...storedSettings
  };
  const preset = getContentPreset(merged.contentPreset);

  return {
    ...merged,
    rssFeedUrls: merged.rssFeedUrls || preset.defaults.rssFeedUrls,
    redditSubreddits: merged.redditSubreddits || preset.defaults.redditSubreddits,
    youtubeChannelIds: merged.youtubeChannelIds || preset.defaults.youtubeChannelIds,
    youtubeFeedUrls: merged.youtubeFeedUrls || preset.defaults.youtubeFeedUrls,
    xSearchQuery: merged.xSearchQuery || preset.defaults.xSearchQuery
  };
}

export async function getSetting(key: SettingsKey): Promise<string> {
  const settings = await getRuntimeSettings();
  return settings[key] ?? "";
}

export async function updateSettings(input: Partial<Record<SettingsKey, string>>) {
  const db = getDb();
  const now = new Date();

  const entries = Object.entries(input).filter(
    ([key]) => (SETTINGS_KEYS as readonly string[]).includes(key)
  ) as Array<[SettingsKey, string]>;

  for (const [key, value] of entries) {
    await db
      .insert(appSettings)
      .values({
        key,
        value,
        updatedAt: now
      })
      .onConflictDoUpdate({
        target: appSettings.key,
        set: {
          value,
          updatedAt: now
        }
      });
  }
}

export async function getSettingsForDisplay() {
  let storedRows: Array<typeof appSettings.$inferSelect> = [];

  try {
    const db = getDb();
    storedRows = await db
      .select()
      .from(appSettings)
      .orderBy(desc(appSettings.updatedAt));
  } catch {
    storedRows = [];
  }

  const runtimeSettings = await getRuntimeSettings();

  const storedKeys = new Set(storedRows.map((row) => row.key));

  return SETTINGS_KEYS.map((key) => ({
    key,
    value: runtimeSettings[key],
    source: storedKeys.has(key) ? "database" : "env"
  }));
}

export async function getActivePreset() {
  const settings = await getRuntimeSettings();
  return getContentPreset(settings.contentPreset);
}

export async function applyContentPreset(presetId: ContentPresetId) {
  const preset = getContentPreset(presetId);

  await updateSettings({
    contentPreset: preset.id,
    rssFeedUrls: preset.defaults.rssFeedUrls,
    redditSubreddits: preset.defaults.redditSubreddits,
    youtubeChannelIds: preset.defaults.youtubeChannelIds,
    youtubeFeedUrls: preset.defaults.youtubeFeedUrls,
    xSearchQuery: preset.defaults.xSearchQuery
  });
}

export async function getStoredSettingRow(key: SettingsKey) {
  try {
    const db = getDb();
    const rows = await db.select().from(appSettings).where(eq(appSettings.key, key)).limit(1);
    return rows[0] ?? null;
  } catch {
    return null;
  }
}
