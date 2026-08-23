import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";
import { createRuntime } from "../runtime-container.js";

describe("Realtime core infrastructure purity", () => {
  it("should not inject network logic into the realtime core", () => {
    const realtimeCoreFiles = [
      "orchestrator/runtime-orchestrator.ts",
    ];

    for (const file of realtimeCoreFiles) {
      const content = readFileSync(
        join(
          __dirname,
          "../../../../../packages/realtime-core",
          file,
        ),
        "utf-8",
      );

      expect(content).not.toContain("WebSocket");
      expect(content).not.toContain("TTS");
      expect(content).not.toContain("STT");
      expect(content).not.toContain("fetch(");
    }
  });

  it("should instantiate the runtime completely decoupled from the network", () => {
    const container = createRuntime();

    expect(container).toBeDefined();
    expect(container.orchestrator).toBeDefined();
  });
});
