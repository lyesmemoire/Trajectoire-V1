import { describe, it, expect } from "vitest";
import {
  deriveCompetencyStatus,
  createCompetency,
} from "../../apps/web/src/domain/cognitive/Competency";

describe("Competency", () => {
  it("creates an initial competency with UNKNOWN status", () => {
    const comp = createCompetency("system_design");
    expect(comp.identifier).toBe("system_design");
    expect(comp.status).toBe("UNKNOWN");
    expect(comp.confidence).toBe(0);
    expect(comp.supportingEvidence).toEqual([]);
    expect(comp.contradictions).toEqual([]);
  });

  describe("deriveCompetencyStatus", () => {
    it("returns UNKNOWN when no evidence exists", () => {
      expect(deriveCompetencyStatus(0, 0, 0)).toBe("UNKNOWN");
    });

    it("returns PARTIAL with low confidence and some evidence", () => {
      expect(deriveCompetencyStatus(0.3, 1, 0)).toBe("PARTIAL");
    });

    it("returns PARTIAL when confidence is 0 but evidence exists", () => {
      expect(deriveCompetencyStatus(0, 1, 0)).toBe("PARTIAL");
    });

    it("returns LIKELY with moderate confidence", () => {
      expect(deriveCompetencyStatus(0.65, 2, 0)).toBe("LIKELY");
    });

    it("returns VERIFIED with high confidence, 3+ evidence, no contradictions", () => {
      expect(deriveCompetencyStatus(0.9, 4, 0)).toBe("VERIFIED");
    });

    it("does NOT return VERIFIED if fewer than 3 evidences", () => {
      expect(deriveCompetencyStatus(0.9, 2, 0)).not.toBe("VERIFIED");
    });

    it("does NOT return VERIFIED if contradictions exist", () => {
      expect(deriveCompetencyStatus(0.9, 5, 1)).not.toBe("VERIFIED");
    });

    it("returns REJECTED with low confidence and contradictions", () => {
      expect(deriveCompetencyStatus(0.1, 1, 2)).toBe("REJECTED");
    });
  });
});
