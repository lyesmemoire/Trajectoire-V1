import { SILEvent } from "./sil-events";

export type SILStatus =
  | "INIT"
  | "STARTING"
  | "RECOVERING"
  | "RUNNING"
  | "WAITING"
  | "EVALUATING"
  | "COMPLETED"
  | "FAILED";

export interface SILRuntimeContext {
  p6State: unknown;
  p7State: unknown;
  cache: unknown;
}

export interface SILState {
  tenantId: string;
  sessionId: string;
  status: SILStatus;

  pointer: number;
  eventLog: SILEvent[];

  runtimeContext: SILRuntimeContext;

  lastCheckpointHash: string;
}

export interface SILCheckpoint {
  sessionId: string;
  pointer: number;
  lastEventId: string;
  lastEventHash: string;
  runtimeStateHash: string;
  timestamp: number;
}

export function createInitialState(tenantId: string, sessionId: string): SILState {
  return {
    tenantId,
    sessionId,
    status: "INIT",
    pointer: 0,
    eventLog: [],
    runtimeContext: {
      p6State: null,
      p7State: null,
      cache: null,
    },
    lastCheckpointHash: "0",
  };
}
