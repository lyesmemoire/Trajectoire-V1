import { describe, it, expect } from "vitest";
import { Money } from "../../../lib/billing/domain/value-objects/money.vo";

describe("Money Value Object", () => {
  describe("creation", () => {
    it("should create money with valid amount and currency", () => {
      const money = Money.create(100, "eur");
      
      expect(money.amount).toBe(100);
      expect(money.currency).toBe("eur");
    });

    it("should default to EUR currency", () => {
      const money = Money.create(100);
      
      expect(money.currency).toBe("eur");
    });

    it("should normalize currency to lowercase", () => {
      const money = Money.create(100, "USD");
      
      expect(money.currency).toBe("usd");
    });

    it("should throw error for negative amount", () => {
      expect(() => Money.create(-10, "eur")).toThrow("Money amount cannot be negative");
    });

    it("should throw error for non-finite amount", () => {
      expect(() => Money.create(Infinity, "eur")).toThrow("Money amount must be a finite number");
      expect(() => Money.create(NaN, "eur")).toThrow("Money amount must be a finite number");
    });

    it("should throw error for unsupported currency", () => {
      expect(() => Money.create(100, "jpy")).toThrow("Unsupported currency: jpy");
    });

    it("should accept supported currencies", () => {
      expect(() => Money.create(100, "eur")).not.toThrow();
      expect(() => Money.create(100, "usd")).not.toThrow();
      expect(() => Money.create(100, "gbp")).not.toThrow();
    });

    it("should create from cents", () => {
      const money = Money.fromCents(10000, "eur");
      
      expect(money.amount).toBe(100);
      expect(money.currency).toBe("eur");
    });

    it("should handle fractional cents in fromCents", () => {
      const money = Money.fromCents(1050, "eur");
      
      expect(money.amount).toBe(10.5);
    });
  });

  describe("toCents", () => {
    it("should convert amount to cents", () => {
      const money = Money.create(100, "eur");
      
      expect(money.toCents()).toBe(10000);
    });

    it("should round fractional amounts", () => {
      const money = Money.create(10.505, "eur");
      
      expect(money.toCents()).toBe(1051);
    });

    it("should handle zero amount", () => {
      const money = Money.create(0, "eur");
      
      expect(money.toCents()).toBe(0);
    });
  });

  describe("add", () => {
    it("should add two money amounts with same currency", () => {
      const money1 = Money.create(100, "eur");
      const money2 = Money.create(50, "eur");
      
      const result = money1.add(money2);
      
      expect(result.amount).toBe(150);
      expect(result.currency).toBe("eur");
    });

    it("should throw error for different currencies", () => {
      const money1 = Money.create(100, "eur");
      const money2 = Money.create(50, "usd");
      
      expect(() => money1.add(money2)).toThrow("Cannot add money with different currencies");
    });

    it("should return new instance (immutability)", () => {
      const money1 = Money.create(100, "eur");
      const money2 = Money.create(50, "eur");
      
      const result = money1.add(money2);
      
      expect(money1.amount).toBe(100);
      expect(money2.amount).toBe(50);
    });
  });

  describe("subtract", () => {
    it("should subtract two money amounts with same currency", () => {
      const money1 = Money.create(100, "eur");
      const money2 = Money.create(50, "eur");
      
      const result = money1.subtract(money2);
      
      expect(result.amount).toBe(50);
      expect(result.currency).toBe("eur");
    });

    it("should throw error for different currencies", () => {
      const money1 = Money.create(100, "eur");
      const money2 = Money.create(50, "usd");
      
      expect(() => money1.subtract(money2)).toThrow("Cannot subtract money with different currencies");
    });

    it("should throw error when subtracting more than available", () => {
      const money1 = Money.create(50, "eur");
      const money2 = Money.create(100, "eur");
      
      expect(() => money1.subtract(money2)).toThrow("Cannot subtract more money than available");
    });

    it("should return new instance (immutability)", () => {
      const money1 = Money.create(100, "eur");
      const money2 = Money.create(50, "eur");
      
      const result = money1.subtract(money2);
      
      expect(money1.amount).toBe(100);
      expect(money2.amount).toBe(50);
    });

    it("should allow subtracting to zero", () => {
      const money1 = Money.create(100, "eur");
      const money2 = Money.create(100, "eur");
      
      const result = money1.subtract(money2);
      
      expect(result.amount).toBe(0);
    });
  });

  describe("isZero", () => {
    it("should return true for zero amount", () => {
      const money = Money.create(0, "eur");
      
      expect(money.isZero()).toBe(true);
    });

    it("should return false for positive amount", () => {
      const money = Money.create(100, "eur");
      
      expect(money.isZero()).toBe(false);
    });
  });

  describe("isPositive", () => {
    it("should return true for positive amount", () => {
      const money = Money.create(100, "eur");
      
      expect(money.isPositive()).toBe(true);
    });

    it("should return false for zero amount", () => {
      const money = Money.create(0, "eur");
      
      expect(money.isPositive()).toBe(false);
    });
  });

  describe("edge cases", () => {
    it("should handle very large amounts", () => {
      const money = Money.create(999999999, "eur");
      
      expect(money.amount).toBe(999999999);
      expect(money.toCents()).toBe(99999999900);
    });

    it("should handle very small amounts", () => {
      const money = Money.create(0.01, "eur");
      
      expect(money.amount).toBe(0.01);
      expect(money.toCents()).toBe(1);
    });

    it("should handle floating point precision", () => {
      const money1 = Money.create(0.1, "eur");
      const money2 = Money.create(0.2, "eur");
      
      const result = money1.add(money2);
      
      expect(result.amount).toBeCloseTo(0.3, 10);
    });
  });
});
