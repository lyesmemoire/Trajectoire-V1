import { spawnSync } from "child_process";
import http from "http";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

// Helper to fetch Prometheus metrics and return raw text
async function fetchMetrics(): Promise<string> {
  return new Promise((resolve, reject) => {
    http.get("http://localhost:3000/metrics", (res) => {
      let data = "";
      res.setEncoding("utf8");
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve(data));
    }).on("error", reject);
  });
}

// Simple Prometheus text → map parser (ignores comments and HELP/TYPE lines)
function parsePrometheus(text: string): Record<string, number> {
  const metrics: Record<string, number> = {};
  const lines = text.split(/\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue; // skip comments
    const [name, value] = trimmed.split(/\s+/);
    if (name && value && !isNaN(Number(value))) {
      metrics[name] = Number(value);
    }
  }
  return metrics;
}

type Mode = "normal" | "guard" | "replay" | "stress" | "circuit" | "pressure";

type ModeResult = {
  mode: Mode;
  events: number;
  durationMs: number;
  exitCode: number;
};

interface CertificationSnapshot {
  runId: string;
  timestamp: number;
  modes: Record<Mode, ModeResult>;
  metrics: {
    rawPrometheus: string;
    parsed: Record<string, number>;
  };
  memory: {
    leakSeries: number[]; // placeholder – can be filled later if needed
    maxGrowthPct: number;
  };
}

async function main() {
  const runId = uuidv4();
  const timestamp = Date.now();
  const modeList: Mode[] = ["normal", "guard", "replay", "stress", "circuit", "pressure"];
  const modesResult: Record<Mode, ModeResult> = {} as unknown;
  let aggregatedMetricsRaw = "";
  let aggregatedMetricsParsed: Record<string, number> = {};

  for (const mode of modeList) {
    // Execute harness as a child process (sync) to capture stdout and exit code
    const proc = spawnSync("tsx", ["scripts/runtime-harness.ts", mode], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
    const stdout = proc.stdout?.toString().trim() ?? "";
    const exitCode = proc.status ?? (proc.error as unknown)?.code ?? 1;
    let parsed: unknown = {};
    try {
      parsed = JSON.parse(stdout);
    } catch (error) {
      console.error(`Failed to parse harness output for mode ${mode}:`, e);
    }
    modesResult[mode] = {
      mode,
      events: parsed.events ?? 0,
      durationMs: parsed.durationMs ?? 0,
      exitCode,
    };

    // Fetch and parse Prometheus metrics after each run
    try {
      const raw = await fetchMetrics();
      const parsedMetrics = parsePrometheus(raw);
      // Keep the raw text of the *last* fetch (full snapshot) – sufficient because metrics are cumulative
      aggregatedMetricsRaw = raw;
      // Merge parsed metrics (later runs may overwrite earlier counters, which is fine for cumulative view)
      aggregatedMetricsParsed = { ...aggregatedMetricsParsed, ...parsedMetrics };
    } catch (error) {
      console.warn(`Unable to fetch metrics after mode ${mode}:`, e);
    }
  }

  // Memory leak series – placeholder (could be populated from a dedicated metric if needed)
  const memory = {
    leakSeries: [],
    maxGrowthPct: 0,
  };

  const snapshot: CertificationSnapshot = {
    runId,
    timestamp,
    modes: modesResult,
    metrics: {
      rawPrometheus: aggregatedMetricsRaw,
      parsed: aggregatedMetricsParsed,
    },
    memory,
  };

  fs.writeFileSync("certification-snapshot.json", JSON.stringify(snapshot, null, 2));
  console.log("✅ Certification snapshot written → certification-snapshot.json");
}

main();
