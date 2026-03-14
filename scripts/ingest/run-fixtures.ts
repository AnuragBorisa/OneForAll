import { closeDb } from "@/server/db/client";
import { buildDefaultAdapters } from "@/server/ingestion/adapters/registry";
import { runPipeline } from "@/server/ingestion/jobs/run-pipeline";

async function main() {
  const adapters = buildDefaultAdapters();
  const result = await runPipeline({ adapters });

  console.log(JSON.stringify(result, null, 2));
  await closeDb();
}

main().catch(async (error) => {
  console.error("Fixture ingestion failed", error);
  await closeDb();
  process.exit(1);
});
