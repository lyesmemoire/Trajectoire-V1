// runtime/question-engine/pipeline/SelectorExecutionMetrics.ts
/**
 * Strict tracking metrics for a selector execution.
 */
export interface SelectorExecutionMetrics {
  readonly memoryFootprintEstimate: number; // serialized_context_size + serialized_trace_size
  readonly policyCountApplied: number;
  readonly tieBreakOccurred: boolean;
  readonly selectorLatencyNs: number; // calculated from RuntimeClock (or ms if Ns not available)
}
