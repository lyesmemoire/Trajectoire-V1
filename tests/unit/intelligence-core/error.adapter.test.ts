/**
 * Error Adapter Tests
 */

import { describe, it, expect } from "vitest";
import { ErrorAdapter } from "../../../lib/intelligence-core/infrastructure/adapters/error.adapter";

describe("ErrorAdapter", () => {
  it("should adapt a generic error to intelligence error contract", () => {
    const error = new Error("Test error");
    const adapted = ErrorAdapter.adapt(error);

    expect(adapted.code).toBe("UNKNOWN_ERROR");
    expect(adapted.message).toBe("Test error");
    expect(adapted.details).toBeDefined();
    expect(adapted.details?.name).toBe("Error");
  });

  it("should adapt a domain error to intelligence error contract", () => {
    const domainError = {
      code: "TEST_ERROR",
      message: "Test error message",
      details: { field: "value" },
    };
    const adapted = ErrorAdapter.adaptDomainError(domainError);

    expect(adapted.code).toBe("TEST_ERROR");
    expect(adapted.message).toBe("Test error message");
    expect(adapted.details).toEqual({ field: "value" });
  });

  it("should map timeout error code to domain error", () => {
    const adapted = ErrorAdapter.mapProviderError("timeout", "Request timed out");

    expect(adapted.code).toBe("TIMEOUT_ERROR");
    expect(adapted.message).toBe("Request timed out");
  });

  it("should map rate limit error code to domain error", () => {
    const adapted = ErrorAdapter.mapProviderError("rate_limit", "Rate limit exceeded");

    expect(adapted.code).toBe("RATE_LIMIT_ERROR");
    expect(adapted.message).toBe("Rate limit exceeded");
  });

  it("should map authentication error code to domain error", () => {
    const adapted = ErrorAdapter.mapProviderError("authentication", "Invalid API key");

    expect(adapted.code).toBe("AUTHENTICATION_ERROR");
    expect(adapted.message).toBe("Invalid API key");
  });

  it("should map validation error code to domain error", () => {
    const adapted = ErrorAdapter.mapProviderError("validation", "Invalid request");

    expect(adapted.code).toBe("VALIDATION_ERROR");
    expect(adapted.message).toBe("Invalid request");
  });

  it("should map configuration error code to domain error", () => {
    const adapted = ErrorAdapter.mapProviderError("configuration", "Invalid config");

    expect(adapted.code).toBe("CONFIGURATION_ERROR");
    expect(adapted.message).toBe("Invalid config");
  });

  it("should map unknown error code to provider error", () => {
    const adapted = ErrorAdapter.mapProviderError("unknown", "Unknown error");

    expect(adapted.code).toBe("PROVIDER_ERROR");
    expect(adapted.message).toBe("Unknown error");
  });
});
