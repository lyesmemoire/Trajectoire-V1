// runtime/question-engine/pipeline/SelectorExecutionStep.ts
import { SelectorName } from "../models/SelectorName";

/**
 * Core tracking block for a single execution step in the pipeline.
 * Captures all determinism signals required for replay auditing.
 */
export interface SelectorExecutionStep {
  readonly selectorName: SelectorName;
  readonly selectorVersion: string;
  readonly startTimestamp: number;
  readonly endTimestamp: number;
  readonly durationMs: number;
  readonly confidence: number;
  readonly chosenValue: unknown;
  readonly rejectedValues: readonly unknown[];
  readonly policyOverridesApplied: readonly string[];
  readonly inputContextHash: string;
  readonly outputContextHash: string;
  readonly stepHash: string;
}
