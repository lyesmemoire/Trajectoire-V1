import { CandidateEvaluation } from "../evaluation-contract.js";
import { GlobalRankingReport, GlobalRankingEntry } from "./ranking-contract.js";
import { normalizeScores } from "./normalizer.js";
import { computeCohortStats, labelCohort } from "./cohort-analyzer.js";

/**
 * Cross-session ranking engine.
 *
 * Pipeline:
 *   CandidateEvaluation[] → CohortStats → Normalization → Sorting → Ranking
 *
 * Tie-breaker (strict, deterministic):
 *   1. normalizedScore descending
 *   2. stability competency score descending
 *   3. candidateId lexicographic ascending (pure fallback)
 *
 * Invariants:
 *   R1 — Ranking deterministic (same input → same output)
 *   R2 — Normalization bounded [0, 100]
 *   R3 — Tie-breaker strict (no ambiguous ordering)
 *   R4 — Cohort stats invariant on permutation
 *   R5 — No external state
 */
export class RankingEngine {

  public rank(evaluations: CandidateEvaluation[]): GlobalRankingReport {
    if (evaluations.length === 0) {
      return {
        rankings: [],
        stats: { mean: 0, stdDev: 0, min: 0, max: 0 },
        cohortLabel: "normal_cohort",
      };
    }

    // 1. Extract raw scores
    const rawScores = evaluations.map(e => e.score);

    // 2. Compute cohort stats
    const stats = computeCohortStats(rawScores);
    const cohortLabel = labelCohort(stats);

    // 3. Normalize
    const candidates = evaluations.map(e => ({
      candidateId: e.sessionId,
      rawScore: e.score,
    }));
    const normalized = normalizeScores(candidates, stats.mean, stats.stdDev);

    // 4. Build stability lookup for tie-breaking
    const stabilityMap = new Map<string, number>();
    for (const e of evaluations) {
      const stability = e.competencies.find(c => c.name === "stability");
      stabilityMap.set(e.sessionId, stability?.score ?? 0);
    }

    // 5. Sort with strict tie-breaker
    const sorted = [...normalized].sort((a, b) => {
      // Rule 1: normalizedScore descending
      if (b.normalizedScore !== a.normalizedScore) {
        return b.normalizedScore - a.normalizedScore;
      }
      // Rule 2: stability score descending
      const stabA = stabilityMap.get(a.candidateId) ?? 0;
      const stabB = stabilityMap.get(b.candidateId) ?? 0;
      if (stabB !== stabA) {
        return stabB - stabA;
      }
      // Rule 3: candidateId lexicographic ascending
      return a.candidateId.localeCompare(b.candidateId);
    });

    // 6. Assign ranks
    const rankings: GlobalRankingEntry[] = sorted.map((s, index) => ({
      candidateId: s.candidateId,
      rank: index + 1,
      score: s,
    }));

    return { rankings, stats, cohortLabel };
  }
}
