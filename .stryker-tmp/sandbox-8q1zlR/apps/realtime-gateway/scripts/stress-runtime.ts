// @ts-nocheck
import { RuntimeBenchmarkAdapter } from "../src/interview/runtime/benchmark/RuntimeBenchmarkAdapter";
import { RuntimeOrchestrator } from "../src/interview/runtime/fsm/orchestrator/RuntimeOrchestrator";
import fs from "fs";
import { performance } from "perf_hooks";

type BenchmarkResult = {
  events: number;
  durationMs: number;
  avgMsPerEvent: number;
  throughput: number;
};

function generateEvents(count: number) {
  return Array.from({ length: count }).map((_, i) => ({
    id: `evt-${i}`,
    type: "BENCHMARK_EVENT",
    timestamp: Date.now(),
    payload: { index: i },
  }));
}

async function runBenchmark(eventCount: number): Promise<BenchmarkResult> {
  const orchestrator = new RuntimeOrchestrator();
  const adapter = new RuntimeBenchmarkAdapter(orchestrator);

  const events = generateEvents(eventCount);

  const start = performance.now();
  for (const ev of events) {
    await adapter.inject(ev);
  }
  const duration = performance.now() - start;

  return {
    events: eventCount,
    durationMs: duration,
    avgMsPerEvent: duration / eventCount,
    throughput: eventCount / (duration / 1000),
  };
}

async function main() {
  console.log("🔥 Starting runtime benchmark...");

  const small = await runBenchmark(10_000);
  console.log("10k DONE", small);

  const large = await runBenchmark(100_000);
  console.log("100k DONE", large);

  const report = {
    small,
    large,
    timestamp: Date.now(),
  };

  fs.writeFileSync(
    "runtime-benchmark.json",
    JSON.stringify(report, null, 2)
  );
  console.log("📦 Benchmark saved → runtime-benchmark.json");
}

main();
