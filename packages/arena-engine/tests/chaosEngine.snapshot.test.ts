import { describe, it, expect } from "vitest";
import { ChaosEngine } from "../src/chaos/ChaosEngine";
import { runWithTrace } from "./helpers/runWithTrace";

describe("ChaosEngine Snapshot Replay", () => {
  it("should produce stable execution trace for seed 42 (ORDER_CORRUPTION)", async () => {
    const trace = await runWithTrace(
      (infra) =>
        new ChaosEngine({
          enabled: true,
          mode: "ORDER_CORRUPTION",
          intensity: 1
        }, infra),
      (engine) => engine.apply({ type: "HTTP_EVENT", payload: { value: 10 } }),
      42
    );

    expect(trace).toMatchSnapshot();
  });

  it("should produce stable execution trace for seed 42 (executeChaosExperiment)", async () => {
    const trace = await runWithTrace(
      (infra) =>
        new ChaosEngine({
          enabled: true,
          mode: "INFRASTRUCTURE_BLAST",
          intensity: 1,
          injectedLatencyMs: 5
        }, infra),
      async (engine, infra) => {
        const promise = engine.executeChaosExperiment(
          "OpenAI",
          "TIMEOUT",
          "synthetic_tester",
          async () => "success",
          async () => "mitigated"
        );
        await Promise.resolve();
        infra.timer.runAll();
        return await promise;
      },
      42
    );

    expect(trace).toMatchSnapshot();
  });
});
