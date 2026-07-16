// @ts-nocheck
import { P7EvaluatorClient, EvaluationCommand, EvaluationResult } from "../../contracts/p7-evaluator";

/**
 * MockP7EvaluatorClient — Test mock
 * 
 * Returns a structurally valid EvaluationResult without triggering
 * the real ScoringEngine/TraceMapper/ReportBuilder pipeline.
 */
export class MockP7EvaluatorClient implements P7EvaluatorClient {
  async evaluate(command: EvaluationCommand): Promise<EvaluationResult> {
    return {
      sessionId: command.sessionId,
      evaluation: {
        sessionId: command.sessionId,
        score: 85,
        competencies: [],
        evidence: [],
        summary: {
          strengths: [],
          weaknesses: [],
          hiringRecommendation: "yes",
          finalComment: "Mocked P7 evaluation"
        },
        metadata: {
          version: "P7.1",
          generatedAt: 0,
          sourceHash: "mock-hash",
          deterministic: true
        }
      },
      explanationGraph: {
        sessionId: command.sessionId,
        aggregated: {
          id: "agg_mock",
          finalScore: 85,
          componentIds: [],
          weightsSnapshot: {},
          traceability: { sessionId: command.sessionId, turnIndex: 0 }
        },
        scoreComponents: [],
        signals: [],
        evidences: []
      },
      reportId: `mock-report-${command.sessionId}`,
      reportHash: "mock-report-hash",
      evaluationHash: "mock-eval-hash"
    };
  }
}
