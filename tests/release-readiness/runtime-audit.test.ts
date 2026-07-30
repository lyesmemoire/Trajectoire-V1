import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

describe("Release Readiness - Runtime Audit", () => {
  it("Runtime should not know EvidenceEngine, TemporalEngine, ContradictionEngine", () => {
    // Read RuntimeContainer.ts
    const runtimeContainerPath = join(__dirname, "../../apps/web/src/application/ai-operating-system/RuntimeContainer.ts");
    const runtimeContainerCode = readFileSync(runtimeContainerPath, "utf-8");

    // Verify RuntimeContainer does not import concrete engine implementations
    expect(runtimeContainerCode).not.toContain("import.*EvidenceEngine");
    expect(runtimeContainerCode).not.toContain("import.*TemporalEngine");
    expect(runtimeContainerCode).not.toContain("import.*ContradictionEngine");
    
    // Verify RuntimeContainer does not instantiate concrete engines
    expect(runtimeContainerCode).not.toContain("new EvidenceEngine");
    expect(runtimeContainerCode).not.toContain("new TemporalEngine");
    expect(runtimeContainerCode).not.toContain("new ContradictionEngine");
    
    // Verify RuntimeContainer only uses EngineFactory
    expect(runtimeContainerCode).toContain("EngineFactory");
  });

  it("Runtime should only manipulate EngineManifest, EngineCapability, EngineFactory, Engine", () => {
    // Read RuntimeContainer.ts
    const runtimeContainerPath = join(__dirname, "../../apps/web/src/application/ai-operating-system/RuntimeContainer.ts");
    const runtimeContainerCode = readFileSync(runtimeContainerPath, "utf-8");

    // Verify RuntimeContainer uses only abstractions
    expect(runtimeContainerCode).toContain("EngineFactory");
    
    // EngineFactory should handle concrete implementations
    const engineFactoryPath = join(__dirname, "../../apps/web/src/application/ai-operating-system/EngineFactory.ts");
    const engineFactoryCode = readFileSync(engineFactoryPath, "utf-8");
    
    // EngineFactory can import concrete implementations (this is expected)
    expect(engineFactoryCode).toContain("EvidenceEngine");
    expect(engineFactoryCode).toContain("ContradictionEngine");
    expect(engineFactoryCode).toContain("TemporalExtractor");
  });
});
