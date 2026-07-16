// @ts-nocheck
import { CandidateEvaluation } from "../../evaluation-contract.js";
import { ExplanationGraph } from "../../explainability/explanation-contract.js";
import { GlobalRankingEntry } from "../../ranking/ranking-contract.js";
import { ReportSummary, Verdict } from "../report-contract.js";

export function buildSummary(
  evaluation: CandidateEvaluation,
  ranking: GlobalRankingEntry,
  explanation: ExplanationGraph,
  cohortSize: number
): ReportSummary {
  
  const score = evaluation.score;
  let verdict: Verdict = "MAYBE";
  if (score >= 80) verdict = "STRONG_HIRE";
  else if (score >= 60) verdict = "HIRE";
  else if (score < 40) verdict = "NO_HIRE";

  const strengths: string[] = [];
  const weaknesses: string[] = [];

  // Very deterministic heuristic: scores > 60 = strength, scores < 40 = weakness
  const sortedComps = [...explanation.scoreComponents].sort((a, b) => b.computedScore - a.computedScore);
  
  for (const comp of sortedComps) {
    if (comp.computedScore >= 60) {
      strengths.push(`High ${comp.competency} (${comp.computedScore}/100)`);
    } else if (comp.computedScore < 40) {
      weaknesses.push(`Low ${comp.competency} (${comp.computedScore}/100)`);
    }
  }

  // Key evidence: Top 3 evidences by weight
  const topEvidences = [...explanation.evidences]
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 3)
    .map(ev => ({
      id: ev.id,
      excerpt: ev.excerpt,
      rationale: ev.rationale,
    }));

  return {
    globalScore: score,
    rank: ranking.rank,
    cohortSize,
    verdict,
    strengths,
    weaknesses,
    keyEvidence: topEvidences,
  };
}
