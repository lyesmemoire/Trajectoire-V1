import { describe, it, expect } from "vitest";
import { InterviewStateService } from "../InterviewStateService";
import type { InterviewState } from "@/lib/ai/schemas/interview-state.schema";
import type { AnswerEvaluation } from "@/lib/ai/schemas/answer-evaluation.schema";

function makeEval(overrides: Partial<AnswerEvaluation> = {}): AnswerEvaluation {
  return {
    relevanceScore: 80,
    specificityScore: 80,
    evidenceScore: 80,
    competencyScore: 80,
    hasConcreteExample: true,
    hasPersonalOwnership: true,
    hasMetrics: true,
    hasOutcome: true,
    isVague: false,
    isEvasive: false,
    isTooShort: false,
    demonstratedCompetency: "strong",
    missingEvidence: [],
    recommendedAction: "NEXT_QUESTION",
    followUpType: null,
    shortReason: "OK",
    ...overrides,
  };
}

const THREE_SKILLS = ["React", "Leadership", "TypeScript"];

// ---------------------------------------------------------------
// A. NOT_TESTED exists → sélectionne NOT_TESTED
// ---------------------------------------------------------------
describe("A. NOT_TESTED priority", () => {
  it("selects the first NOT_TESTED competency when available", () => {
    const state = InterviewStateService.initializeState(THREE_SKILLS);
    const next = InterviewStateService.selectNextCompetency(state);
    expect(next).toBe("React");
  });

  it("selects next NOT_TESTED after advancing", () => {
    let state = InterviewStateService.initializeState(THREE_SKILLS);
    // Force React to PROVEN
    state = {
      ...state,
      competencies: state.competencies.map(c =>
        c.name === "React" ? { ...c, status: "PROVEN" } : c
      ),
    };
    const next = InterviewStateService.selectNextCompetency(state);
    expect(next).toBe("Leadership");
  });
});

// ---------------------------------------------------------------
// B. FOLLOW_UP → conserve currentCompetency
// ---------------------------------------------------------------
describe("B. FOLLOW_UP stays on current competency", () => {
  it("does not advance when evaluation says FOLLOW_UP", () => {
    const state: InterviewState = {
      ...InterviewStateService.initializeState(THREE_SKILLS),
      currentCompetency: "Leadership",
    };
    const eval_ = makeEval({ recommendedAction: "FOLLOW_UP", followUpType: "ASK_EXAMPLE" });
    const next = InterviewStateService.selectNextCompetency(state, eval_);
    expect(next).toBe("Leadership");
  });
});

// ---------------------------------------------------------------
// C. PROVEN → not re-selected while others remain
// ---------------------------------------------------------------
describe("C. PROVEN is skipped while NOT_TESTED remains", () => {
  it("skips PROVEN and returns NOT_TESTED", () => {
    const state = InterviewStateService.initializeState(THREE_SKILLS);
    const stateWithProven = {
      ...state,
      competencies: state.competencies.map(c =>
        c.name === "React"
          ? { ...c, status: "PROVEN" as const }
          : c
      ),
    };
    const next = InterviewStateService.selectNextCompetency(stateWithProven);
    expect(next).toBe("Leadership"); // first NOT_TESTED
    expect(next).not.toBe("React");
  });
});

// ---------------------------------------------------------------
// D. PARTIAL can be revisited after NOT_TESTED are cleared
// ---------------------------------------------------------------
describe("D. PARTIAL revisit after NOT_TESTED exhausted", () => {
  it("returns PARTIAL when no NOT_TESTED remain", () => {
    const state = InterviewStateService.initializeState(["Skill A", "Skill B"]);
    const advanced = {
      ...state,
      competencies: [
        { ...state.competencies[0], name: "Skill A", status: "PARTIAL" as const, lastEvaluatedAtTurn: 1 },
        { ...state.competencies[1], name: "Skill B", status: "PROVEN" as const, lastEvaluatedAtTurn: 2 },
      ],
    };
    const next = InterviewStateService.selectNextCompetency(advanced);
    expect(next).toBe("Skill A");
  });
});

// ---------------------------------------------------------------
// E. WEAK remains known as weakness
// ---------------------------------------------------------------
describe("E. WEAK competency tracking", () => {
  it("records WEAK status after insufficient evaluation", () => {
    let state = InterviewStateService.initializeState(["Leadership"]);
    state = { ...state, currentCompetency: "Leadership" };
    const eval_ = makeEval({ demonstratedCompetency: "insufficient" });
    const updated = InterviewStateService.updateState(state, eval_);
    expect(updated.competencies[0].status).toBe("WEAK");
    expect(updated.weakCompetencies).toContain("Leadership");
  });
});

// ---------------------------------------------------------------
// F. Two successive turns → evidence accumulates
// ---------------------------------------------------------------
describe("F. Evidence accumulates across turns", () => {
  it("retains evidence from turn 1 after turn 2", () => {
    let state = InterviewStateService.initializeState(["React"]);
    state = { ...state, currentCompetency: "React" };

    // Turn 1: partial
    const eval1 = makeEval({ demonstratedCompetency: "partial", evidenceScore: 60 });
    state = InterviewStateService.updateState(state, eval1);
    const scoreAfterTurn1 = state.competencies[0].bestScore;
    expect(scoreAfterTurn1).toBeGreaterThan(0);
    expect(state.competencies[0].status).toBe("PARTIAL");

    // Turn 2: strong (completes it)
    const eval2 = makeEval({ demonstratedCompetency: "strong", relevanceScore: 95 });
    state = { ...state, currentCompetency: "React" };
    state = InterviewStateService.updateState(state, eval2);

    // Turn 1 evidence is still visible: bestScore should be max of both
    expect(state.competencies[0].bestScore).toBe(95);
    expect(state.competencies[0].status).toBe("PROVEN");
    expect(state.competencies[0].attempts).toBe(2);
    expect(state.completedCompetencies).toContain("React");
  });
});

// ---------------------------------------------------------------
// G. Absent/invalid state → safe fallback
// ---------------------------------------------------------------
describe("G. Invalid/absent state → safe fallback", () => {
  it("handles null gracefully and returns initialized state", () => {
    const state = InterviewStateService.parse(null, THREE_SKILLS);
    expect(state.competencies).toHaveLength(3);
    expect(state.competencies.every(c => c.status === "NOT_TESTED")).toBe(true);
  });

  it("handles garbage JSON gracefully", () => {
    const state = InterviewStateService.parse({ garbage: true, random: 42 }, ["React"]);
    expect(state.competencies).toHaveLength(1);
    expect(state.competencies[0].name).toBe("React");
  });

  it("accepts valid state without reinitialising", () => {
    const valid: InterviewState = {
      competencies: [
        {
          name: "React",
          status: "PROVEN",
          evidenceCount: 3,
          bestScore: 90,
          missingEvidence: [],
          attempts: 2,
          lastEvaluatedAtTurn: 4,
        },
      ],
      currentCompetency: null,
      completedCompetencies: ["React"],
      weakCompetencies: [],
      turnNumber: 5,
    };
    const parsed = InterviewStateService.parse(valid, ["React"]);
    expect(parsed.competencies[0].status).toBe("PROVEN");
    expect(parsed.turnNumber).toBe(5);
  });
});
