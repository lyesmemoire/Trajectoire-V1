// @ts-nocheck
export type SessionId = string;
export type EventId = string;

export type SILStateStatus =
  | "INIT"
  | "STARTING"
  | "RUNNING"
  | "EVALUATING"
  | "PERSISTING"
  | "COMPLETED"
  | "FAILED"
  | "RECOVERING";

// ---------------------------------------------------------
// 1. COMMAND API (Write Path)
// ---------------------------------------------------------

export interface SILPublicAPI {
  publish(event: {
    eventId: string;
    type: string;
    sessionId: SessionId;
    tenantId: string;
    timestamp: number;
    signature: string;
    payload?: unknown;
  }): Promise<void>;

  // Queries
  getSessionState(query: GetSessionStateQuery): Promise<GetSessionStateResult>;
  getReport(query: GetReportQuery): Promise<GetReportResult>;
}

// ---------------------------------------------------------
// 2. QUERY API (Read Path)
// ---------------------------------------------------------

export interface GetSessionStateQuery {
  tenantId: string;
  sessionId: SessionId;
}

export interface GetSessionStateResult {
  sessionId: SessionId;
  state: SILStateStatus;
  lastEventId?: EventId;
  pointer: number;
  health: "OK" | "DEGRADED" | "CORRUPTED" | "RECOVERED";
}

export interface GetReportQuery {
  tenantId: string;
  sessionId: SessionId;
}

export interface GetReportResult {
  sessionId: SessionId;
  report: {
    reportId: string;
    reportHash: string;
    score: number;
    explanationGraph: unknown;
    createdAt: number;
  } | null;
  status: "AVAILABLE" | "PENDING" | "NOT_FOUND";
}

// ---------------------------------------------------------
// 3. EVENT STREAM API (Audit / Replay)
// ---------------------------------------------------------

export interface SubscribeEventsQuery {
  tenantId: string;
  sessionId: SessionId;
}

export interface SILEventEnvelope {
  sessionId: SessionId;
  eventId: EventId;
  type: string;
  payload: unknown;
  timestamp: number;
  metadata: {
    source: "gateway" | "sil" | "p6" | "p7" | "storage";
    pointer: number;
    hash: string;
  };
}
