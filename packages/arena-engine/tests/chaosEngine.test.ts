import { describe, it, expect } from "vitest";
import { ChaosEngine } from "@/chaos/ChaosEngine";
import { FakeInfra } from "@/testing/FakeInfra";

describe("ChaosEngine", () => {
  it("should inject faults deterministically", async () => {
    const infra = new FakeInfra();

    const engine = new ChaosEngine({
      enabled: true,
      mode: "INFRASTRUCTURE_BLAST",
      intensity: 1,
      seed: 1234,
      injectedLatencyMs: 10 // small timeout for testing
    }, infra);

    const actualOperation = async () => "success";
    const assertMitigation = async () => "mitigated";

    const resultPromise = engine.executeChaosExperiment(
      "OpenAI",
      "TIMEOUT",
      "synthetic_tester",
      actualOperation,
      assertMitigation
    );

    await Promise.resolve();
    infra.timer.runAll();

    const result = await resultPromise;

    expect(result).toBe("mitigated");
    expect(infra.metrics.getCounter("trajectoire_chaos_faults_injected_total")).toBe(1);
    expect(infra.defaultLogger.logs.length).toBeGreaterThan(0);
    expect(infra.tracer.traces).toContain("chaos_simulation_openai_timeout");
  });

  it("should inject the same fault for same seed", () => {
    const infra1 = new FakeInfra(123);
    const infra2 = new FakeInfra(123);

    const engine1 = new ChaosEngine({
      enabled: true,
      mode: "ORDER_CORRUPTION",
      intensity: 1
    }, infra1);

    const engine2 = new ChaosEngine({
      enabled: true,
      mode: "ORDER_CORRUPTION",
      intensity: 1
    }, infra2);

    const event1 = engine1.apply({ id: "1" });
    const event2 = engine2.apply({ id: "1" });

    expect(event1).toEqual(event2);
  });
});
