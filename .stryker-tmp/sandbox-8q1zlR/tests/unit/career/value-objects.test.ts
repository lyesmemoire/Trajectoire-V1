// @ts-nocheck
import { describe, it, expect } from "vitest";
import { CareerScore } from "../../../lib/career/domain/value-objects/career-score.vo";
import { ReturnProbability } from "../../../lib/career/domain/value-objects/return-probability.vo";

describe("Career Domain Value Objects", () => {
  describe("CareerScore", () => {
    it("should create a valid score", () => {
      const score = CareerScore.create(85.45);
      expect(score.value).toBe(85.5); // rounded
      expect(score.toJSON()).toBe(85.5);
    });

    it("should throw on invalid scores", () => {
      expect(() => CareerScore.create(-1)).toThrow();
      expect(() => CareerScore.create(101)).toThrow();
    });

    it("should equate scores", () => {
      const a = CareerScore.create(85);
      const b = CareerScore.create(85);
      expect(a.equals(b)).toBe(true);
    });
  });

  describe("ReturnProbability", () => {
    it("should create a valid probability", () => {
      const prob = ReturnProbability.create(0.85456);
      expect(prob.value).toBe(0.8546); // rounded to 4 decimals
    });

    it("should throw on invalid probabilities", () => {
      expect(() => ReturnProbability.create(-0.1)).toThrow();
      expect(() => ReturnProbability.create(1.1)).toThrow();
    });
  });
});
