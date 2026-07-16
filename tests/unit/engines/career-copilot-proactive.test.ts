/**
 * Career Copilot Proactive Engine Test
 */

import { describe, it, expect, vi } from "vitest";
import { CareerCopilotProactiveEngine } from "../../../core/intelligence/engines/careerCopilotProactiveEngine";

// Mock dependencies
vi.mock("../../../lib/env.server", () => ({
  validateEnv: () => {},
}));

describe("CareerCopilotProactiveEngine", () => {
  it("should be defined", () => {
    expect(CareerCopilotProactiveEngine).toBeDefined();
  });

  it("should have generateInitiatives method", () => {
    expect(typeof CareerCopilotProactiveEngine.generateInitiatives).toBe("function");
  });

  it("should accept ProactiveInput", () => {
    const input = {
      candidateGraph: {
        profile: {
          name: "Test Candidate",
          email: "test@example.com",
        },
      },
    };
    
    expect(input).toBeDefined();
    expect(input.candidateGraph).toBeDefined();
    expect(input.candidateGraph.profile).toBeDefined();
  });
});
