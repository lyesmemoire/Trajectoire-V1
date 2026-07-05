import { describe, it, expect } from "vitest";
import { AccountStatus } from "../../../lib/auth/domain/value-objects/account-status.vo";

describe("AccountStatus Value Object", () => {
  describe("creation", () => {
    it("should create account status with valid value", () => {
      const status = AccountStatus.create("active");
      
      expect(status.value).toBe("active");
    });

    it("should normalize to lowercase", () => {
      const status = AccountStatus.create("ACTIVE");
      
      expect(status.value).toBe("active");
    });

    it("should throw error for invalid status", () => {
      expect(() => AccountStatus.create("deleted")).toThrow("Invalid account status: deleted. Valid statuses are: active, inactive, suspended, pending_verification");
    });

    it("should throw error for empty string", () => {
      expect(() => AccountStatus.create("")).toThrow("Invalid account status: . Valid statuses are: active, inactive, suspended, pending_verification");
    });

    it("should accept all valid statuses", () => {
      expect(() => AccountStatus.create("active")).not.toThrow();
      expect(() => AccountStatus.create("inactive")).not.toThrow();
      expect(() => AccountStatus.create("suspended")).not.toThrow();
      expect(() => AccountStatus.create("pending_verification")).not.toThrow();
    });
  });

  describe("static factory methods", () => {
    it("should create active status using static method", () => {
      const status = AccountStatus.active();
      
      expect(status.value).toBe("active");
    });

    it("should create inactive status using static method", () => {
      const status = AccountStatus.inactive();
      
      expect(status.value).toBe("inactive");
    });

    it("should create suspended status using static method", () => {
      const status = AccountStatus.suspended();
      
      expect(status.value).toBe("suspended");
    });

    it("should create pending verification status using static method", () => {
      const status = AccountStatus.pendingVerification();
      
      expect(status.value).toBe("pending_verification");
    });
  });

  describe("isActive", () => {
    it("should return true for active status", () => {
      const status = AccountStatus.active();
      
      expect(status.isActive()).toBe(true);
    });

    it("should return false for non-active status", () => {
      expect(AccountStatus.inactive().isActive()).toBe(false);
      expect(AccountStatus.suspended().isActive()).toBe(false);
      expect(AccountStatus.pendingVerification().isActive()).toBe(false);
    });
  });

  describe("isSuspended", () => {
    it("should return true for suspended status", () => {
      const status = AccountStatus.suspended();
      
      expect(status.isSuspended()).toBe(true);
    });

    it("should return false for non-suspended status", () => {
      expect(AccountStatus.active().isSuspended()).toBe(false);
      expect(AccountStatus.inactive().isSuspended()).toBe(false);
      expect(AccountStatus.pendingVerification().isSuspended()).toBe(false);
    });
  });

  describe("isPendingVerification", () => {
    it("should return true for pending verification status", () => {
      const status = AccountStatus.pendingVerification();
      
      expect(status.isPendingVerification()).toBe(true);
    });

    it("should return false for non-pending verification status", () => {
      expect(AccountStatus.active().isPendingVerification()).toBe(false);
      expect(AccountStatus.inactive().isPendingVerification()).toBe(false);
      expect(AccountStatus.suspended().isPendingVerification()).toBe(false);
    });
  });

  describe("equals", () => {
    it("should return true for equal statuses", () => {
      const status1 = AccountStatus.create("active");
      const status2 = AccountStatus.create("active");
      
      expect(status1.equals(status2)).toBe(true);
    });

    it("should return false for different statuses", () => {
      const status1 = AccountStatus.create("active");
      const status2 = AccountStatus.create("inactive");
      
      expect(status1.equals(status2)).toBe(false);
    });

    it("should be case-insensitive after normalization", () => {
      const status1 = AccountStatus.create("ACTIVE");
      const status2 = AccountStatus.create("active");
      
      expect(status1.equals(status2)).toBe(true);
    });
  });

  describe("toString", () => {
    it("should return the status value", () => {
      const status = AccountStatus.create("active");
      
      expect(status.toString()).toBe("active");
    });
  });

  describe("edge cases", () => {
    it("should maintain immutability", () => {
      const status = AccountStatus.create("active");
      
      // Value is readonly, so this is a compile-time check
      expect(status.value).toBe("active");
    });

    it("should handle mixed case input", () => {
      const status1 = AccountStatus.create("AcTiVe");
      const status2 = AccountStatus.create("INACTIVE");
      const status3 = AccountStatus.create("SuSpEnDeD");
      
      expect(status1.value).toBe("active");
      expect(status2.value).toBe("inactive");
      expect(status3.value).toBe("suspended");
    });
  });
});
