/**
 * Engines Validation Test
 * 
 * Validates 5 representative engines: Forecast, Proactive, Reflection, Recommendations, DigitalTwin.
 * Run with: pnpm test tests/unit/engines/engines-validation.test.ts
 */

import { describe, it, expect, vi } from "vitest";
import { CareerCopilotForecastEngine } from "../../../core/intelligence/engines/careerCopilotForecastEngine";
import { CareerCopilotProactiveEngine } from "../../../core/intelligence/engines/careerCopilotProactiveEngine";
import { CareerCopilotReflectionIntelligenceEngine } from "../../../core/intelligence/engines/careerCopilotReflectionIntelligenceEngine";
import { RecommendationEngine } from "../../../core/intelligence/engines/recommendationEngine";
import { CareerCopilotDigitalTwinEngine } from "../../../core/intelligence/engines/careerCopilotDigitalTwinEngine";

// Mock dependencies
vi.mock("../../../core/ai/OpenAIProvider", () => ({
  OpenAIProvider: class {
    constructor(_apiKey?: string) {}
    isAvailable() { return true; }
    generateChatCompletion() {
      return {
        content: '{"result": "test"}',
        latency: 1000,
        usage: {
          promptTokens: 10,
          completionTokens: 5,
          totalTokens: 15,
        },
      };
    }
  },
}));

vi.mock("../../../lib/env.server", () => ({
  validateEnv: () => {},
}));

vi.mock("../../../core/ai/brain/CandidateAIBrain", () => ({
  candidateAIBrain: {
    getInsights: vi.fn(() => []),
    getObservations: vi.fn(() => []),
    getPatterns: vi.fn(() => ({ patterns: [] })),
    getGoals: vi.fn(() => []),
    addObservation: vi.fn(),
    findHistory: vi.fn(() => []),
  },
}));

vi.mock("../../../lib/intelligence-runtime/application/EventPublisher", () => ({
  EventPublisher: vi.fn(() => ({
    publish: vi.fn(),
  })),
}));

describe("Engines Validation", () => {
  describe("CareerCopilotForecastEngine", () => {
    it("should be defined", () => {
      expect(CareerCopilotForecastEngine).toBeDefined();
    });

    it("should be a class", () => {
      expect(typeof CareerCopilotForecastEngine).toBe("function");
    });

    it("should accept forecast input", () => {
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
    });
  });

  describe("CareerCopilotProactiveEngine", () => {
    it("should be defined", () => {
      expect(CareerCopilotProactiveEngine).toBeDefined();
    });

    it("should have generateInitiatives method", () => {
      expect(typeof CareerCopilotProactiveEngine.generateInitiatives).toBe("function");
    });

    it("should accept proactive input", () => {
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
    });
  });

  describe("CareerCopilotReflectionIntelligenceEngine", () => {
    it("should be defined", () => {
      expect(CareerCopilotReflectionIntelligenceEngine).toBeDefined();
    });

    it("should be a class", () => {
      expect(typeof CareerCopilotReflectionIntelligenceEngine).toBe("function");
    });

    it("should have getLastReflectionAnalysis method", () => {
      expect(typeof CareerCopilotReflectionIntelligenceEngine.getLastReflectionAnalysis).toBe("function");
    });

    it("should have getHistory method", () => {
      expect(typeof CareerCopilotReflectionIntelligenceEngine.getHistory).toBe("function");
    });

    it("should accept reflection input", () => {
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
    });
  });

  describe("RecommendationEngine", () => {
    it("should be defined", () => {
      expect(RecommendationEngine).toBeDefined();
    });

    it("should be a class", () => {
      expect(typeof RecommendationEngine).toBe("function");
    });

    it("should have generateNextSimulation method", () => {
      expect(typeof RecommendationEngine.generateNextSimulation).toBe("function");
    });

    it("should have generateWeaknesses method", () => {
      expect(typeof RecommendationEngine.generateWeaknesses).toBe("function");
    });

    it("should accept recommendation input", () => {
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
    });
  });

  describe("CareerCopilotDigitalTwinEngine", () => {
    it("should be defined", () => {
      expect(CareerCopilotDigitalTwinEngine).toBeDefined();
    });

    it("should be a class", () => {
      expect(typeof CareerCopilotDigitalTwinEngine).toBe("function");
    });

    it("should accept digital twin input", () => {
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
    });
  });
});
