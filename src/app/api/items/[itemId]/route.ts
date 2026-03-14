import { NextResponse } from "next/server";
import { getItemDetail } from "@/server/detail/get-item-detail";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ itemId: string }> }
) {
  const { itemId } = await params;
  const detail = await getItemDetail(itemId);

  if (!detail) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(detail);
}
