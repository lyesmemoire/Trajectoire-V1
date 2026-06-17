import type { StableHash } from "@core/types/StableHash";
import type { ConfidenceScore } from "../../types/ConfidenceScore";

export interface SelectorTraceEvent {
  selector: string;
  selectorVersion: string;
  chosen: string;
  rejected?: string[];
  reasons: string[];
  timestamp: number;
}

export interface SelectorResultEnvelope<T> {
  value: T;
  confidence: ConfidenceScore;

  selectorName: string;
  selectorVersion: string;

  inputHash: StableHash;
  outputHash: StableHash;

  deterministicReplayKey: StableHash;

  executionMetrics: {
    durationMs: number;
    candidateCount?: number;
    policyCount?: number;
  };

  traceEvents: readonly SelectorTraceEvent[];
}
