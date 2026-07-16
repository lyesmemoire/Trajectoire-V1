// @ts-nocheck
import { runScenario } from "../src/scenario/runScenario";
import fs from "fs";
import path from "path";

/**
 * CLI entry point – executes the scenario, writes the trace to ./artifacts/,
 * produces a run manifest, and prints a concise confirmation line.
 */
async function main() {
  const trace = await runScenario();
  if (trace.length === 0) {
    console.error("❌ No trace events produced");
    process.exit(2);
  }

  const runId = trace[0].runId ?? "unknown";
  const artifactsDir = path.resolve(process.cwd(), "artifacts");
  if (!fs.existsSync(artifactsDir)) {
    fs.mkdirSync(artifactsDir, { recursive: true });
  }

  // Write the trace with a run‑id specific name
  const tracePath = path.join(artifactsDir, `trace-${runId}.json`);
  fs.writeFileSync(tracePath, JSON.stringify(trace, null, 2), "utf-8");
  // Also keep a stable name for CI convenience
  const stablePath = path.join(artifactsDir, "trace.json");
  fs.copyFileSync(tracePath, stablePath);

  // Write a minimal run manifest
  const manifest = {
    runId,
    timestamp: Date.now(),
    tickCount: trace.length,
    invariant: null, // will be filled by verifier
  };
  const manifestPath = path.join(artifactsDir, "run.json");
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), "utf-8");

  console.log(`[HARNESS] wrote ${trace.length} TickTrace events → ${tracePath}`);
}

main().catch((err) => {
  console.error("❌ Fatal harness error:", err instanceof Error ? err.stack : err);
  process.exit(1);
});
