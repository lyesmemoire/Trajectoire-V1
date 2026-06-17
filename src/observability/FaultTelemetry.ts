export type FaultSeverity = "INFO" | "WARN" | "CRITICAL";

export type FaultDomain =
  | "REPLAY"
  | "EVENT_ACCOUNTING"
  | "ORDERING"
  | "MEMORY"
  | "BACKPRESSURE"
  | "CIRCUIT"
  | "ATTACK";

export interface FaultEvent {
  timestamp: number;
  domain: FaultDomain;
  severity: FaultSeverity;

  mode?: string; // normal / stress / attack type
  runId?: string;

  message: string;

  metrics?: Record<string, number>;

  metadata?: Record<string, any>;
}

export interface FaultTrace {
  runId: string;
  events: FaultEvent[];
  summary: {
    total: number;
    critical: number;
    warnings: number;
  };
}

export class FaultTelemetry {
  private trace: FaultTrace;

  constructor(runId: string) {
    this.trace = {
      runId,
      events: [],
      summary: { total: 0, critical: 0, warnings: 0 },
    };
  }

  emit(event: FaultEvent) {
    this.trace.events.push(event);
    this.trace.summary.total++;
    if (event.severity === "CRITICAL") {
      this.trace.summary.critical++;
    }
    if (event.severity === "WARN") {
      this.trace.summary.warnings++;
    }
  }

  snapshot(): FaultTrace {
    return this.trace;
  }
}
