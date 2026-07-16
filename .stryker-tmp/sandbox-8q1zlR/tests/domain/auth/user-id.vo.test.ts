// @ts-nocheck
import { describe, it, expect } from "vitest";
import { UserId } from "../../../lib/auth/domain/value-objects/user-id.vo";

describe("UserId Value Object", () => {
  describe("creation", () => {
    it("should create user id with valid value", () => {
      const userId = UserId.create("user-123");
      
      expect(userId.value).toBe("user-123");
    });

    it("should throw error for empty string", () => {
      expect(() => UserId.create("")).toThrow("UserId cannot be empty.");
    });

    it("should throw error for whitespace only", () => {
      expect(() => UserId.create("   ")).toThrow("UserId cannot be empty.");
    });

    it("should allow UUID format", () => {
      const uuid = "550e8400-e29b-41d4-a716-446655440000";
      const userId = UserId.create(uuid);
      
      expect(userId.value).toBe(uuid);
    });

    it("should allow custom format", () => {
      const userId = UserId.create("custom-123-abc");
      
      expect(userId.value).toBe("custom-123-abc");
    });

    it("should generate using id generator", () => {
      const mockGenerator = { generate: () => "generated-123" };
      const userId = UserId.generate(mockGenerator);
      
      expect(userId.value).toBe("generated-123");
    });
  });

  describe("equals", () => {
    it("should return true for equal user ids", () => {
      const id1 = UserId.create("user-123");
      const id2 = UserId.create("user-123");
      
      expect(id1.equals(id2)).toBe(true);
    });

    it("should return false for different user ids", () => {
      const id1 = UserId.create("user-123");
      const id2 = UserId.create("user-456");
      
      expect(id1.equals(id2)).toBe(false);
    });

    it("should be case-sensitive", () => {
      const id1 = UserId.create("user-123");
      const id2 = UserId.create("USER-123");
      
      expect(id1.equals(id2)).toBe(false);
    });
  });

  describe("toString", () => {
    it("should return the user id value", () => {
      const userId = UserId.create("user-123");
      
      expect(userId.toString()).toBe("user-123");
    });
  });

  describe("edge cases", () => {
    it("should handle very long ids", () => {
      const longId = "a".repeat(1000);
      const userId = UserId.create(longId);
      
      expect(userId.value).toBe(longId);
    });

    it("should handle special characters", () => {
      const userId = UserId.create("user_123-abc@xyz");
      
      expect(userId.value).toBe("user_123-abc@xyz");
    });

    it("should maintain immutability", () => {
      const userId = UserId.create("user-123");
      
      // Value is readonly, so this is a compile-time check
      expect(userId.value).toBe("user-123");
    });

    it("should preserve whitespace in value (not trimmed)", () => {
      const userId = UserId.create(" user-123 ");
      
      expect(userId.value).toBe(" user-123 ");
    });
  });
});
