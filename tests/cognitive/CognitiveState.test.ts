import { describe, it, expect } from "vitest";
import { CognitiveState } from "../../apps/web/src/domain/cognitive/CognitiveState";

describe("CognitiveState", () => {
  const ENGINE_VERSION = "ios-1.0.0";
  const competencies = [
    "leadership",
    "system_design",
    "communication",
    "ownership",
    "debugging",
  ];

  it("creates a fresh state for a new session", () => {
    const state = CognitiveState.create(
      crypto.randomUUID(),
      ENGINE_VERSION,
      45,
      35,
      competencies
    );

    expect(state.version).toBe(0);
    expect(state.schemaVersion).toBe("1.0");
    expect(state.engineVersion).toBe(ENGINE_VERSION);
    expect(state.currentPhase).toBe("OPENING");
    expect(state.competencies).toHaveLength(5);
    expect(state.unknowns).toHaveLength(5);
    expect(state.hypotheses).toHaveLength(0);
    expect(state.evidences).toHaveLength(0);
    expect(state.budget.maxDurationMinutes).toBe(45);
    expect(state.budget.remainingQuestions).toBe(35);
  });

  it("initializes all competencies as UNKNOWN", () => {
    const state = CognitiveState.create(
      crypto.randomUUID(),
      ENGINE_VERSION,
      45,
      35,
      competencies
    );
    for (const comp of state.competencies) {
      expect(comp.status).toBe("UNKNOWN");
      expect(comp.confidence).toBe(0);
    }
  });

  it("creates one Unknown per competency", () => {
    const state = CognitiveState.create(
      crypto.randomUUID(),
      ENGINE_VERSION,
      45,
      35,
      competencies
    );
    const unknownCompetencies = state.unknowns.map((u) => u.competency);
    for (const c of competencies) {
      expect(unknownCompetencies).toContain(c);
    }
  });

  describe("Cognitive Queries", () => {
    it("getKnownCompetencies returns empty when all are UNKNOWN", () => {
      const state = CognitiveState.create(
        crypto.randomUUID(),
        ENGINE_VERSION,
        45,
        35,
        competencies
      );
      expect(state.getKnownCompetencies()).toHaveLength(0);
    });

    it("getRemainingUnknowns returns all unknowns initially", () => {
      const state = CognitiveState.create(
        crypto.randomUUID(),
        ENGINE_VERSION,
        45,
        35,
        competencies
      );
      expect(state.getRemainingUnknowns()).toHaveLength(5);
    });

    it("getActiveHypotheses returns empty initially", () => {
      const state = CognitiveState.create(
        crypto.randomUUID(),
        ENGINE_VERSION,
        45,
        35,
        competencies
      );
      expect(state.getActiveHypotheses()).toHaveLength(0);
    });

    it("getContradictedCompetencies returns empty initially", () => {
      const state = CognitiveState.create(
        crypto.randomUUID(),
        ENGINE_VERSION,
        45,
        35,
        competencies
      );
      expect(state.getContradictedCompetencies()).toHaveLength(0);
    });

    it("isSufficientlyConfident returns false initially", () => {
      const state = CognitiveState.create(
        crypto.randomUUID(),
        ENGINE_VERSION,
        45,
        35,
        competencies
      );
      expect(state.isSufficientlyConfident()).toBe(false);
    });

    it("canConclude returns false initially", () => {
      const state = CognitiveState.create(
        crypto.randomUUID(),
        ENGINE_VERSION,
        45,
        35,
        competencies
      );
      expect(state.canConclude()).toBe(false);
    });

    it("findCompetency returns the correct competency", () => {
      const state = CognitiveState.create(
        crypto.randomUUID(),
        ENGINE_VERSION,
        45,
        35,
        competencies
      );
      const found = state.findCompetency("ownership");
      expect(found).toBeDefined();
      expect(found!.identifier).toBe("ownership");
    });

    it("findCompetency returns undefined for unknown identifier", () => {
      const state = CognitiveState.create(
        crypto.randomUUID(),
        ENGINE_VERSION,
        45,
        35,
        competencies
      );
      expect(state.findCompetency("nonexistent")).toBeUndefined();
    });
  });

  describe("Serialization", () => {
    it("serializes and deserializes without data loss", () => {
      const sessionId = crypto.randomUUID();
      const state = CognitiveState.create(
        sessionId,
        ENGINE_VERSION,
        45,
        35,
        competencies
      );
      const data = state.toData();
      const restored = CognitiveState.fromData(data);

      expect(restored.sessionId).toBe(sessionId);
      expect(restored.version).toBe(0);
      expect(restored.competencies).toHaveLength(5);
      expect(restored.unknowns).toHaveLength(5);
      expect(restored.budget.maxDurationMinutes).toBe(45);
    });
  });

  describe("Zod Validation", () => {
    it("rejects invalid data via fromData", () => {
      expect(() =>
        CognitiveState.fromData({
          sessionId: "not-a-uuid",
        } as any)
      ).toThrow();
    });
  });
});
