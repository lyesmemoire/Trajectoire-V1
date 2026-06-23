export interface LogEntry {
  traceId: string;
  tenantId: string;
  sessionId: string;
  stage: string;
  latencyMs?: number;
}

export interface StructuredLogger {
  log(entry: LogEntry): Promise<void>;
}
