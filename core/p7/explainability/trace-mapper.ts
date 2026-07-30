import { RuntimeTrace } from "../trace-contract.js";
import { CandidateEvaluation } from "../evaluation-contract.js";
import { Signal, SignalExtractor } from "../scoring-engine/scoring-contract.js";
import { TrustExtractor } from "../scoring-engine/extractors/trust-extractor.js";
import { StabilityExtractor } from "../scoring-engine/extractors/stability-extractor.js";
import { ExplanationGraph, ExplainedScore } from "./explanation-contract.js";
import { buildEvidence } from "./evidence-builder.js";
import { buildSignalNodes, buildScoreComponentNodes, buildExplanationGraph } from "./dag-builder.js";
import { explainScore } from "./score-explainer.js";

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

export function mapTraceToExplanation(trace: RuntimeTrace, evaluation: CandidateEvaluation, extractors: SignalExtractor[] = DEFAULT_EXTRACTORS, ): ExplanationGraph {
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
export function explainFromTrace(trace: RuntimeTrace, evaluation: CandidateEvaluation, ): ExplainedScore {
  const graph = mapTraceToExplanation(trace, evaluation);
  return explainScore(graph);
}
