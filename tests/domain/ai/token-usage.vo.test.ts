import { describe, it, expect } from "vitest";
import { TokenUsage } from "../../../lib/ai/domain/value-objects/token-usage.vo";

describe("TokenUsage Value Object", () => {
  describe("creation", () => {
    it("should create token usage with valid counts", () => {
      const usage = TokenUsage.create(100, 50);
      
      expect(usage.promptTokens).toBe(100);
      expect(usage.completionTokens).toBe(50);
      expect(usage.totalTokens).toBe(150);
    });

    it("should auto-calculate total if not provided", () => {
      const usage = TokenUsage.create(100, 50);
      
      expect(usage.totalTokens).toBe(150);
    });

    it("should use provided total if valid", () => {
      const usage = TokenUsage.create(100, 50, 150);
      
      expect(usage.totalTokens).toBe(150);
    });

    it("should throw error for negative prompt tokens", () => {
      expect(() => TokenUsage.create(-10, 50)).toThrow("Token counts cannot be negative");
    });

    it("should throw error for negative completion tokens", () => {
      expect(() => TokenUsage.create(100, -50)).toThrow("Token counts cannot be negative");
    });

    it("should throw error for mismatched total", () => {
      expect(() => TokenUsage.create(100, 50, 200)).toThrow("Total tokens must be the sum of prompt and completion tokens");
    });

    it("should allow zero values", () => {
      const usage = TokenUsage.create(0, 0);
      
      expect(usage.promptTokens).toBe(0);
      expect(usage.completionTokens).toBe(0);
      expect(usage.totalTokens).toBe(0);
    });

    it("should allow only prompt tokens", () => {
      const usage = TokenUsage.create(100, 0);
      
      expect(usage.promptTokens).toBe(100);
      expect(usage.completionTokens).toBe(0);
      expect(usage.totalTokens).toBe(100);
    });

    it("should allow only completion tokens", () => {
      const usage = TokenUsage.create(0, 50);
      
      expect(usage.promptTokens).toBe(0);
      expect(usage.completionTokens).toBe(50);
      expect(usage.totalTokens).toBe(50);
    });
  });

  describe("edge cases", () => {
    it("should handle very large token counts", () => {
      const usage = TokenUsage.create(100000, 50000);
      
      expect(usage.totalTokens).toBe(150000);
    });

    it("should handle single token counts", () => {
      const usage = TokenUsage.create(1, 1);
      
      expect(usage.totalTokens).toBe(2);
    });

    it("should maintain immutability", () => {
      const usage = TokenUsage.create(100, 50);
      
      // Properties are readonly, so this is a compile-time check
      expect(usage.promptTokens).toBe(100);
      expect(usage.completionTokens).toBe(50);
      expect(usage.totalTokens).toBe(150);
    });
  });
});
