import { describe, it, expect } from "vitest";
import { runScenario } from "@/scenario/runScenario";
import { IRuntimeOrchestrator } from "@/ports/IOrchestrator";

describe("runScenario", () => {
  it("should execute deterministically with injected orchestrator", async () => {
    let processedCount = 0;
    const fakeOrchestrator: IRuntimeOrchestrator = {
      process: async (event) => {
        processedCount++;
        return event;
      }
    };

    const limit = 10;
    const fakeClock = { now: () => 1000 };
    const result = await runScenario(fakeClock, fakeOrchestrator, limit);

    expect(result).toBeDefined();
    expect(result.length).toBe(limit);
    expect(processedCount).toBe(limit);
  });
});
