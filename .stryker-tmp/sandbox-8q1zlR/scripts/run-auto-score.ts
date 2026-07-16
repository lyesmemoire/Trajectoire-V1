// @ts-nocheck
import fs from "fs";
import { AutoScorer } from "../src/scoring/AutoScorer";

function loadJSON(path: string) {
  return JSON.parse(fs.readFileSync(path, "utf-8"));
}

function main() {
  const metrics = loadJSON("certification-snapshot.json").metrics.parsed;
  const faultTrace = loadJSON("fault-trace.json")[0]?.telemetry;

  const scorer = new AutoScorer();
  const result = scorer.score({
    metrics,
    faultTrace,
  });

  fs.writeFileSync(
    "certification-score.json",
    JSON.stringify(result, null, 2)
  );

  console.log("🏁 Auto Score Complete:", result);
}

main();
