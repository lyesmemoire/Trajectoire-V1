// @ts-nocheck
import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";
import { createRuntime } from "../runtime-container.js";

describe("P6.6 - W5 Infrastructure Purity", () => {
  it("should not inject any network logic into the core", () => {
    // Only the infrastructure layer has STT/TTS and WebSocket mentions
    const coreP6Files = ["orchestrator/runtime-orchestrator.ts"];
    
    for (const file of coreP6Files) {
      const content = readFileSync(join(__dirname, "../../../../../core/p6", file), "utf-8");
      
      expect(content).not.toContain("WebSocket");
      expect(content).not.toContain("TTS");
      expect(content).not.toContain("STT");
      expect(content).not.toContain("fetch(");
    }
  });

  it("should be able to instantiate the runtime completely decoupled from the network", () => {
    const container = createRuntime();
    expect(container).toBeDefined();
    expect(container.orchestrator).toBeDefined();
  });
});
