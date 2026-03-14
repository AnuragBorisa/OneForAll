import { buildDailyDigest } from "@/server/digests/build-daily-digest";
import { closeDb } from "@/server/db/client";
import { renderWhatsAppDigest } from "@/server/digests/render-whatsapp-digest";

async function main() {
  const digest = await buildDailyDigest();

  console.log(
    JSON.stringify(
      {
        digest,
        whatsapp: renderWhatsAppDigest(digest)
      },
      null,
      2
    )
  );
  await closeDb();
}

main().catch((error) => {
  console.error("Digest rerun failed", error);
  process.exit(1);
});
