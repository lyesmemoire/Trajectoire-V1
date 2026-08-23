import { describe, it, expect } from "vitest";
import * as commandBuilderModule from "../command-builder.js";
import * as validatorModule from "../command-validator.js";
import * as replayModule from "../transport-replay.js";
import * as batchModule from "../command-batch.js";
import { readFileSync } from "fs";
import { join } from "path";

describe("P6.3 - T5 Purity", () => {
  it("should not contain any forbidden I/O or global calls in source files", () => {
    const files = [
      "transport-contract.ts",
      "command-builder.ts",
      "command-validator.ts",
      "transport-replay.ts",
      "command-batch.ts"
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
    expect(typeof commandBuilderModule.buildTransportCommands).toBe("function");
    expect(typeof validatorModule.validateTransportCommands).toBe("function");
    expect(typeof replayModule.serializeCommands).toBe("function");
    expect(typeof replayModule.deserializeCommands).toBe("function");
    expect(typeof batchModule.buildCommandBatch).toBe("function");
  });
});
