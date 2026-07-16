// @ts-nocheck
import { describe, it, expect } from "vitest";
import { FraudKernel } from "@/lib/fraud/fraud-kernel";

describe("Fraud Kernel v2", () => {
  it("HARD VETO triggers correctly", () => {
    const kernel = new FraudKernel({
      hardVetoThreshold: 0.8,
      softFreezeThreshold: 0.6,
      velocityWindowMs: 60000,
    });

    const result = kernel.evaluate([
      { type: "billing_inconsistency", severity: 1, confidence: 1, metadata: {} },
    ], "user-1");

    expect(result.veto).toBe(true);
    expect(result.riskScore).toBeGreaterThanOrEqual(0.8);
    expect(result.reason).toContain("HARD VETO triggered");
  });

  it("Does not veto if signals are below threshold", () => {
    const kernel = new FraudKernel({
      hardVetoThreshold: 0.8,
      softFreezeThreshold: 0.6,
      velocityWindowMs: 60000,
    });

    const result = kernel.evaluate([
      { type: "behavioral_jump", severity: 0.5, confidence: 0.8, metadata: {} },
      { type: "velocity", severity: 0.3, confidence: 0.6, metadata: {} }
    ], "user-2");

    expect(result.veto).toBe(false);
    expect(result.riskScore).toBeLessThan(0.8);
    expect(result.reason).toContain("Primary signal: behavioral_jump");
  });
});
