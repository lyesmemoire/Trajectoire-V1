/**
 * P7 Trace Contract
 * 
 * Re-exports the canonical RuntimeTrace types from the Gateway Collector.
 * P7 modules import from here to avoid direct coupling to the Gateway layer.
 */
// export type { RuntimeTrace, TurnTrace } from "../../apps/realtime-gateway/src/runtime/collector/runtime-trace";

// Temporary placeholder types - will be replaced after realtime-gateway migration
export interface RuntimeTrace {
  sessionId: string;
  timestamp: number;
  events: any[];
  turns: TurnTrace[];
}

export interface TurnTrace {
  turnId: string;
  startTime: number;
  endTime: number;
  input?: { timestamp: number };
  derived?: { latencyMs: number };
  index?: number;
}
