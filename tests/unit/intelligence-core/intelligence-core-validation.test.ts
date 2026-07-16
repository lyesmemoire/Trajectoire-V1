/**
 * Intelligence Core Validation Test
 * 
 * Validates IntelligenceFactory, IntelligenceUseCase, and provider selection.
 * Run with: pnpm test tests/unit/intelligence-core/intelligence-core-validation.test.ts
 */

import { describe, it, expect, vi } from "vitest";
import { intelligenceCoreModule } from "../../../lib/intelligence-core";
import { IntelligenceFactory } from "../../../lib/intelligence-core/composition/intelligence.factory";
import { IntelligenceUseCase } from "../../../lib/intelligence-core/application/intelligence.use-case";

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

describe("Intelligence Core Validation", () => {
  describe("intelligenceCoreModule", () => {
    it("should have createUseCase method", () => {
      expect(intelligenceCoreModule).toBeDefined();
      expect(typeof intelligenceCoreModule.createUseCase).toBe("function");
    });

    it("should create IntelligenceUseCase instance", () => {
      const useCase = intelligenceCoreModule.createUseCase("test prompt");
      expect(useCase).toBeDefined();
      expect(useCase).toBeInstanceOf(IntelligenceUseCase);
    });

    it("should have createUseCaseWithAISDKV6 method", () => {
      expect(typeof intelligenceCoreModule.createUseCaseWithAISDKV6).toBe("function");
    });

    it("should have createUseCaseWithAnthropic method", () => {
      expect(typeof intelligenceCoreModule.createUseCaseWithAnthropic).toBe("function");
    });

    it("should have createUseCaseWithMistral method", () => {
      expect(typeof intelligenceCoreModule.createUseCaseWithMistral).toBe("function");
    });
  });

  describe("IntelligenceFactory", () => {
    it("should have createUseCase static method", () => {
      expect(IntelligenceFactory).toBeDefined();
      expect(typeof IntelligenceFactory.createUseCase).toBe("function");
    });

    it("should create IntelligenceUseCase via factory", () => {
      const useCase = IntelligenceFactory.createUseCase("test prompt");
      expect(useCase).toBeDefined();
      expect(useCase).toBeInstanceOf(IntelligenceUseCase);
    });

    it("should have createUseCaseWithAISDKV6 static method", () => {
      expect(typeof IntelligenceFactory.createUseCaseWithAISDKV6).toBe("function");
    });

    it("should have createUseCaseWithMistral static method", () => {
      expect(typeof IntelligenceFactory.createUseCaseWithMistral).toBe("function");
    });
  });

  describe("IntelligenceUseCase", () => {
    it("should execute request successfully", async () => {
      const useCase = intelligenceCoreModule.createUseCase("test prompt");
      
      const request = {
        id: "test-123",
        type: "test",
        input: {},
        context: {
          candidateProfile: { name: "Test", email: "test@example.com" },
          historicalObservations: [],
          currentGoals: [],
          recentInsights: [],
        },
        options: {
          provider: "openai" as const,
          model: "gpt-4",
          temperature: 0.7,
          maxTokens: 100,
        },
      };

      const result = await useCase.execute(request);

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.output).toBeDefined();
      expect(result.metadata).toBeDefined();
    });

    it("should handle missing ID validation", async () => {
      const useCase = intelligenceCoreModule.createUseCase("test prompt");
      
      const request = {
        id: "",
        type: "test",
        input: {},
        context: {
          candidateProfile: { name: "Test", email: "test@example.com" },
          historicalObservations: [],
          currentGoals: [],
          recentInsights: [],
        },
        options: {
          provider: "openai" as const,
          model: "gpt-4",
        },
      };

      const result = await useCase.execute(request);

      expect(result).toBeDefined();
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it("should handle missing type validation", async () => {
      const useCase = intelligenceCoreModule.createUseCase("test prompt");
      
      const request = {
        id: "test-123",
        type: "",
        input: {},
        context: {
          candidateProfile: { name: "Test", email: "test@example.com" },
          historicalObservations: [],
          currentGoals: [],
          recentInsights: [],
        },
        options: {
          provider: "openai" as const,
          model: "gpt-4",
        },
      };

      const result = await useCase.execute(request);

      expect(result).toBeDefined();
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe("Provider Selection", () => {
    it("should support OpenAI provider", () => {
      const useCase = intelligenceCoreModule.createUseCase("test prompt");
      expect(useCase).toBeDefined();
    });

    it("should support Anthropic provider", () => {
      if (!process.env.ANTHROPIC_API_KEY) {
        console.log("⚠️  Skipping Anthropic provider test (no ANTHROPIC_API_KEY)");
        return;
      }

      const useCase = intelligenceCoreModule.createUseCaseWithAnthropic("test prompt");
      expect(useCase).toBeDefined();
      expect(useCase).toBeInstanceOf(IntelligenceUseCase);
    });

    it("should support Mistral provider", () => {
      if (!process.env.MISTRAL_API_KEY) {
        console.log("⚠️  Skipping Mistral provider test (no MISTRAL_API_KEY)");
        return;
      }

      const useCase = intelligenceCoreModule.createUseCaseWithMistral("test prompt");
      expect(useCase).toBeDefined();
      expect(useCase).toBeInstanceOf(IntelligenceUseCase);
    });
  });
});
