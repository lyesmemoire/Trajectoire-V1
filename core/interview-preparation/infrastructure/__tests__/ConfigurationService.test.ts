/**
 * ConfigurationService Unit Tests
 *
 * Tests for infrastructure configuration service.
 * NO network calls, NO external dependencies.
 * ONLY unit tests with mocks.
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { ConfigurationService } from "../configuration/ConfigurationService";

describe("ConfigurationService", () => {
  let configurationService: ConfigurationService;

  beforeEach(() => {
    vi.clearAllMocks();
    configurationService = ConfigurationService.getInstance();
  });

  describe("getInstance", () => {
    it("should return singleton instance", () => {
      const instance1 = ConfigurationService.getInstance();
      const instance2 = ConfigurationService.getInstance();

      expect(instance1).toBe(instance2);
    });
  });

  describe("getOpenAIConfig", () => {
    it("should return OpenAI configuration", () => {
      const config = configurationService.getOpenAIConfig();

      expect(config).toHaveProperty("apiKey");
      expect(config).toHaveProperty("model");
      expect(config).toHaveProperty("temperature");
      expect(config).toHaveProperty("maxTokens");
      expect(config).toHaveProperty("timeout");
      expect(config).toHaveProperty("retryDelay");
      expect(config).toHaveProperty("maxRetries");
    });

    it("should have valid configuration values", () => {
      const config = configurationService.getOpenAIConfig();

      expect(typeof config.apiKey).toBe("string");
      expect(typeof config.model).toBe("string");
      expect(typeof config.temperature).toBe("number");
      expect(typeof config.maxTokens).toBe("number");
      expect(typeof config.timeout).toBe("number");
      expect(typeof config.retryDelay).toBe("number");
      expect(typeof config.retryAttempts).toBe("number");
    });
  });

  describe("getSupabaseConfig", () => {
    it("should return Supabase configuration", () => {
      const config = configurationService.getSupabaseConfig();

      expect(config).toHaveProperty("url");
      expect(config).toHaveProperty("anonKey");
      expect(config).toHaveProperty("timeout");
    });

    it("should have valid configuration values", () => {
      const config = configurationService.getSupabaseConfig();

      expect(typeof config.url).toBe("string");
      expect(typeof config.anonKey).toBe("string");
      expect(typeof config.timeout).toBe("number");
    });
  });

  describe("getTelemetryConfig", () => {
    it("should return telemetry configuration", () => {
      const config = configurationService.getTelemetryConfig();

      expect(config).toHaveProperty("enabled");
      expect(config).toHaveProperty("endpoint");
      expect(config).toHaveProperty("apiKey");
      expect(config).toHaveProperty("samplingRate");
    });

    it("should have valid configuration values", () => {
      const config = configurationService.getTelemetryConfig();

      expect(typeof config.enabled).toBe("boolean");
      expect(typeof config.samplingRate).toBe("number");
      expect(config.samplingRate).toBeGreaterThanOrEqual(0);
      expect(config.samplingRate).toBeLessThanOrEqual(1);
    });
  });

  describe("getAnalyticsConfig", () => {
    it("should return analytics configuration", () => {
      const config = configurationService.getAnalyticsConfig();

      expect(config).toHaveProperty("enabled");
      expect(config).toHaveProperty("endpoint");
      expect(config).toHaveProperty("apiKey");
    });

    it("should have valid configuration values", () => {
      const config = configurationService.getAnalyticsConfig();

      expect(typeof config.enabled).toBe("boolean");
    });
  });

  describe("getLoggingConfig", () => {
    it("should return logging configuration", () => {
      const config = configurationService.getLoggingConfig();

      expect(config).toHaveProperty("level");
      expect(config).toHaveProperty("format");
    });

    it("should have valid configuration values", () => {
      const config = configurationService.getLoggingConfig();

      expect(typeof config.level).toBe("string");
      expect(typeof config.format).toBe("string");
      expect(["DEBUG", "INFO", "WARN", "ERROR", "FATAL"]).toContain(config.level);
      expect(["JSON", "TEXT"]).toContain(config.format);
    });
  });

  describe("validate", () => {
    it("should validate configuration successfully", () => {
      const isValid = configurationService.validate();

      expect(isValid).toBe(true);
    });
  });
});
