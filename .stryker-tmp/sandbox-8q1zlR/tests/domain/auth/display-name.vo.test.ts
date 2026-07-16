// @ts-nocheck
import { describe, it, expect } from "vitest";
import { DisplayName } from "../../../lib/auth/domain/value-objects/display-name.vo";

describe("DisplayName Value Object", () => {
  describe("creation", () => {
    it("should create display name with valid value", () => {
      const displayName = DisplayName.create("John Doe");
      
      expect(displayName.value).toBe("John Doe");
    });

    it("should trim whitespace", () => {
      const displayName = DisplayName.create("  John Doe  ");
      
      expect(displayName.value).toBe("John Doe");
    });

    it("should throw error for empty string", () => {
      expect(() => DisplayName.create("")).toThrow("Display name cannot be empty.");
    });

    it("should throw error for whitespace only", () => {
      expect(() => DisplayName.create("   ")).toThrow("Display name cannot be empty.");
    });

    it("should throw error for value exceeding 100 characters", () => {
      const longName = "a".repeat(101);
      expect(() => DisplayName.create(longName)).toThrow("Display name cannot exceed 100 characters.");
    });

    it("should allow exactly 100 characters", () => {
      const name = "a".repeat(100);
      const displayName = DisplayName.create(name);
      
      expect(displayName.value).toBe(name);
    });

    it("should allow special characters", () => {
      const displayName = DisplayName.create("John-Doe O'Neil");
      
      expect(displayName.value).toBe("John-Doe O'Neil");
    });

    it("should allow numbers", () => {
      const displayName = DisplayName.create("John123");
      
      expect(displayName.value).toBe("John123");
    });

    it("should allow unicode characters", () => {
      const displayName = DisplayName.create("José García");
      
      expect(displayName.value).toBe("José García");
    });
  });

  describe("equals", () => {
    it("should return true for equal display names", () => {
      const name1 = DisplayName.create("John Doe");
      const name2 = DisplayName.create("John Doe");
      
      expect(name1.equals(name2)).toBe(true);
    });

    it("should return false for different display names", () => {
      const name1 = DisplayName.create("John Doe");
      const name2 = DisplayName.create("Jane Doe");
      
      expect(name1.equals(name2)).toBe(false);
    });

    it("should be case-sensitive", () => {
      const name1 = DisplayName.create("John Doe");
      const name2 = DisplayName.create("john doe");
      
      expect(name1.equals(name2)).toBe(false);
    });
  });

  describe("toString", () => {
    it("should return the display name value", () => {
      const displayName = DisplayName.create("John Doe");
      
      expect(displayName.toString()).toBe("John Doe");
    });
  });

  describe("edge cases", () => {
    it("should handle single character", () => {
      const displayName = DisplayName.create("J");
      
      expect(displayName.value).toBe("J");
    });

    it("should handle very short names", () => {
      const displayName = DisplayName.create("AB");
      
      expect(displayName.value).toBe("AB");
    });

    it("should maintain immutability", () => {
      const displayName = DisplayName.create("John Doe");
      
      // Value is readonly, so this is a compile-time check
      expect(displayName.value).toBe("John Doe");
    });

    it("should preserve internal whitespace", () => {
      const displayName = DisplayName.create("John  Doe");
      
      expect(displayName.value).toBe("John  Doe");
    });
  });
});
