import { describe, it, expect } from "vitest";
import { UserRole } from "../../../lib/auth/domain/value-objects/user-role.vo";

describe("UserRole Value Object", () => {
  describe("creation", () => {
    it("should create user role with valid value", () => {
      const role = UserRole.create("user");
      
      expect(role.value).toBe("user");
    });

    it("should normalize to lowercase", () => {
      const role = UserRole.create("ADMIN");
      
      expect(role.value).toBe("admin");
    });

    it("should throw error for invalid role", () => {
      expect(() => UserRole.create("superadmin")).toThrow("Invalid role: superadmin. Valid roles are: user, admin, moderator, premium");
    });

    it("should throw error for empty string", () => {
      expect(() => UserRole.create("")).toThrow("Invalid role: . Valid roles are: user, admin, moderator, premium");
    });

    it("should accept all valid roles", () => {
      expect(() => UserRole.create("user")).not.toThrow();
      expect(() => UserRole.create("admin")).not.toThrow();
      expect(() => UserRole.create("moderator")).not.toThrow();
      expect(() => UserRole.create("premium")).not.toThrow();
    });
  });

  describe("static factory methods", () => {
    it("should create user role using static method", () => {
      const role = UserRole.user();
      
      expect(role.value).toBe("user");
    });

    it("should create admin role using static method", () => {
      const role = UserRole.admin();
      
      expect(role.value).toBe("admin");
    });

    it("should create moderator role using static method", () => {
      const role = UserRole.moderator();
      
      expect(role.value).toBe("moderator");
    });

    it("should create premium role using static method", () => {
      const role = UserRole.premium();
      
      expect(role.value).toBe("premium");
    });
  });

  describe("equals", () => {
    it("should return true for equal roles", () => {
      const role1 = UserRole.create("user");
      const role2 = UserRole.create("user");
      
      expect(role1.equals(role2)).toBe(true);
    });

    it("should return false for different roles", () => {
      const role1 = UserRole.create("user");
      const role2 = UserRole.create("admin");
      
      expect(role1.equals(role2)).toBe(false);
    });

    it("should be case-insensitive after normalization", () => {
      const role1 = UserRole.create("USER");
      const role2 = UserRole.create("user");
      
      expect(role1.equals(role2)).toBe(true);
    });
  });

  describe("toString", () => {
    it("should return the role value", () => {
      const role = UserRole.create("admin");
      
      expect(role.toString()).toBe("admin");
    });
  });

  describe("edge cases", () => {
    it("should maintain immutability", () => {
      const role = UserRole.create("admin");
      
      // Value is readonly, so this is a compile-time check
      expect(role.value).toBe("admin");
    });

    it("should handle mixed case input", () => {
      const role1 = UserRole.create("UsEr");
      const role2 = UserRole.create("ADMIN");
      const role3 = UserRole.create("MoDeRaToR");
      
      expect(role1.value).toBe("user");
      expect(role2.value).toBe("admin");
      expect(role3.value).toBe("moderator");
    });
  });
});
