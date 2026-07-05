import { describe, it, expect } from "vitest";
import { PressureLevel } from "../../../lib/interview/domain/value-objects/pressure-level.vo";

describe("PressureLevel Value Object", () => {
  describe("creation", () => {
    it("should create pressure level with valid value", () => {
      const pressure = PressureLevel.create(50);
      
      expect(pressure.value).toBe(50);
    });

    it("should throw error for negative value", () => {
      expect(() => PressureLevel.create(-10)).toThrow("Pressure level must be between 0 and 100.");
    });

    it("should throw error for value above 100", () => {
      expect(() => PressureLevel.create(101)).toThrow("Pressure level must be between 0 and 100.");
    });

    it("should allow zero value", () => {
      const pressure = PressureLevel.create(0);
      
      expect(pressure.value).toBe(0);
    });

    it("should allow 100 value", () => {
      const pressure = PressureLevel.create(100);
      
      expect(pressure.value).toBe(100);
    });

    it("should handle floating point values", () => {
      const pressure = PressureLevel.create(75.5);
      
      expect(pressure.value).toBe(75.5);
    });
  });

  describe("increase", () => {
    it("should increase pressure level", () => {
      const pressure = PressureLevel.create(50);
      const increased = pressure.increase(20);
      
      expect(increased.value).toBe(70);
    });

    it("should cap at 100", () => {
      const pressure = PressureLevel.create(80);
      const increased = pressure.increase(30);
      
      expect(increased.value).toBe(100);
    });

    it("should return new instance (immutability)", () => {
      const pressure = PressureLevel.create(50);
      const increased = pressure.increase(20);
      
      expect(pressure.value).toBe(50);
      expect(increased.value).toBe(70);
    });

    it("should handle zero increase", () => {
      const pressure = PressureLevel.create(50);
      const increased = pressure.increase(0);
      
      expect(increased.value).toBe(50);
    });

    it("should handle negative increase (decrease)", () => {
      const pressure = PressureLevel.create(50);
      const increased = pressure.increase(-20);
      
      expect(increased.value).toBe(30);
    });
  });

  describe("decrease", () => {
    it("should decrease pressure level", () => {
      const pressure = PressureLevel.create(50);
      const decreased = pressure.decrease(20);
      
      expect(decreased.value).toBe(30);
    });

    it("should floor at 0", () => {
      const pressure = PressureLevel.create(30);
      const decreased = pressure.decrease(50);
      
      expect(decreased.value).toBe(0);
    });

    it("should return new instance (immutability)", () => {
      const pressure = PressureLevel.create(50);
      const decreased = pressure.decrease(20);
      
      expect(pressure.value).toBe(50);
      expect(decreased.value).toBe(30);
    });

    it("should handle zero decrease", () => {
      const pressure = PressureLevel.create(50);
      const decreased = pressure.decrease(0);
      
      expect(decreased.value).toBe(50);
    });

    it("should handle negative decrease (increase)", () => {
      const pressure = PressureLevel.create(50);
      const decreased = pressure.decrease(-20);
      
      expect(decreased.value).toBe(70);
    });
  });

  describe("edge cases", () => {
    it("should handle boundary values", () => {
      const pressure0 = PressureLevel.create(0);
      const pressure100 = PressureLevel.create(100);
      
      expect(pressure0.value).toBe(0);
      expect(pressure100.value).toBe(100);
    });

    it("should maintain immutability", () => {
      const pressure = PressureLevel.create(50);
      
      // Value is readonly, so this is a compile-time check
      expect(pressure.value).toBe(50);
    });

    it("should handle very small decimal values", () => {
      const pressure = PressureLevel.create(0.1);
      
      expect(pressure.value).toBe(0.1);
    });

    it("should handle very large decimal values", () => {
      const pressure = PressureLevel.create(99.9);
      
      expect(pressure.value).toBe(99.9);
    });
  });
});
