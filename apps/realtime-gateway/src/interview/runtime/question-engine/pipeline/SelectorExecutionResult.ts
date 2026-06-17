// runtime/question-engine/pipeline/SelectorExecutionResult.ts
import { PipelineExecutionId } from "./PipelineExecutionId";
import { SelectorExecutionStep } from "./SelectorExecutionStep";
import { ObjectiveSelectorContext } from "../selectors/shared/selectorContext";

/**
 * Result of the entire deterministic selector pipeline.
 * Contains the final immutable context, metrics for each step,
 * and a pipeline-level determinism hash.
 */
export interface SelectorExecutionResult {
  readonly executionId: PipelineExecutionId;
  readonly pipelineHash: string; // Aggregate hash of all stepHashes
  readonly totalDurationMs: number;
  readonly steps: readonly SelectorExecutionStep[];
  readonly finalContext: ObjectiveSelectorContext; // Assuming objective selector is always last for now
}
