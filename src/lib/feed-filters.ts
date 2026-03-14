export interface FeedFilters {
  source?: string | null;
  topic?: string | null;
}

export function parseFeedFilters(searchParams: URLSearchParams): FeedFilters {
  return {
    source: searchParams.get("source"),
    topic: searchParams.get("topic")
  };
}

export function buildFilterHref(pathname: string, filters: FeedFilters): string {
  const params = new URLSearchParams();

  if (filters.source) {
    params.set("source", filters.source);
  }

  if (filters.topic) {
    params.set("topic", filters.topic);
  }

  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}
