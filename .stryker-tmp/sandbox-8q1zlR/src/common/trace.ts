// @ts-nocheck
// Shared event contract for tick traces
export interface TickTrace {
  tickId: number;
  ts: number;
  nodeId: string;
  isLeader: boolean;
  runId?: string; // deterministic run identifier for CI trace correlation
  traceVersion?: number; // schema version guard
  // Optional causal annotation – populated only by analysis tools, not by the runtime.
  cause?: {
    type: "timeout" | "quorum" | "network" | "unknown";
    details?: Record<string, any>;
  };
}
