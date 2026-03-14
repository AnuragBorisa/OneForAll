import type { SourceAdapter, SourceAdapterFetchInput, SourceFetchResult } from "@/server/ingestion/adapters/types";
import { getRuntimeSettings } from "@/server/settings/settings";
import type { SourceItem } from "@/types/feed";

interface RedditListing {
  data?: {
    children?: Array<{
      data?: {
        id?: string;
        title?: string;
        selftext?: string;
        permalink?: string;
        author?: string;
        created_utc?: number;
        ups?: number;
        num_comments?: number;
        url?: string;
      };
    }>;
  };
}

interface RedditPost {
  id?: string;
  title?: string;
  selftext?: string;
  permalink?: string;
  author?: string;
  created_utc?: number;
  ups?: number;
  num_comments?: number;
  url?: string;
}

function parseSubreddits(subreddits: string): string[] {
  return subreddits
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

function buildRichPostText(post: RedditPost, comments: RedditPost[]): string {
  const parts = [
    post.selftext?.trim(),
    ...comments.map((comment) => comment.selftext?.trim())
  ]
    .filter(Boolean)
    .slice(0, 4);

  return parts.join("\n\n").trim() || post.title || "";
}

function toSourceItem(subreddit: string, post: RedditPost | undefined, fetchedAt: string): SourceItem | null {
  if (!post?.id || !post?.permalink) {
    return null;
  }

  return {
    id: `reddit-${subreddit}-${post.id}`,
    source: "reddit",
    sourceItemId: `${subreddit}-${post.id}`,
    sourceUrl: `https://www.reddit.com${post.permalink}`,
    authorName: post.author ?? null,
    authorHandle: post.author ? `u/${post.author}` : null,
    publishedAt: post.created_utc ? new Date(post.created_utc * 1000).toISOString() : null,
    fetchedAt,
    title: post.title ?? null,
    rawText: post.selftext || post.title || null,
    rawPayload: {
      subreddit,
      id: post.id,
      permalink: post.permalink,
      outboundUrl: post.url ?? null
    },
    mediaRefs: [],
    engagementSignals: {
      upvotes: post.ups ?? null,
      comments: post.num_comments ?? null
    },
    fetchStatus: "fetched"
  };
}

export class RedditAdapter implements SourceAdapter {
  source = "reddit" as const;

  async fetchLatest(input: SourceAdapterFetchInput): Promise<SourceFetchResult> {
    const settings = await getRuntimeSettings();
    const subreddits = parseSubreddits(settings.redditSubreddits);

    if (subreddits.length === 0) {
      return { sourceItems: [] };
    }

    const fetchedAt = new Date().toISOString();
    const settled = await Promise.allSettled(
      subreddits.map(async (subreddit) => {
        const url = `https://www.reddit.com/r/${encodeURIComponent(subreddit)}/new.json?limit=${input.limit ?? 25}`;
        const response = await fetch(url, {
          signal: AbortSignal.timeout(15000),
          headers: {
            "User-Agent": settings.redditUserAgent || "ai-feed-dev"
          }
        });

        if (!response.ok) {
          throw new Error(`Reddit fetch failed for ${subreddit} with ${response.status}`);
        }

        const payload = (await response.json()) as RedditListing;
        const posts = payload.data?.children ?? [];
        const enrichedPosts = await Promise.all(
          posts.map(async (child) => {
            const permalink = child.data?.permalink;

            if (!permalink) {
              return child.data;
            }

            try {
              const detailResponse = await fetch(`https://www.reddit.com${permalink}.json?limit=3`, {
                signal: AbortSignal.timeout(15000),
                headers: {
                  "User-Agent": settings.redditUserAgent || "ai-feed-dev"
                }
              });

              if (!detailResponse.ok) {
                return child.data;
              }

              const detailPayload = (await detailResponse.json()) as Array<RedditListing>;
              const postData = detailPayload[0]?.data?.children?.[0]?.data ?? child.data;
              const commentData =
                detailPayload[1]?.data?.children
                  ?.map((entry) => entry.data)
                  .filter(Boolean)
                  .slice(0, 3) ?? [];

              return {
                ...postData,
                selftext: buildRichPostText(postData ?? {}, commentData as RedditPost[])
              };
            } catch {
              return child.data;
            }
          })
        );

        return {
          subreddit,
          posts: enrichedPosts
        };
      })
    );

    const sourceItems = settled
      .flatMap((result) => (result.status === "fulfilled" ? [result.value] : []))
      .flatMap(({ subreddit, posts }) =>
        posts
          .map((post) => toSourceItem(subreddit, post, fetchedAt))
          .filter((item): item is SourceItem => Boolean(item))
      )
      .filter((item) => !input.since || !item.publishedAt || new Date(item.publishedAt) >= input.since)
      .sort((left, right) => new Date(right.publishedAt ?? right.fetchedAt).getTime() - new Date(left.publishedAt ?? left.fetchedAt).getTime());

    return {
      sourceItems: sourceItems.slice(0, input.limit ?? 25)
    };
  }
}
