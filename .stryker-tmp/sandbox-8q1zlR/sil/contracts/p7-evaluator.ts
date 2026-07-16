// @ts-nocheck
import { RuntimeTrace } from "../../core/p7/trace-contract";
import { CandidateEvaluation } from "../../core/p7/evaluation-contract";
import { ExplanationGraph } from "../../core/p7/explainability/explanation-contract";

export interface EvaluationCommand {
  sessionId: string;
  runtimeTrace: RuntimeTrace;
}

export interface EvaluationResult {
  sessionId: string;
  evaluation: CandidateEvaluation;
  explanationGraph: ExplanationGraph;
  reportId: string;
  reportHash: string;
  evaluationHash: string;
}

export interface P7EvaluatorClient {
  evaluate(command: EvaluationCommand): Promise<EvaluationResult>;
}
