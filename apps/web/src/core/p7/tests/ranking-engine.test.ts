import { describe, it, expect } from "vitest";
import { RankingEngine } from "../ranking/ranking-engine";
import { computeCohortStats, labelCohort } from "../ranking/cohort-analyzer";
import { CandidateEvaluation } from "../evaluation-contract";

function buildEval(sessionId: string, score: number, stabilityScore = 50): CandidateEvaluation {
  return {
    sessionId,
    score,
    competencies: [
      { name: "clarity", score: 50, confidence: 0.5, signals: [] },
      { name: "stability", score: stabilityScore, confidence: 0.5, signals: [] },
      { name: "technical_depth", score: 50, confidence: 0.5, signals: [] },
      { name: "communication", score: 50, confidence: 0.5, signals: [] },
    ],
    evidence: [],
    summary: {
      strengths: [],
      weaknesses: [],
      hiringRecommendation: "neutral",
      finalComment: "",
    },
    metadata: {
      version: "P7.1",
      generatedAt: 0,
      sourceHash: "test",
      deterministic: true,
    },
  };
}

describe("P7.3 — Cross-Session Intelligence Layer", () => {

  // ---- R1: Ranking determinism ----
  describe("R1 — Ranking determinism", () => {
    it("same input → same ranking, 3 consecutive runs", () => {
      const engine = new RankingEngine();
      const evals = [
        buildEval("A", 80),
        buildEval("B", 60),
        buildEval("C", 90),
        buildEval("D", 70),
      ];

      const r1 = engine.rank(evals);
      const r2 = engine.rank(evals);
      const r3 = engine.rank(evals);

      expect(r1).toEqual(r2);
      expect(r2).toEqual(r3);
    });
  });

  // ---- R2: Normalization bounded [0,100] ----
  describe("R2 — Normalization bounds", () => {
    it("all normalizedScores are clamped to [0, 100]", () => {
      const evals = [
        buildEval("X1", 5),
        buildEval("X2", 99),
        buildEval("X3", 50),
        buildEval("X4", 0),
        buildEval("X5", 100),
      ];
      const engine = new RankingEngine();
      const report = engine.rank(evals);

      for (const entry of report.rankings) {
        expect(entry.score.normalizedScore).toBeGreaterThanOrEqual(0);
        expect(entry.score.normalizedScore).toBeLessThanOrEqual(100);
      }
    });

    it("single candidate normalizes to center (50)", () => {
      const engine = new RankingEngine();
      const report = engine.rank([buildEval("solo", 73)]);

      expect(report.rankings[0]!.score.normalizedScore).toBe(50);
      expect(report.rankings[0]!.rank).toBe(1);
    });
  });

  // ---- R3: Tie-breaker strict ----
  describe("R3 — Tie-breaker strict", () => {
    it("equal global score → stability breaks tie", () => {
      const engine = new RankingEngine();
      const evals = [
        buildEval("AAA", 70, 40),  // lower stability
        buildEval("BBB", 70, 80),  // higher stability → should rank higher
      ];

      const report = engine.rank(evals);
      expect(report.rankings[0]!.candidateId).toBe("BBB");
      expect(report.rankings[1]!.candidateId).toBe("AAA");
    });

    it("equal score AND equal stability → lexicographic candidateId", () => {
      const engine = new RankingEngine();
      const evals = [
        buildEval("Charlie", 70, 60),
        buildEval("Alpha", 70, 60),
        buildEval("Bravo", 70, 60),
      ];

      const report = engine.rank(evals);
      expect(report.rankings[0]!.candidateId).toBe("Alpha");
      expect(report.rankings[1]!.candidateId).toBe("Bravo");
      expect(report.rankings[2]!.candidateId).toBe("Charlie");
    });
  });

  // ---- R4: Cohort stats correctness ----
  describe("R4 — Cohort stats invariants", () => {
    it("computes correct mean, stdDev, min, max", () => {
      const stats = computeCohortStats([60, 70, 80, 90]);
      expect(stats.mean).toBe(75);
      expect(stats.min).toBe(60);
      expect(stats.max).toBe(90);
      expect(stats.stdDev).toBeCloseTo(11.18, 1);
    });

    it("labels low_variance_cohort when stdDev < 5", () => {
      const stats = computeCohortStats([50, 51, 52, 50, 51]);
      expect(labelCohort(stats)).toBe("low_variance_cohort");
    });

    it("labels high_dispersion_cohort when range > 80", () => {
      const stats = computeCohortStats([5, 90]);
      expect(labelCohort(stats)).toBe("high_dispersion_cohort");
    });

    it("labels normal_cohort otherwise", () => {
      const stats = computeCohortStats([40, 50, 60, 70]);
      expect(labelCohort(stats)).toBe("normal_cohort");
    });

    it("handles empty array gracefully", () => {
      const stats = computeCohortStats([]);
      expect(stats.mean).toBe(0);
      expect(stats.stdDev).toBe(0);
    });
  });

  // ---- R5: Replay invariance (permutation-safe) ----
  describe("R5 — Replay invariance (permutation-safe)", () => {
    it("ranking is identical regardless of input order", () => {
      const engine = new RankingEngine();
      const a = buildEval("A", 90);
      const b = buildEval("B", 60);
      const c = buildEval("C", 75);
      const d = buildEval("D", 45);

      const order1 = engine.rank([a, b, c, d]);
      const order2 = engine.rank([d, c, b, a]);
      const order3 = engine.rank([c, a, d, b]);

      expect(order1).toEqual(order2);
      expect(order2).toEqual(order3);
    });
  });
});
