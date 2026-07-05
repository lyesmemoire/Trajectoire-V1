import { describe, it, expect } from "vitest";
import { CanIncreasePressurePolicy, PressurePolicyContext } from "../../../../lib/interview/domain/policies/can-increase-pressure.policy";

describe("CanIncreasePressurePolicy", () => {
  let policy: CanIncreasePressurePolicy;

  beforeEach(() => {
    policy = new CanIncreasePressurePolicy();
  });

  describe("evaluate", () => {
    it("should return false for RECOVERY state", () => {
      const context: PressurePolicyContext = {
        currentState: "RECOVERY",
        confidenceScore: 80
      };
      
      expect(policy.evaluate(context)).toBe(false);
    });

    it("should return false for INTRODUCTION state", () => {
      const context: PressurePolicyContext = {
        currentState: "INTRODUCTION",
        confidenceScore: 80
      };
      
      expect(policy.evaluate(context)).toBe(false);
    });

    it("should return false for COMPLETED state", () => {
      const context: PressurePolicyContext = {
        currentState: "COMPLETED",
        confidenceScore: 80
      };
      
      expect(policy.evaluate(context)).toBe(false);
    });

    it("should return true for QUESTIONING state with high confidence", () => {
      const context: PressurePolicyContext = {
        currentState: "QUESTIONING",
        confidenceScore: 80
      };
      
      expect(policy.evaluate(context)).toBe(true);
    });

    it("should return true for FOLLOW_UP state with high confidence", () => {
      const context: PressurePolicyContext = {
        currentState: "FOLLOW_UP",
        confidenceScore: 80
      };
      
      expect(policy.evaluate(context)).toBe(true);
    });

    it("should return false for QUESTIONING state with low confidence", () => {
      const context: PressurePolicyContext = {
        currentState: "QUESTIONING",
        confidenceScore: 50
      };
      
      expect(policy.evaluate(context)).toBe(false);
    });

    it("should return true for confidence score at threshold (60)", () => {
      const context: PressurePolicyContext = {
        currentState: "QUESTIONING",
        confidenceScore: 60
      };
      
      expect(policy.evaluate(context)).toBe(true);
    });

    it("should return false for confidence score just below threshold (59)", () => {
      const context: PressurePolicyContext = {
        currentState: "QUESTIONING",
        confidenceScore: 59
      };
      
      expect(policy.evaluate(context)).toBe(false);
    });

    it("should return true for maximum confidence score (100)", () => {
      const context: PressurePolicyContext = {
        currentState: "QUESTIONING",
        confidenceScore: 100
      };
      
      expect(policy.evaluate(context)).toBe(true);
    });

    it("should return false for minimum confidence score (0)", () => {
      const context: PressurePolicyContext = {
        currentState: "QUESTIONING",
        confidenceScore: 0
      };
      
      expect(policy.evaluate(context)).toBe(false);
    });
  });
});
