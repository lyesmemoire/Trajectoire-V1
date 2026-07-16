// @ts-nocheck
import { execSync } from "child_process";
import fs from "fs";
import http from "http";

type Mode = "normal" | "guard" | "replay" | "stress" | "circuit" | "pressure";

type Result = {
  mode: Mode;
  data: any;
};

function runHarness(mode: Mode): Result {
  console.log(`▶ Running harness mode: ${mode}`);
  // Run the harness and wait for it to finish (inherit stdio shows output).
  execSync(`npm run harness -- ${mode}`, { stdio: "inherit" });

  const summaryFile = `runtime-${mode}-summary.json`;
  if (!fs.existsSync(summaryFile)) {
    throw new Error(`Missing summary file ${summaryFile}`);
  }
  const data = JSON.parse(fs.readFileSync(summaryFile, "utf-8"));
  return { mode, data };
}

function fetchMetrics(): Promise<string> {
  return new Promise((resolve, reject) => {
    http.get("http://localhost:3000/metrics", (res) => {
      let raw = "";
      res.setEncoding("utf8");
      res.on("data", (chunk) => (raw += chunk));
      res.on("end", () => resolve(raw));
    }).on("error", reject);
  });
}

async function main() {
  const modes: Mode[] = ["normal", "guard", "replay", "stress", "circuit", "pressure"];
  const results: Result[] = [];

  for (const mode of modes) {
    const result = runHarness(mode);
    results.push(result);
    // After the harness finishes, scrape Prometheus metrics.
    try {
      const rawMetrics = await fetchMetrics();
      const metricsFile = `metrics-${mode}.txt`;
      fs.writeFileSync(metricsFile, rawMetrics);
      console.log(`🪙 Metrics snapshot saved → ${metricsFile}`);
    } catch (e) {
      console.warn(`⚠️ Could not fetch metrics after mode ${mode}:`, e);
    }
  }

  // Optional memory‑leak report collection.
  const memReport = "memory-leak-report.json";
  if (fs.existsSync(memReport)) {
    const memData = JSON.parse(fs.readFileSync(memReport, "utf-8"));
    results.push({ mode: "memory" as any, data: memData });
  }

  fs.writeFileSync("certification-summary.json", JSON.stringify(results, null, 2));
  console.log("✅ Certification runner completed – summary written to certification-summary.json");
}

main();
