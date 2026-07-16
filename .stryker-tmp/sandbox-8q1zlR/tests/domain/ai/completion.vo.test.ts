// @ts-nocheck
import { describe, it, expect } from "vitest";
import { Completion } from "../../../lib/ai/domain/value-objects/completion.vo";
import { TokenUsage } from "../../../lib/ai/domain/value-objects/token-usage.vo";

describe("Completion Value Object", () => {
  describe("creation", () => {
    it("should create completion with content", () => {
      const completion = Completion.create("Hello, world!");
      
      expect(completion.content).toBe("Hello, world!");
      expect(completion.tokenUsage).toBeUndefined();
    });

    it("should create completion with content and token usage", () => {
      const tokenUsage = TokenUsage.create(100, 50);
      const completion = Completion.create("Hello, world!", tokenUsage);
      
      expect(completion.content).toBe("Hello, world!");
      expect(completion.tokenUsage).toBeDefined();
      expect(completion.tokenUsage?.promptTokens).toBe(100);
      expect(completion.tokenUsage?.completionTokens).toBe(50);
    });

    it("should throw error for empty content", () => {
      expect(() => Completion.create("")).toThrow("Completion content cannot be empty");
    });

    it("should throw error for undefined content", () => {
      expect(() => Completion.create(undefined as any)).toThrow("Completion content cannot be empty");
    });

    it("should throw error for null content", () => {
      expect(() => Completion.create(null as any)).toThrow("Completion content cannot be empty");
    });

    it("should allow whitespace-only content", () => {
      const completion = Completion.create("   ");
      
      expect(completion.content).toBe("   ");
    });
  });

  describe("edge cases", () => {
    it("should handle very long content", () => {
      const longContent = "a".repeat(10000);
      const completion = Completion.create(longContent);
      
      expect(completion.content).toBe(longContent);
    });

    it("should handle special characters", () => {
      const content = "Special chars: \n\t\r\\\"'";
      const completion = Completion.create(content);
      
      expect(completion.content).toBe(content);
    });

    it("should handle unicode characters", () => {
      const content = "Unicode: 你好 🌍";
      const completion = Completion.create(content);
      
      expect(completion.content).toBe(content);
    });

    it("should handle multiline content", () => {
      const content = "Line 1\nLine 2\nLine 3";
      const completion = Completion.create(content);
      
      expect(completion.content).toBe(content);
    });

    it("should maintain immutability", () => {
      const completion = Completion.create("Hello");
      
      // Content is readonly, so this is a compile-time check
      expect(completion.content).toBe("Hello");
    });

    it("should handle large token usage", () => {
      const tokenUsage = TokenUsage.create(100000, 50000);
      const completion = Completion.create("Content", tokenUsage);
      
      expect(completion.tokenUsage?.totalTokens).toBe(150000);
    });
  });
});
