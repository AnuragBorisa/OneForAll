import { closeDb } from "@/server/db/client";
import { RssAdapter } from "@/server/ingestion/adapters/rss";
import { runPipeline } from "@/server/ingestion/jobs/run-pipeline";
import { buildDailyDigest } from "@/server/digests/build-daily-digest";

function getWatchIntervalMs(): number | null {
  const watchArg = process.argv.find((value) => value.startsWith("--watch="));

  if (!watchArg) {
    return null;
  }

  const seconds = Number(watchArg.split("=")[1]);

  if (!Number.isFinite(seconds) || seconds <= 0) {
    throw new Error("Watch interval must be a positive number of seconds.");
  }

  return seconds * 1000;
}

async function refreshOnce() {
  const result = await runPipeline({
    adapters: [new RssAdapter()]
  });
  const digest = await buildDailyDigest();

  console.log(JSON.stringify({ pipeline: result, digestEntries: digest.entries.length }, null, 2));
}

async function main() {
  const intervalMs = getWatchIntervalMs();

  if (!intervalMs) {
    await refreshOnce();
    await closeDb();
    return;
  }

  while (true) {
    await refreshOnce();
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
}

main().catch(async (error) => {
  console.error("RSS refresh failed", error);
  await closeDb();
  process.exit(1);
});
