import { NextResponse } from "next/server";
import { getFeed } from "@/server/ranking/get-feed";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const source = url.searchParams.get("source");
  const topic = url.searchParams.get("topic");
  const items = await getFeed({ source, topic });

  return NextResponse.json({
    items,
    nextCursor: null
  });
}
