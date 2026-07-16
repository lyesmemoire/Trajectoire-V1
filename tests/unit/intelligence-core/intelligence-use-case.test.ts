/**
 * Intelligence Use Case Tests
 */

import { describe, it, expect, vi } from "vitest";
import { IntelligenceUseCase } from "../../../lib/intelligence-core/application/intelligence.use-case";
import type { IntelligenceProviderPort } from "../../../lib/intelligence-core/domain/ports/intelligence-provider.port";
import type { IntelligenceRequest } from "../../../lib/intelligence-core";

describe("IntelligenceUseCase", () => {
  it("should create an intelligence use case", () => {
    const mockProvider: IntelligenceProviderPort = {
      execute: vi.fn(),
    };

    const useCase = new IntelligenceUseCase(mockProvider, "test prompt");
    expect(useCase).toBeDefined();
  });

  it("should validate request with missing id", async () => {
    const mockProvider: IntelligenceProviderPort = {
      execute: vi.fn(),
    };

    const useCase = new IntelligenceUseCase(mockProvider, "test prompt");

    const request = {
      id: "",
      type: "test",
      input: {},
      context: {
        candidateProfile: {},
        historicalObservations: [],
        currentGoals: [],
        recentInsights: [],
      },
      options: {
        provider: "anthropic" as const,
        model: "claude-3-5-sonnet-20241022",
      },
    };

    const response = await useCase.execute(request);
    expect(response.success).toBe(false);
    expect(response.error?.code).toBe("VALIDATION_ERROR");
  });

  it("should validate request with missing type", async () => {
    const mockProvider: IntelligenceProviderPort = {
      execute: vi.fn(),
    };

    const useCase = new IntelligenceUseCase(mockProvider, "test prompt");

    const request = {
      id: "req-123",
      type: "",
      input: {},
      context: {
        candidateProfile: {},
        historicalObservations: [],
        currentGoals: [],
        recentInsights: [],
      },
      options: {
        provider: "anthropic" as const,
        model: "claude-3-5-sonnet-20241022",
      },
    };

    const response = await useCase.execute(request);
    expect(response.success).toBe(false);
    expect(response.error?.code).toBe("VALIDATION_ERROR");
  });

  it("should validate request with missing provider", async () => {
    const mockProvider: IntelligenceProviderPort = {
      execute: vi.fn(),
    };

    const useCase = new IntelligenceUseCase(mockProvider, "test prompt");

    const request = {
      id: "req-123",
      type: "test",
      input: {},
      context: {
        candidateProfile: {},
        historicalObservations: [],
        currentGoals: [],
        recentInsights: [],
      },
      options: {
        provider: "anthropic" as const,
        model: "",
      },
    };

    const response = await useCase.execute(request);
    expect(response.success).toBe(false);
    expect(response.error?.code).toBe("VALIDATION_ERROR");
  });

  it("should build prompt variables from context", async () => {
    const mockProvider: IntelligenceProviderPort = {
      execute: vi.fn().mockResolvedValue({
        success: true,
        data: { result: "test" },
        metrics: {
          latency: 100,
          totalTokens: 100,
          cost: 0.001,
        },
      }),
    };

    const useCase = new IntelligenceUseCase(mockProvider, "test prompt");

    const request: IntelligenceRequest = {
      id: "req-123",
      type: "test",
      input: { data: "test" },
      context: {
        candidateProfile: { name: "John" },
        historicalObservations: ["obs1", "obs2"],
        currentGoals: ["goal1"],
        recentInsights: ["insight1"],
      },
      options: {
        provider: "anthropic" as const,
        model: "claude-3-5-sonnet-20241022",
      },
    };

    await useCase.execute(request);

    expect(mockProvider.execute).toHaveBeenCalledWith(
      "test prompt",
      expect.objectContaining({
        input: { data: "test" },
        candidateProfile: JSON.stringify({ name: "John" }),
        historicalObservations: "obs1\nobs2",
        currentGoals: "goal1",
        recentInsights: "insight1",
      }),
      expect.any(Object)
    );
  });
});
