export type FailureType =
  | "P6_TIMEOUT"
  | "P7_TIMEOUT"
  | "INVALID_EVENT"
  | "STATE_CORRUPTION"
  | "CRYPTOGRAPHIC_FAILURE";

export type SILEventType =
  | "SESSION_CREATED"
  | "USER_MESSAGE"
  | "P6_RUNTIME_STARTED"
  | "P6_RUNTIME_COMMITTED"
  | "P6_RUNTIME_COMPLETED"
  | "P6_RUNTIME_FAILED"
  | "TRACE_RECOVERY_STARTED"
  | "TRACE_RECOVERY_COMPLETED"
  | "TRACE_RECOVERY_FAILED"
  | "P7_EVALUATION_STARTED"
  | "P7_EVALUATION_COMPLETED"
  | "P7_EVALUATION_FAILED"
  | "REPORT_GENERATED"
  | "RUNTIME_PERSISTED"
  | "REPORT_PERSISTED"
  | "CHECKPOINT_PERSISTED"
  | "SESSION_COMPLETED"
  | "FAILURE_DETECTED"
  | "RECOVERY_TRIGGERED";

export interface IncomingSILEvent {
  eventId: string;
  type: SILEventType;
  sessionId: string;
  tenantId: string;
  timestamp: number;
  
  // Security Envelope from Gateway
  signature: string;

  // Type-specific payload
  payload?: any;
  error?: FailureType;
  details?: any;
}

export interface SILEvent extends IncomingSILEvent {
  hash: string;
  previousEventHash?: string; // For internal hash-chain integrity
}
