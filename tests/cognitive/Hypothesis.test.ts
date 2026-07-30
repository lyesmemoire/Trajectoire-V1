import { describe, it, expect } from "vitest";
import { deriveHypothesisStatus } from "../../apps/web/src/domain/cognitive/Hypothesis";

describe("Hypothesis", () => {
  describe("deriveHypothesisStatus", () => {
    it("returns PENDING with no evidence", () => {
      expect(deriveHypothesisStatus(0, 0, 0, 3, 0)).toBe("PENDING");
    });

    it("returns VALIDATED with high confidence, sufficient evidence, no contradictions", () => {
      expect(deriveHypothesisStatus(0.9, 4, 0, 3, 3)).toBe("VALIDATED");
    });

    it("does NOT validate if required evidence is not fulfilled", () => {
      expect(deriveHypothesisStatus(0.9, 4, 0, 5, 2)).toBe("PENDING");
    });

    it("returns REJECTED with low confidence and multiple contradictions", () => {
      expect(deriveHypothesisStatus(0.2, 1, 3, 3, 1)).toBe("REJECTED");
    });

    it("returns INCONCLUSIVE with mixed signals", () => {
      expect(deriveHypothesisStatus(0.55, 2, 1, 3, 2)).toBe("INCONCLUSIVE");
    });

    it("returns PENDING when confidence is too low for inconclusive", () => {
      expect(deriveHypothesisStatus(0.3, 1, 1, 3, 1)).toBe("PENDING");
    });
  });
});
