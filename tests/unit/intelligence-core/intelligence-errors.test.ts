/**
 * Intelligence Errors Tests
 */

import { describe, it, expect } from "vitest";
import {
  ValidationError,
  ProviderError,
  EngineExecutionError,
  TimeoutError,
  RateLimitError,
  AuthenticationError,
  ConfigurationError,
} from "../../../lib/intelligence-core/domain/contracts/intelligence-errors";

describe("IntelligenceError", () => {
  it("should serialize concrete error to JSON", () => {
    const error = new ValidationError("Test message", { detail: "value" });
    const json = error.toJSON();
    expect(json).toEqual({
      name: "ValidationError",
      code: "VALIDATION_ERROR",
      message: "Test message",
      details: { detail: "value" },
    });
  });
});

describe("ValidationError", () => {
  it("should create a validation error", () => {
    const error = new ValidationError("Invalid input");
    expect(error.code).toBe("VALIDATION_ERROR");
    expect(error.message).toBe("Invalid input");
    expect(error.name).toBe("ValidationError");
  });

  it("should accept details", () => {
    const error = new ValidationError("Invalid input", { field: "email" });
    expect(error.details).toEqual({ field: "email" });
  });
});

describe("ProviderError", () => {
  it("should create a provider error", () => {
    const error = new ProviderError("Provider failed");
    expect(error.code).toBe("PROVIDER_ERROR");
    expect(error.message).toBe("Provider failed");
    expect(error.name).toBe("ProviderError");
  });
});

describe("EngineExecutionError", () => {
  it("should create an engine execution error", () => {
    const error = new EngineExecutionError("Engine failed");
    expect(error.code).toBe("ENGINE_EXECUTION_ERROR");
    expect(error.message).toBe("Engine failed");
    expect(error.name).toBe("EngineExecutionError");
  });
});

describe("TimeoutError", () => {
  it("should create a timeout error", () => {
    const error = new TimeoutError("Request timed out");
    expect(error.code).toBe("TIMEOUT_ERROR");
    expect(error.message).toBe("Request timed out");
    expect(error.name).toBe("TimeoutError");
  });
});

describe("RateLimitError", () => {
  it("should create a rate limit error", () => {
    const error = new RateLimitError("Rate limit exceeded");
    expect(error.code).toBe("RATE_LIMIT_ERROR");
    expect(error.message).toBe("Rate limit exceeded");
    expect(error.name).toBe("RateLimitError");
  });
});

describe("AuthenticationError", () => {
  it("should create an authentication error", () => {
    const error = new AuthenticationError("Authentication failed");
    expect(error.code).toBe("AUTHENTICATION_ERROR");
    expect(error.message).toBe("Authentication failed");
    expect(error.name).toBe("AuthenticationError");
  });
});

describe("ConfigurationError", () => {
  it("should create a configuration error", () => {
    const error = new ConfigurationError("Invalid configuration");
    expect(error.code).toBe("CONFIGURATION_ERROR");
    expect(error.message).toBe("Invalid configuration");
    expect(error.name).toBe("ConfigurationError");
  });
});
