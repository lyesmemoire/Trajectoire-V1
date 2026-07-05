import { describe, it, expect } from "vitest";
import { Email } from "../../../lib/auth/domain/value-objects/email.vo";

describe("Email Value Object", () => {
  describe("creation", () => {
    it("should create email with valid format", () => {
      const email = Email.create("test@example.com");
      
      expect(email.value).toBe("test@example.com");
    });

    it("should trim whitespace", () => {
      const email = Email.create("  test@example.com  ");
      
      expect(email.value).toBe("test@example.com");
    });

    it("should convert to lowercase", () => {
      const email = Email.create("Test@Example.COM");
      
      expect(email.value).toBe("test@example.com");
    });

    it("should throw error for empty string", () => {
      expect(() => Email.create("")).toThrow("Email cannot be empty.");
    });

    it("should throw error for whitespace only", () => {
      expect(() => Email.create("   ")).toThrow("Email cannot be empty.");
    });

    it("should throw error for invalid format - missing @", () => {
      expect(() => Email.create("testexample.com")).toThrow("Invalid email format.");
    });

    it("should throw error for invalid format - missing domain", () => {
      expect(() => Email.create("test@")).toThrow("Invalid email format.");
    });

    it("should throw error for invalid format - missing local part", () => {
      expect(() => Email.create("@example.com")).toThrow("Invalid email format.");
    });

    it("should throw error for invalid format - spaces", () => {
      expect(() => Email.create("test @example.com")).toThrow("Invalid email format.");
    });

    it("should accept valid email formats", () => {
      expect(() => Email.create("user@example.com")).not.toThrow();
      expect(() => Email.create("user.name@example.com")).not.toThrow();
      expect(() => Email.create("user+tag@example.com")).not.toThrow();
      expect(() => Email.create("user123@example.co.uk")).not.toThrow();
    });
  });

  describe("equals", () => {
    it("should return true for equal emails", () => {
      const email1 = Email.create("test@example.com");
      const email2 = Email.create("test@example.com");
      
      expect(email1.equals(email2)).toBe(true);
    });

    it("should return false for different emails", () => {
      const email1 = Email.create("test@example.com");
      const email2 = Email.create("other@example.com");
      
      expect(email1.equals(email2)).toBe(false);
    });

    it("should be case-insensitive", () => {
      const email1 = Email.create("Test@Example.COM");
      const email2 = Email.create("test@example.com");
      
      expect(email1.equals(email2)).toBe(true);
    });
  });

  describe("toString", () => {
    it("should return the email value", () => {
      const email = Email.create("test@example.com");
      
      expect(email.toString()).toBe("test@example.com");
    });
  });

  describe("edge cases", () => {
    it("should handle long email addresses", () => {
      const longEmail = "very.long.email.address.with.many.dots@example.com";
      const email = Email.create(longEmail);
      
      expect(email.value).toBe(longEmail);
    });

    it("should handle subdomains", () => {
      const email = Email.create("user@mail.example.com");
      
      expect(email.value).toBe("user@mail.example.com");
    });

    it("should maintain immutability", () => {
      const email = Email.create("test@example.com");
      
      // Value is readonly, so this is a compile-time check
      expect(email.value).toBe("test@example.com");
    });
  });
});
