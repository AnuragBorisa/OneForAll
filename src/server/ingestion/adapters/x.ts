import type { SourceAdapter, SourceAdapterFetchInput, SourceFetchResult } from "@/server/ingestion/adapters/types";
import { getRuntimeSettings } from "@/server/settings/settings";
import type { SourceItem } from "@/types/feed";

interface XSearchResponse {
  data?: Array<{
    id: string;
    text: string;
    author_id?: string;
    created_at?: string;
    note_tweet?: {
      text?: string;
    };
    context_annotations?: Array<{
      entity?: {
        name?: string;
      };
    }>;
    public_metrics?: {
      like_count?: number;
      retweet_count?: number;
      reply_count?: number;
    };
  }>;
  includes?: {
    users?: Array<{
      id: string;
      name?: string;
      username?: string;
    }>;
  };
}

function buildUserMap(response: XSearchResponse): Map<string, { name?: string; username?: string }> {
  return new Map((response.includes?.users ?? []).map((user) => [user.id, { name: user.name, username: user.username }]));
}

export class XAdapter implements SourceAdapter {
  source = "x" as const;

  async fetchLatest(input: SourceAdapterFetchInput): Promise<SourceFetchResult> {
    const settings = await getRuntimeSettings();

    if (!settings.xBearerToken) {
      return { sourceItems: [] };
    }

    const url = new URL("https://api.x.com/2/tweets/search/recent");
    const maxResults = Number(settings.xMaxResults || "25");
    url.searchParams.set("query", settings.xSearchQuery || "AI OR LLM OR agent");
    url.searchParams.set("max_results", String(Math.min(input.limit ?? maxResults, maxResults)));
    url.searchParams.set("tweet.fields", "created_at,author_id,note_tweet,context_annotations,public_metrics");
    url.searchParams.set("expansions", "author_id");
    url.searchParams.set("user.fields", "name,username");

    if (input.since) {
      url.searchParams.set("start_time", input.since.toISOString());
    }

    const response = await fetch(url, {
      signal: AbortSignal.timeout(15000),
      headers: {
        Authorization: `Bearer ${settings.xBearerToken}`
      }
    });

    if (!response.ok) {
      throw new Error(`X fetch failed with ${response.status}`);
    }

    const payload = (await response.json()) as XSearchResponse;
    const userMap = buildUserMap(payload);
    const fetchedAt = new Date().toISOString();

    const sourceItems: SourceItem[] = (payload.data ?? []).map((tweet) => {
      const user = tweet.author_id ? userMap.get(tweet.author_id) : undefined;
      const enrichedText = [
        tweet.note_tweet?.text ?? tweet.text,
        ...(tweet.context_annotations ?? [])
          .map((annotation) => annotation.entity?.name)
          .filter(Boolean)
      ]
        .join("\n")
        .trim();

      return {
        id: `x-${tweet.id}`,
        source: "x",
        sourceItemId: tweet.id,
        sourceUrl: user?.username
          ? `https://x.com/${user.username}/status/${tweet.id}`
          : `https://x.com/i/web/status/${tweet.id}`,
        authorName: user?.name ?? null,
        authorHandle: user?.username ? `@${user.username}` : null,
        publishedAt: tweet.created_at ?? null,
        fetchedAt,
        title: (tweet.note_tweet?.text ?? tweet.text).slice(0, 100),
        rawText: enrichedText,
        rawPayload: tweet,
        mediaRefs: [],
        engagementSignals: {
          likes: tweet.public_metrics?.like_count ?? null,
          reposts: tweet.public_metrics?.retweet_count ?? null,
          replies: tweet.public_metrics?.reply_count ?? null
        },
        fetchStatus: "fetched"
      };
    });

    return {
      sourceItems
    };
  }
}
