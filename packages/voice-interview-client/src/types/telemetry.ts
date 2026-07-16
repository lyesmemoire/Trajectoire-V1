/**
 * Telemetry types for client-side observability.
 */

export interface LatencyMetric {
  readonly name: string;
  readonly valueMs: number;
  readonly timestamp: number;
}

export interface SpanContext {
  readonly traceId: string;
  readonly spanId: string;
  readonly correlationId: string;
}

export interface TelemetrySnapshot {
  readonly sttLatencyMs: number | null;
  readonly llmLatencyMs: number | null;
  readonly ttsLatencyMs: number | null;
  readonly roundTripMs: number | null;
  readonly wsLatencyMs: number | null;
  readonly currentState: string;
  readonly currentPhase: string | null;
  readonly protocolVersion: number;
  readonly socketStatus: string;
  readonly retryCount: number;
  readonly traceId: string | null;
  readonly correlationId: string | null;
}

export interface TelemetryExporterSink {
  exportMetric(metric: LatencyMetric): void;
  exportSpan(span: SpanContext, name: string, durationMs: number): void;
  flush(): Promise<void>;
}
