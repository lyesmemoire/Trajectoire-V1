/**
 * Intelligence Request DTO Tests
 */

import { describe, it, expect } from "vitest";
import type { IntelligenceRequest, IntelligenceContext, IntelligenceOptions } from "../../../lib/intelligence-core";

describe("IntelligenceRequest", () => {
  it("should create a valid intelligence request", () => {
    const context: IntelligenceContext = {
      candidateProfile: { name: "John Doe" },
      historicalObservations: ["obs1", "obs2"],
      currentGoals: ["goal1"],
      recentInsights: ["insight1"],
    };

    const options: IntelligenceOptions = {
      provider: "anthropic",
      model: "claude-3-5-sonnet-20241022",
      temperature: 0.7,
      maxTokens: 1000,
    };

    const request: IntelligenceRequest = {
      id: "req-123",
      type: "forecast",
      input: { data: "test" },
      context,
      options,
    };

    expect(request.id).toBe("req-123");
    expect(request.type).toBe("forecast");
    expect(request.input).toEqual({ data: "test" });
    expect(request.context).toEqual(context);
    expect(request.options).toEqual(options);
  });

  it("should accept minimal required fields", () => {
    const context: IntelligenceContext = {
      candidateProfile: {},
      historicalObservations: [],
      currentGoals: [],
      recentInsights: [],
    };

    const options: IntelligenceOptions = {
      provider: "openai",
      model: "gpt-4",
    };

    const request: IntelligenceRequest = {
      id: "req-456",
      type: "planning",
      input: {},
      context,
      options,
    };

    expect(request.id).toBe("req-456");
    expect(request.type).toBe("planning");
    expect(request.options.provider).toBe("openai");
    expect(request.options.model).toBe("gpt-4");
  });

  it("should accept engine-specific context", () => {
    const context: IntelligenceContext = {
      candidateProfile: {},
      historicalObservations: [],
      currentGoals: [],
      recentInsights: [],
      engineContext: { customField: "customValue" },
    };

    const options: IntelligenceOptions = {
      provider: "anthropic",
      model: "claude-3-5-sonnet-20241022",
    };

    const request: IntelligenceRequest = {
      id: "req-789",
      type: "ats",
      input: {},
      context,
      options,
    };

    expect(request.context.engineContext).toEqual({ customField: "customValue" });
  });
});
