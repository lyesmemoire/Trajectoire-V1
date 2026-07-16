// @ts-nocheck
export type LogLevel = 'info' | 'warn' | 'error' | 'debug';

export interface LogEntry {
  traceId: string;
  tenantId: string;
  sessionId: string;
  stage: string;
  level?: LogLevel;
  latencyMs?: number;
  error?: unknown;
  message?: string;
}

export interface StructuredLogger {
  log(entry: LogEntry): Promise<void>;
  info(entry: Omit<LogEntry, 'level'>): Promise<void>;
  warn(entry: Omit<LogEntry, 'level'>): Promise<void>;
  error(entry: Omit<LogEntry, 'level'>): Promise<void>;
  debug(entry: Omit<LogEntry, 'level'>): Promise<void>;
}
