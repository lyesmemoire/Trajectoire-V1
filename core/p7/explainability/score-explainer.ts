import { ExplanationGraph, ExplainedScore, ScoreComponentNode } from "./explanation-contract";

/**
 * Score Explainer — Template-based text generation
 *
 * Transforms an ExplanationGraph into human-readable ExplainedScore.
 * Zero LLM. Pure deterministic template system.
 */
export function explainScore(graph: ExplanationGraph): ExplainedScore {
  const lines: string[] = [];
  lines.push(`Score ${graph.aggregated.finalScore.toFixed(1)} because:`);

  // Sort components by score descending for consistent output
  const sorted = [...graph.scoreComponents].sort((a, b) => b.computedScore - a.computedScore);

  for (const comp of sorted) {
    const weight = graph.aggregated.weightsSnapshot[comp.competency] ?? 0;
    const contribution = (comp.computedScore * weight).toFixed(1);
    const evidenceCount = comp.evidenceIds.length;
    const direction = comp.computedScore >= 50 ? "+" : "-";

    lines.push(
      `  ${direction} ${comp.competency}: ${comp.computedScore.toFixed(0)}/100 (weight ${(weight * 100).toFixed(0)}%, contribution ${contribution}) supported by ${evidenceCount} evidence(s)`
    );
  }

  // Append key evidence excerpts
  if (graph.evidences.length > 0) {
    lines.push("");
    lines.push("Key evidence:");
    // Show top evidences sorted by weight descending
    const topEvidences = [...graph.evidences]
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 5);

    for (const ev of topEvidences) {
      lines.push(`  • ${ev.rationale}`);
    }
  }

  return {
    value: graph.aggregated.finalScore,
    breakdown: graph.scoreComponents,
    evidence: graph.evidences,
    explanationText: lines.join("\n"),
  };
}
