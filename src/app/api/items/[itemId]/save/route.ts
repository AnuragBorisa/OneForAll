import { NextResponse } from "next/server";
import { saveItem } from "@/server/saved/saved-store";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ itemId: string }> }
) {
  const { itemId } = await params;
  const result = await saveItem(itemId);

  if (!result.saved) {
    return NextResponse.json({ error: "Feed item not found" }, { status: 404 });
  }

  const referer = request.headers.get("referer");
  const redirectUrl = referer ? new URL(referer) : new URL("/saved", request.url);

  return NextResponse.redirect(redirectUrl, { status: 303 });
}
