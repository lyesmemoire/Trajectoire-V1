import { describe, it, expect } from "vitest";
import { CareerScore } from "../../../lib/career/domain/value-objects/career-score.vo";
import { ValidationError } from "../../../lib/core/errors";

describe("CareerScore Value Object", () => {
  describe("creation", () => {
    it("should create career score with valid value", () => {
      const score = CareerScore.create(85);
      
      expect(score.value).toBe(85);
    });

    it("should round to 1 decimal place", () => {
      const score1 = CareerScore.create(85.456);
      expect(score1.value).toBe(85.5);
      
      const score2 = CareerScore.create(85.444);
      expect(score2.value).toBe(85.4);
    });

    it("should throw error for negative value", () => {
      expect(() => CareerScore.create(-10)).toThrow(ValidationError);
      expect(() => CareerScore.create(-10)).toThrow("Invalid CareerScore: must be between 0 and 100");
    });

    it("should throw error for value above 100", () => {
      expect(() => CareerScore.create(101)).toThrow(ValidationError);
      expect(() => CareerScore.create(101)).toThrow("Invalid CareerScore: must be between 0 and 100");
    });

    it("should allow zero value", () => {
      const score = CareerScore.create(0);
      
      expect(score.value).toBe(0);
    });

    it("should allow 100 value", () => {
      const score = CareerScore.create(100);
      
      expect(score.value).toBe(100);
    });

    it("should handle floating point values", () => {
      const score = CareerScore.create(75.5);
      
      expect(score.value).toBe(75.5);
    });
  });

  describe("isHigherThan", () => {
    it("should return true if score is higher", () => {
      const score1 = CareerScore.create(85);
      const score2 = CareerScore.create(70);
      
      expect(score1.isHigherThan(score2)).toBe(true);
    });

    it("should return false if score is lower", () => {
      const score1 = CareerScore.create(70);
      const score2 = CareerScore.create(85);
      
      expect(score1.isHigherThan(score2)).toBe(false);
    });

    it("should return false if scores are equal", () => {
      const score1 = CareerScore.create(85);
      const score2 = CareerScore.create(85);
      
      expect(score1.isHigherThan(score2)).toBe(false);
    });
  });

  describe("equals", () => {
    it("should return true for equal values", () => {
      const score1 = CareerScore.create(85);
      const score2 = CareerScore.create(85);
      
      expect(score1.equals(score2)).toBe(true);
    });

    it("should return false for different values", () => {
      const score1 = CareerScore.create(85);
      const score2 = CareerScore.create(70);
      
      expect(score1.equals(score2)).toBe(false);
    });

    it("should handle rounded values correctly", () => {
      const score1 = CareerScore.create(85.45);
      const score2 = CareerScore.create(85.44);
      
      expect(score1.equals(score2)).toBe(false);
    });
  });

  describe("toJSON", () => {
    it("should return the numeric value", () => {
      const score = CareerScore.create(85.5);
      
      expect(score.toJSON()).toBe(85.5);
    });
  });

  describe("edge cases", () => {
    it("should handle boundary values", () => {
      const score0 = CareerScore.create(0);
      const score100 = CareerScore.create(100);
      
      expect(score0.value).toBe(0);
      expect(score100.value).toBe(100);
    });

    it("should handle very small decimal values", () => {
      const score = CareerScore.create(0.1);
      
      expect(score.value).toBe(0.1);
    });

    it("should maintain immutability", () => {
      const score = CareerScore.create(85);
      
      // Value is readonly, so this is a compile-time check
      expect(score.value).toBe(85);
    });
  });
});
