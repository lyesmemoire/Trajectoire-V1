import { RuntimeTrace, TurnTrace } from "../trace-contract";
import { CandidateEvaluation } from "../evaluation-contract";
import { Signal, SignalExtractor } from "../scoring-engine/scoring-contract";
import { TrustExtractor } from "../scoring-engine/extractors/trust-extractor";
import { StabilityExtractor } from "../scoring-engine/extractors/stability-extractor";
import { ExplanationGraph, ExplainedScore } from "./explanation-contract";
import { buildEvidence } from "./evidence-builder";
import { buildSignalNodes, buildScoreComponentNodes, buildExplanationGraph } from "./dag-builder";
import { explainScore } from "./score-explainer";

/**
 * Trace Mapper — Main entry point for P7.4
 *
 * Bridges 3 worlds:
 *   P6 Trace (conversation) → P7 Signals (metrics) → Explanation Graph
 *
 * Pure function: mapTraceToExplanation(trace, evaluation) → ExplanationGraph
 */

const DEFAULT_EXTRACTORS: SignalExtractor[] = [
  new TrustExtractor(),
  new StabilityExtractor(),
];

export function mapTraceToExplanation(
  trace: RuntimeTrace,
  evaluation: CandidateEvaluation,
  extractors: SignalExtractor[] = DEFAULT_EXTRACTORS,
): ExplanationGraph {
  // 1. Re-extract signals (deterministic — same trace → same signals)
  const allSignals: Signal[] = [];
  for (const extractor of extractors) {
    allSignals.push(...extractor.extract(trace));
  }

  // 2. Build SignalNodes
  const signalNodes = buildSignalNodes(allSignals, trace.sessionId);

  // 3. Build EvidenceNodes from pattern detection
  const evidences = buildEvidence(allSignals, trace);

  // 4. Build ScoreComponentNodes
  const scoreComponents = buildScoreComponentNodes(
    evaluation.competencies,
    evidences,
    trace.sessionId,
  );

  // 5. Assemble full DAG
  return buildExplanationGraph(
    trace.sessionId,
    signalNodes,
    evidences,
    scoreComponents,
    evaluation.score,
  );
}

/**
 * Convenience: full pipeline from trace + evaluation → ExplainedScore
 */
export function explainFromTrace(
  trace: RuntimeTrace,
  evaluation: CandidateEvaluation,
): ExplainedScore {
  const graph = mapTraceToExplanation(trace, evaluation);
  return explainScore(graph);
}
