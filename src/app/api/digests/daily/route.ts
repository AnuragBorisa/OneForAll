import { NextResponse } from "next/server";
import { buildDailyDigest } from "@/server/digests/build-daily-digest";

export async function GET() {
  return NextResponse.json(await buildDailyDigest());
}
