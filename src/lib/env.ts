import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_API_BASE_URL: z.string().url().default("https://api.openai.com/v1"),
  OPENAI_MODEL: z.string().default("gpt-4.1-mini"),
  X_BEARER_TOKEN: z.string().optional(),
  REDDIT_CLIENT_ID: z.string().optional(),
  REDDIT_CLIENT_SECRET: z.string().optional(),
  REDDIT_USER_AGENT: z.string().default("ai-feed-dev"),
  REDDIT_SUBREDDITS: z.string().default("singularity,artificial,LocalLLaMA"),
  YOUTUBE_API_KEY: z.string().optional(),
  YOUTUBE_CHANNEL_IDS: z.string().default(""),
  YOUTUBE_FEED_URLS: z.string().default(""),
  RSS_FEED_URLS: z.string().default(""),
  RSS_FETCH_LIMIT: z.coerce.number().int().positive().default(25),
  INGEST_HTTP_TIMEOUT_MS: z.coerce.number().int().positive().default(15000),
  DEFAULT_USER_ID: z.string().default("local-user"),
  X_SEARCH_QUERY: z.string().default("AI OR LLM OR agent"),
  X_MAX_RESULTS: z.coerce.number().int().min(10).max(100).default(25),
  REFRESH_JOB_TOKEN: z.string().optional(),
  APP_BASE_URL: z.string().url().default("http://localhost:3000"),
  ADMIN_PASSWORD: z.string().optional()
});

export type AppEnv = z.infer<typeof envSchema>;

function readDotEnvFile(): Record<string, string> {
  const envPath = path.join(process.cwd(), ".env");

  if (!existsSync(envPath)) {
    return {};
  }

  return readFileSync(envPath, "utf8")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith("#"))
    .reduce<Record<string, string>>((accumulator, line) => {
      const separatorIndex = line.indexOf("=");

      if (separatorIndex === -1) {
        return accumulator;
      }

      const key = line.slice(0, separatorIndex).trim();
      const value = line.slice(separatorIndex + 1).trim();
      accumulator[key] = value;
      return accumulator;
    }, {});
}

export function getEnv(input: NodeJS.ProcessEnv = process.env): AppEnv {
  return envSchema.parse({
    ...readDotEnvFile(),
    ...input
  });
}
