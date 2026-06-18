import { describe, it, expect } from "vitest";
import * as buildPlanModule from "../build-plan.js";
import * as clampPlanModule from "../clamp-plan.js";
import * as validatorModule from "../plan-validator.js";
import * as replayModule from "../plan-replay.js";
import { readFileSync } from "fs";
import { join } from "path";

describe("P6.2 - V5 Purity", () => {
  it("should not contain any forbidden I/O or global calls in source files", () => {
    const files = [
      "voice-contract.ts",
      "build-plan.ts",
      "clamp-plan.ts",
      "plan-validator.ts",
      "plan-replay.ts"
    ];

    const forbiddenPatterns = [
      "Date.now()",
      "Math.random()",
      "setTimeout",
      "fetch(",
      "WebSocket",
      "console.log",
    ];

    for (const file of files) {
      const content = readFileSync(join(__dirname, "..", file), "utf-8");
      
      for (const pattern of forbiddenPatterns) {
        expect(content).not.toContain(pattern);
      }
    }
  });
  
  it("exports pure functions", () => {
    expect(typeof buildPlanModule.buildVoicePlan).toBe("function");
    expect(typeof clampPlanModule.clampVoicePlan).toBe("function");
    expect(typeof validatorModule.validateVoicePlan).toBe("function");
    expect(typeof replayModule.serializePlan).toBe("function");
    expect(typeof replayModule.deserializePlan).toBe("function");
  });
});
