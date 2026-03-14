import { NextResponse } from "next/server";
import { getEnv } from "@/lib/env";
import { buildDailyDigest } from "@/server/digests/build-daily-digest";
import { buildDefaultAdapters } from "@/server/ingestion/adapters/registry";
import { runPipeline } from "@/server/ingestion/jobs/run-pipeline";
import { getSetting } from "@/server/settings/settings";

export const dynamic = "force-dynamic";

async function isAuthorized(request: Request): Promise<boolean> {
  const token = (await getSetting("refreshJobToken")) || getEnv().REFRESH_JOB_TOKEN;
  const requestUrl = new URL(request.url);
  const origin = request.headers.get("origin");

  if (origin) {
    const originHost = new URL(origin).host;

    if (originHost === requestUrl.host) {
      return true;
    }
  }

  if (!token) {
    return false;
  }

  return request.headers.get("authorization") === `Bearer ${token}`;
}

export async function POST(request: Request) {
  if (!(await isAuthorized(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const pipeline = await runPipeline({
    adapters: buildDefaultAdapters()
  });
  const digest = await buildDailyDigest();

  return NextResponse.json({
    pipeline,
    digestEntries: digest.entries.length,
    refreshedAt: new Date().toISOString()
  });
}
