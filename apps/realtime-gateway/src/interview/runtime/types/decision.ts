// runtime/types/decision.ts
/** Shared decision types */
import { Brand } from "./brand";

export type DecisionId = Brand<string, "DecisionId">;

export interface ConfidenceBreakdown {
  readonly topicConfidence: number;
  readonly difficultyConfidence: number;
  readonly policyConfidence: number;
  readonly communicationConfidence: number;
  readonly finalConfidence: number;
}
