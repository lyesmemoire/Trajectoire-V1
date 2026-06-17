// runtime/question-engine/pipeline/SelectorResultEnvelope.ts
import { SelectorName } from "../models/SelectorName";
import { SelectorExecutionMetrics } from "./SelectorExecutionMetrics";
import { DecisionTraceEvent } from "../models/DecisionTraceEvent";

/**
 * Standardized output format for all deterministic selectors.
 * Unifies trace delegation, metrics, and deterministic hashing
 * into a single pipeline-ready contract.
 */
export interface SelectorResultEnvelope<T> {
  readonly value: T;
  readonly confidence: number;
  readonly selectorName: SelectorName;
  readonly selectorVersion: string;
  readonly inputHash: string; // from hashObjectStable
  readonly outputHash: string; // from hashObjectStable
  readonly executionMetrics: SelectorExecutionMetrics;
  readonly traceEvents: readonly DecisionTraceEvent[];
  readonly deterministicReplayKey: string;
}
