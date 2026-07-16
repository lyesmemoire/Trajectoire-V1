/**
 * Pluggable telemetry exporter sink.
 * Provides a console-based default and a no-op for production.
 */

import type { TelemetryExporterSink, LatencyMetric, SpanContext } from "../types/telemetry.js";

export class ConsoleTelemetryExporter implements TelemetryExporterSink {
  exportMetric(metric: LatencyMetric): void {
    console.debug(`[Telemetry] Metric: ${metric.name} = ${metric.valueMs}ms`);
  }

  exportSpan(span: SpanContext, name: string, durationMs: number): void {
    console.debug(`[Telemetry] Span: ${name} (${durationMs}ms) trace=${span.traceId}`);
  }

  async flush(): Promise<void> {
    // Console exporter has nothing to flush
  }
}

export class NoOpTelemetryExporter implements TelemetryExporterSink {
  exportMetric(_metric: LatencyMetric): void {
    // intentionally empty
  }

  exportSpan(_span: SpanContext, _name: string, _durationMs: number): void {
    // intentionally empty
  }

  async flush(): Promise<void> {
    // intentionally empty
  }
}
