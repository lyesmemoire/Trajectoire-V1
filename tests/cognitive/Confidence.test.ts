import { describe, it, expect } from "vitest";
import {
  computeConfidence,
  ConfidenceFactorsSchema,
} from "../../apps/web/src/domain/cognitive/Evidence";
import {
  createInitialConfidence,
  applyConfidenceDelta,
} from "../../apps/web/src/domain/cognitive/Confidence";

describe("Confidence Engine (Pure Math)", () => {
  describe("computeConfidence", () => {
    it("returns 0 when all factors are 0", () => {
      const factors = ConfidenceFactorsSchema.parse({
        quality: 0,
        specificity: 0,
        consistency: 0,
        recency: 0,
        technicalDepth: 0,
        behavioralDepth: 0,
        sourceReliability: 0,
      });
      expect(computeConfidence(factors)).toBe(0);
    });

    it("returns 1 when all factors are 1 and no penalties", () => {
      const factors = ConfidenceFactorsSchema.parse({
        quality: 1,
        specificity: 1,
        consistency: 1,
        recency: 1,
        technicalDepth: 1,
        behavioralDepth: 1,
        sourceReliability: 1,
      });
      expect(computeConfidence(factors)).toBe(1);
    });

    it("applies contradiction penalty", () => {
      const factors = ConfidenceFactorsSchema.parse({
        quality: 1,
        specificity: 1,
        consistency: 1,
        recency: 1,
        technicalDepth: 1,
        behavioralDepth: 1,
        sourceReliability: 1,
      });
      const withPenalty = computeConfidence(factors, 0.3, 0);
      expect(withPenalty).toBeCloseTo(0.7, 2);
    });

    it("applies weak signal penalty", () => {
      const factors = ConfidenceFactorsSchema.parse({
        quality: 1,
        specificity: 1,
        consistency: 1,
        recency: 1,
        technicalDepth: 1,
        behavioralDepth: 1,
        sourceReliability: 1,
      });
      const withPenalty = computeConfidence(factors, 0, 0.15);
      expect(withPenalty).toBeCloseTo(0.85, 2);
    });

    it("clamps result to [0, 1]", () => {
      const factors = ConfidenceFactorsSchema.parse({
        quality: 0.2,
        specificity: 0.2,
        consistency: 0.2,
        recency: 0.2,
        technicalDepth: 0.2,
        behavioralDepth: 0.2,
        sourceReliability: 0.2,
      });
      // With huge penalties the result must not go below 0
      const result = computeConfidence(factors, 0.9, 0.9);
      expect(result).toBe(0);
    });

    it("produces deterministic results (same input = same output)", () => {
      const factors = ConfidenceFactorsSchema.parse({
        quality: 0.8,
        specificity: 0.6,
        consistency: 0.9,
        recency: 0.7,
        technicalDepth: 0.5,
        behavioralDepth: 0.4,
        sourceReliability: 0.8,
      });
      const r1 = computeConfidence(factors, 0.05, 0.02);
      const r2 = computeConfidence(factors, 0.05, 0.02);
      expect(r1).toBe(r2);
    });
  });

  describe("CompetencyConfidence", () => {
    it("creates an initial confidence at 0", () => {
      const conf = createInitialConfidence("leadership");
      expect(conf.competency).toBe("leadership");
      expect(conf.value).toBe(0);
      expect(conf.evidenceCount).toBe(0);
      expect(conf.contradictionCount).toBe(0);
      expect(conf.weakSignalCount).toBe(0);
    });

    it("applies a positive delta from evidence", () => {
      const initial = createInitialConfidence("leadership");
      const updated = applyConfidenceDelta(initial, 0.15, "evidence");
      expect(updated.value).toBeCloseTo(0.15, 5);
      expect(updated.evidenceCount).toBe(1);
      expect(updated.contradictionCount).toBe(0);
    });

    it("applies a negative delta from contradiction", () => {
      const initial = createInitialConfidence("leadership");
      const withEvidence = applyConfidenceDelta(initial, 0.6, "evidence");
      const afterContradiction = applyConfidenceDelta(withEvidence, -0.2, "contradiction");

      expect(afterContradiction.value).toBeCloseTo(0.4, 5);
      expect(afterContradiction.contradictionCount).toBe(1);
      expect(afterContradiction.evidenceCount).toBe(1);
    });

    it("clamps confidence to [0, 1]", () => {
      const initial = createInitialConfidence("ownership");
      const overOne = applyConfidenceDelta(initial, 1.5, "evidence");
      expect(overOne.value).toBe(1);

      const underZero = applyConfidenceDelta(initial, -0.5, "contradiction");
      expect(underZero.value).toBe(0);
    });

    it("is immutable (original object unchanged)", () => {
      const initial = createInitialConfidence("communication");
      const updated = applyConfidenceDelta(initial, 0.3, "evidence");

      expect(initial.value).toBe(0);
      expect(initial.evidenceCount).toBe(0);
      expect(updated.value).toBeCloseTo(0.3, 5);
    });
  });
});
