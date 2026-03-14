import { NextResponse } from "next/server";
import { listSavedItems } from "@/server/saved/saved-store";

export async function GET() {
  const items = await listSavedItems();
  return NextResponse.json({ items });
}
