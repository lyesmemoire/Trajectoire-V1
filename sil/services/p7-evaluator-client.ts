import { EvaluationCommand, EvaluationResult, P7EvaluatorClient } from "../contracts/p7-evaluator";
import { ScoringEngine } from "../../core/p7/scoring-engine/scoring-engine";
import { mapTraceToExplanation } from "../../core/p7/explainability/trace-mapper";
import { ReportBuilder } from "../../core/p7/report/report-builder";
import * as crypto from "crypto";

/**
 * RealP7EvaluatorClient — Production P7 Adapter
 * 
 * Orchestrates the complete evaluation pipeline:
 *   RuntimeTrace → ScoringEngine → TraceMapper → ReportBuilder → EvaluationResult
 * 
 * Pure sequential pipeline. No side effects beyond computation.
 * Deterministic: same trace → same result → same hashes.
 */
export class RealP7EvaluatorClient implements P7EvaluatorClient {
  private scoringEngine = new ScoringEngine();
  private reportBuilder = new ReportBuilder();

  async evaluate(command: EvaluationCommand): Promise<EvaluationResult> {
    try {
      const { sessionId, runtimeTrace } = command;

      // Step 1: Scoring Engine → CandidateEvaluation
      const evaluation = this.scoringEngine.evaluate(runtimeTrace);

      // Step 2: Trace Mapper → ExplanationGraph (DAG)
      const explanationGraph = mapTraceToExplanation(runtimeTrace, evaluation);

      // Freeze non-deterministic timestamps before report generation
      // generatedAt is operational, not a decision invariant
      const deterministicEvaluation = {
        ...evaluation,
        metadata: { ...evaluation.metadata, generatedAt: 0 }
      };

      // Step 3: Report Builder → EvaluationReport
      const reportInput = {
        tracePointers: {
          sessionId,
          turnIds: runtimeTrace.turns.map((_, i) => `turn_${i}`),
          journalHashes: runtimeTrace.turns
            .filter(t => t.p5 !== null)
            .map(t => t.p5!.snapshotHash),
        },
        evaluation: deterministicEvaluation,
        explanation: explanationGraph,
        ranking: {
          candidateId: sessionId,
          rank: 1,
          score: {
            candidateId: sessionId,
            rawScore: evaluation.score,
            normalizedScore: evaluation.score,
            percentile: 1,
          },
        },
        cohortSize: 1,
      };

      const report = this.reportBuilder.build(reportInput);

      // Step 4: Compute evaluationHash for audit/forensics
      const evaluationHash = crypto.createHash("sha256")
        .update(JSON.stringify({
          score: evaluation.score,
          competencies: evaluation.competencies,
          evidence: evaluation.evidence,
        }))
        .digest("hex");

      return {
        sessionId,
        evaluation,
        explanationGraph,
        reportId: report.reportId,
        reportHash: report.metadata.deterministicHash,
        evaluationHash,
      };
    } catch (e: unknown) {
      throw new Error(`P7_EVALUATION_FAILED: ${e.message}`);
    }
  }
}
