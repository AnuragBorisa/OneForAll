import { getItemDetail } from "@/server/detail/get-item-detail";
import { closeDb } from "@/server/db/client";

async function main() {
  const itemIds = process.argv.slice(2);

  if (itemIds.length === 0) {
    console.error("Usage: tsx scripts/ingest/reprocess-items.ts <itemId> [itemId...]");
    process.exit(1);
  }

  const results = await Promise.all(itemIds.map((itemId) => getItemDetail(itemId)));
  console.log(JSON.stringify(results, null, 2));
  await closeDb();
}

main().catch((error) => {
  console.error("Item reprocessing failed", error);
  process.exit(1);
});
