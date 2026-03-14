import { NextResponse } from "next/server";
import { getOrCreateDetailedExplanation } from "@/server/detail/get-item-detail";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ itemId: string }> }
) {
  const { itemId } = await params;
  const explanation = await getOrCreateDetailedExplanation(itemId);

  if (!explanation) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ explanation });
}
