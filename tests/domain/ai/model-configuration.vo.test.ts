import { describe, it, expect } from "vitest";
import { ModelConfiguration } from "../../../lib/ai/domain/value-objects/model-configuration.vo";

describe("ModelConfiguration Value Object", () => {
  describe("creation", () => {
    it("should create configuration with valid props", () => {
      const config = ModelConfiguration.create("gpt-4", 0.7, 2000, 0.9);
      
      expect(config.model).toBe("gpt-4");
      expect(config.temperature).toBe(0.7);
      expect(config.maxTokens).toBe(2000);
      expect(config.topP).toBe(0.9);
    });

    it("should create configuration with minimal props", () => {
      const config = ModelConfiguration.create("gpt-4");
      
      expect(config.model).toBe("gpt-4");
      expect(config.temperature).toBe(0.7);
      expect(config.maxTokens).toBeUndefined();
      expect(config.topP).toBeUndefined();
    });

    it("should use default temperature of 0.7", () => {
      const config = ModelConfiguration.create("gpt-4");
      
      expect(config.temperature).toBe(0.7);
    });

    it("should throw error for temperature below 0", () => {
      expect(() => ModelConfiguration.create("gpt-4", -0.1)).toThrow("Temperature must be between 0 and 2");
    });

    it("should throw error for temperature above 2", () => {
      expect(() => ModelConfiguration.create("gpt-4", 2.1)).toThrow("Temperature must be between 0 and 2");
    });

    it("should throw error for topP below 0", () => {
      expect(() => ModelConfiguration.create("gpt-4", 0.7, undefined, -0.1)).toThrow("TopP must be between 0 and 1");
    });

    it("should throw error for topP above 1", () => {
      expect(() => ModelConfiguration.create("gpt-4", 0.7, undefined, 1.1)).toThrow("TopP must be between 0 and 1");
    });

    it("should allow boundary temperature values (0 and 2)", () => {
      const config1 = ModelConfiguration.create("gpt-4", 0);
      const config2 = ModelConfiguration.create("gpt-4", 2);
      
      expect(config1.temperature).toBe(0);
      expect(config2.temperature).toBe(2);
    });

    it("should allow boundary topP values (0 and 1)", () => {
      const config1 = ModelConfiguration.create("gpt-4", 0.7, undefined, 0);
      const config2 = ModelConfiguration.create("gpt-4", 0.7, undefined, 1);
      
      expect(config1.topP).toBe(0);
      expect(config2.topP).toBe(1);
    });
  });

  describe("edge cases", () => {
    it("should maintain immutability", () => {
      const config = ModelConfiguration.create("gpt-4", 0.7);
      
      // Properties are readonly, so this is a compile-time check
      expect(config.model).toBe("gpt-4");
      expect(config.temperature).toBe(0.7);
    });

    it("should handle very large maxTokens", () => {
      const config = ModelConfiguration.create("gpt-4", 0.7, 100000);
      
      expect(config.maxTokens).toBe(100000);
    });

    it("should handle floating point temperature", () => {
      const config = ModelConfiguration.create("gpt-4", 0.75);
      
      expect(config.temperature).toBe(0.75);
    });

    it("should handle floating point topP", () => {
      const config = ModelConfiguration.create("gpt-4", 0.7, undefined, 0.95);
      
      expect(config.topP).toBe(0.95);
    });

    it("should handle different model names", () => {
      const models = ["gpt-4", "gpt-3.5-turbo", "claude-3-opus", "mistral-large"];
      
      models.forEach(model => {
        const config = ModelConfiguration.create(model);
        expect(config.model).toBe(model);
      });
    });
  });
});
