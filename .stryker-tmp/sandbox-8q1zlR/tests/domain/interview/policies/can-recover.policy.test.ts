// @ts-nocheck
import { describe, it, expect } from "vitest";
import { CanRecoverPolicy, RecoverPolicyContext } from "../../../../lib/interview/domain/policies/can-recover.policy";

describe("CanRecoverPolicy", () => {
  let policy: CanRecoverPolicy;

  beforeEach(() => {
    policy = new CanRecoverPolicy();
  });

  describe("evaluate", () => {
    it("should return false for RECOVERY state", () => {
      const context: RecoverPolicyContext = {
        currentState: "RECOVERY",
        confidenceScore: 30,
        consecutiveHesitations: 3
      };
      
      expect(policy.evaluate(context)).toBe(false);
    });

    it("should return false for COMPLETED state", () => {
      const context: RecoverPolicyContext = {
        currentState: "COMPLETED",
        confidenceScore: 30,
        consecutiveHesitations: 3
      };
      
      expect(policy.evaluate(context)).toBe(false);
    });

    it("should return false for INTRODUCTION state", () => {
      const context: RecoverPolicyContext = {
        currentState: "INTRODUCTION",
        confidenceScore: 30,
        consecutiveHesitations: 3
      };
      
      expect(policy.evaluate(context)).toBe(false);
    });

    it("should return true for low confidence score (< 40)", () => {
      const context: RecoverPolicyContext = {
        currentState: "QUESTIONING",
        confidenceScore: 35,
        consecutiveHesitations: 0
      };
      
      expect(policy.evaluate(context)).toBe(true);
    });

    it("should return true for high consecutive hesitations (>= 2)", () => {
      const context: RecoverPolicyContext = {
        currentState: "QUESTIONING",
        confidenceScore: 80,
        consecutiveHesitations: 2
      };
      
      expect(policy.evaluate(context)).toBe(true);
    });

    it("should return false for acceptable confidence and low hesitations", () => {
      const context: RecoverPolicyContext = {
        currentState: "QUESTIONING",
        confidenceScore: 70,
        consecutiveHesitations: 1
      };
      
      expect(policy.evaluate(context)).toBe(false);
    });

    it("should return true at confidence threshold (39)", () => {
      const context: RecoverPolicyContext = {
        currentState: "QUESTIONING",
        confidenceScore: 39,
        consecutiveHesitations: 0
      };
      
      expect(policy.evaluate(context)).toBe(true);
    });

    it("should return false just above confidence threshold (40)", () => {
      const context: RecoverPolicyContext = {
        currentState: "QUESTIONING",
        confidenceScore: 40,
        consecutiveHesitations: 0
      };
      
      expect(policy.evaluate(context)).toBe(false);
    });

    it("should return true at hesitation threshold (2)", () => {
      const context: RecoverPolicyContext = {
        currentState: "QUESTIONING",
        confidenceScore: 80,
        consecutiveHesitations: 2
      };
      
      expect(policy.evaluate(context)).toBe(true);
    });

    it("should return false just below hesitation threshold (1)", () => {
      const context: RecoverPolicyContext = {
        currentState: "QUESTIONING",
        confidenceScore: 80,
        consecutiveHesitations: 1
      };
      
      expect(policy.evaluate(context)).toBe(false);
    });

    it("should return true for FOLLOW_UP state with low confidence", () => {
      const context: RecoverPolicyContext = {
        currentState: "FOLLOW_UP",
        confidenceScore: 30,
        consecutiveHesitations: 0
      };
      
      expect(policy.evaluate(context)).toBe(true);
    });

    it("should return true when both conditions are met", () => {
      const context: RecoverPolicyContext = {
        currentState: "QUESTIONING",
        confidenceScore: 30,
        consecutiveHesitations: 3
      };
      
      expect(policy.evaluate(context)).toBe(true);
    });
  });
});
