import { describe, it, expect } from "vitest";
import { ChaosEngine } from "../../src/chaos/ChaosEngine";
import { FakeInfra } from "../../src/testing/FakeInfra";
import { runBenchmark } from "../helpers/runBenchmark";

function assertRegression(current: number, baseline: number) {
  const delta = (current - baseline) / baseline;
  if (delta > 0.2) {
    throw new Error(
      `Performance regression detected: +${(delta * 100).toFixed(2)}%`
    );
  }
}

describe("ChaosEngine Performance", () => {
  it("should execute 10k deterministic runs efficiently", async () => {
    const infra = new FakeInfra(42);

    const engine = new ChaosEngine({
      enabled: true,
      mode: "INFRASTRUCTURE_BLAST",
      intensity: 1,
      injectedLatencyMs: 0 // Pur CPU
    }, infra);

    const result = await runBenchmark(
      "Chaos TIMEOUT",
      async () => {
        await engine.executeChaosExperiment(
          "OpenAI",
          "TIMEOUT",
          "synthetic_benchmark",
          async () => "success",
          async () => "mitigated"
        );
      },
      10000
    );

    console.log("[BENCHMARK RESULTS]", result);

    // Initial loose assertion just to see where we stand
    expect(result.avgMs).toBeLessThan(0.2);
  });
});
