// src/distributed/core/types.ts

/**
 * Core types shared across the distributed runtime.
 */
export interface DistributedTask {
  id: string;
  /**
   * CERT – full certification run
   * REPLAY – replay validation only
   * CHAOS – chaos injection only
   * STRESS – generic stress test
   */
  type: "CERT" | "REPLAY" | "CHAOS" | "STRESS";
  payload: unknown;
  createdAt: number;
}

export interface NodeStatus {
  nodeId: string;
  /**
   * ALIVE – heartbeat received within window
   * DEAD – missed several heartbeats
   * DEGRADED – alive but load high or trust low (placeholder)
   */
  status: "ALIVE" | "DEAD" | "DEGRADED";
  lastHeartbeat: number;
  /**
   * Approximate load metric (0‑1). 0 = idle, 1 = saturated.
   */
  load: number;
}
