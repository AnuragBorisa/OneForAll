import type { SourceAdapter } from "@/server/ingestion/adapters/types";
import { RedditAdapter } from "@/server/ingestion/adapters/reddit";
import { RssAdapter } from "@/server/ingestion/adapters/rss";
import { YouTubeAdapter } from "@/server/ingestion/adapters/youtube";
import { XAdapter } from "@/server/ingestion/adapters/x";

export function buildDefaultAdapters(): SourceAdapter[] {
  return [new RssAdapter(), new YouTubeAdapter(), new RedditAdapter(), new XAdapter()];
}
