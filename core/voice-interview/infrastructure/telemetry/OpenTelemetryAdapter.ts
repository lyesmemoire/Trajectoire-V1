import { trace, metrics, SpanStatusCode, Histogram, Counter } from '@opentelemetry/api';
import type { TelemetryPort } from "../../application/ports/SystemPorts.js";

const TRACER_NAME = 'voice-interview-engine';
const METER_NAME = 'voice-interview-metrics';

export class OpenTelemetryAdapter implements TelemetryPort {
  private readonly tracer = trace.getTracer(TRACER_NAME);
  private readonly meter = metrics.getMeter(METER_NAME);

  // Cached instruments
  private readonly histograms = new Map<string, Histogram>();
  private readonly counters = new Map<string, Counter>();

  track(event: string, payload: Record<string, string | number | boolean | string[]>): void {
    const span = trace.getActiveSpan();
    if (span) {
      span.addEvent(event, payload);
    }
  }

  recordHistogram(name: string, value: number, attributes?: Record<string, string | number>): void {
    if (!this.histograms.has(name)) {
      this.histograms.set(name, this.meter.createHistogram(name));
    }
    const histogram = this.histograms.get(name);
    if (histogram) {
      histogram.record(value, attributes);
    }
  }

  incrementCounter(name: string, value: number = 1, attributes?: Record<string, string | number>): void {
    if (!this.counters.has(name)) {
      this.counters.set(name, this.meter.createCounter(name));
    }
    const counter = this.counters.get(name);
    if (counter) {
      counter.add(value, attributes);
    }
  }

  async startSpan<T>(name: string, correlationId: string, work: (spanId: string) => Promise<T>): Promise<T> {
    return this.tracer.startActiveSpan(name, { attributes: { correlationId } }, async (span) => {
      try {
        const result = await work(span.spanContext().spanId);
        span.setStatus({ code: SpanStatusCode.OK });
        return result;
      } catch (error) {
        span.recordException(error instanceof Error ? error : new Error(String(error)));
        span.setStatus({ code: SpanStatusCode.ERROR, message: error instanceof Error ? error.message : 'Unknown error' });
        throw error;
      } finally {
        span.end();
      }
    });
  }
}
