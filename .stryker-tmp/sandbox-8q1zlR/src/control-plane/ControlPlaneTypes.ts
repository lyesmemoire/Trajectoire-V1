// @ts-nocheck
export enum ControlPlaneState {
  START = "START",
  WARMUP = "WARMUP",
  RUNNING = "RUNNING",
  DEGRADED = "DEGRADED",
  SAFE_STOP = "SAFE_STOP",
  SHUTDOWN = "SHUTDOWN"
}

export interface ControlPlaneSnapshot {
  state: ControlPlaneState;
  healthScore: number; // 0..100
  activeNodes: number;
  failedNodes: number;
  trustAvg: number; // 0..1
  replaySuccessRate: number; // 0..1
  lastGovernorAction?: string;
  timestamp: number;
}

export interface HealthMetrics {
  trustAvg: number;
  replaySuccessRate: number;
  nodeAvailability: number; // ratio alive/total
  queueSaturation: number; // queued tasks / max capacity
  governorInterventions: number;
}

export type GovernorAction = "THROTTLE" | "STOP" | "NONE";

export interface GovernorDecision {
  action: GovernorAction;
  reason: string;
}
