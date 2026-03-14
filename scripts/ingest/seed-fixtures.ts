import { readFile } from "node:fs/promises";
import path from "node:path";

async function main() {
  const sourcePath = path.join(process.cwd(), "tests/fixtures/source-items.json");
  const explanationPath = path.join(process.cwd(), "tests/fixtures/explanation-eval.json");

  const [sourceItems, explanationEval] = await Promise.all([
    readFile(sourcePath, "utf8"),
    readFile(explanationPath, "utf8")
  ]);

  console.log(
    JSON.stringify(
      {
        sourceItems: JSON.parse(sourceItems),
        explanationEvaluation: JSON.parse(explanationEval)
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error("Fixture seeding failed", error);
  process.exit(1);
});
