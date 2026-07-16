/**
 * Event Trace Recorder
 *
 * Records detailed event traces with source, destination, and duration.
 * Pure trace recording, no business logic.
 */
// @ts-nocheck


import { EventTrace } from "./types";
import { DiagnosticEventRecorder } from "./DiagnosticEventRecorder";
import { CorrelationManager } from "./CorrelationManager";

export class EventTraceRecorder {
  private traces: EventTrace[] = [];
  private eventRecorder: DiagnosticEventRecorder;
  private correlationManager: CorrelationManager;
  private traceCounter: number = 0;
  private activeOperations: Map<string, number> = new Map();

  constructor(
    eventRecorder: DiagnosticEventRecorder,
    correlationManager: CorrelationManager
  ) {
    this.eventRecorder = eventRecorder;
    this.correlationManager = correlationManager;
  }

  /**
   * Start recording an operation trace
   */
  startTrace(
    eventType: string,
    source: string,
    destination: string,
    metadata: Record<string, unknown> = {}
  ): string {
    const traceId = this.generateTraceId();
    const correlationContext = this.correlationManager.getContext();

    const trace: EventTrace = {
      eventId: traceId,
      eventType,
      timestamp: new Date(),
      source,
      destination,
      duration: 0,
      correlationId: correlationContext?.correlationId ?? null,
      traceId: correlationContext?.traceId ?? null,
      metadata,
    };

    this.traces.push(trace);
    this.activeOperations.set(traceId, Date.now());

    this.eventRecorder.recordEvent("runtime", "trace_started", {
      traceId,
      eventType,
      source,
      destination,
      correlationId: trace.correlationId,
      timestamp: trace.timestamp,
    });

    return traceId;
  }

  /**
   * End recording an operation trace
   */
  endTrace(traceId: string, additionalMetadata: Record<string, unknown> = {}): void {
    const startTime = this.activeOperations.get(traceId);
    if (!startTime) {
      return;
    }

    const trace = this.traces.find(t => t.eventId === traceId);
    if (!trace) {
      this.activeOperations.delete(traceId);
      return;
    }

    const endTime = Date.now();
    trace.duration = endTime - startTime;
    trace.metadata = { ...trace.metadata, ...additionalMetadata };

    this.activeOperations.delete(traceId);

    this.eventRecorder.recordEvent("runtime", "trace_completed", {
      traceId,
      eventType: trace.eventType,
      source: trace.source,
      destination: trace.destination,
      duration: trace.duration,
      correlationId: trace.correlationId,
      timestamp: new Date(),
    });
  }

  /**
   * Record a complete trace (start and end in one call)
   */
  recordTrace(
    eventType: string,
    source: string,
    destination: string,
    duration: number,
    metadata: Record<string, unknown> = {}
  ): void {
    const traceId = this.generateTraceId();
    const correlationContext = this.correlationManager.getContext();

    const trace: EventTrace = {
      eventId: traceId,
      eventType,
      timestamp: new Date(),
      source,
      destination,
      duration,
      correlationId: correlationContext?.correlationId ?? null,
      traceId: correlationContext?.traceId ?? null,
      metadata,
    };

    this.traces.push(trace);

    this.eventRecorder.recordEvent("runtime", "trace_recorded", {
      traceId,
      eventType,
      source,
      destination,
      duration,
      correlationId: trace.correlationId,
      timestamp: trace.timestamp,
    });
  }

  /**
   * Get all traces
   */
  getTraces(): EventTrace[] {
    return [...this.traces];
  }

  /**
   * Get traces by correlation ID
   */
  getTracesByCorrelationId(correlationId: string): EventTrace[] {
    return this.traces.filter(t => t.correlationId === correlationId);
  }

  /**
   * Get traces by trace ID
   */
  getTracesByTraceId(traceId: string): EventTrace[] {
    return this.traces.filter(t => t.traceId === traceId);
  }

  /**
   * Get traces by source
   */
  getTracesBySource(source: string): EventTrace[] {
    return this.traces.filter(t => t.source === source);
  }

  /**
   * Get traces by destination
   */
  getTracesByDestination(destination: string): EventTrace[] {
    return this.traces.filter(t => t.destination === destination);
  }

  /**
   * Get traces by event type
   */
  getTracesByEventType(eventType: string): EventTrace[] {
    return this.traces.filter(t => t.eventType === eventType);
  }

  /**
   * Get traces in time range
   */
  getTracesInTimeRange(start: Date, end: Date): EventTrace[] {
    return this.traces.filter(t => t.timestamp >= start && t.timestamp <= end);
  }

  /**
   * Get slow traces (above threshold)
   */
  getSlowTraces(thresholdMs: number): EventTrace[] {
    return this.traces.filter(t => t.duration > thresholdMs);
  }

  /**
   * Get trace statistics
   */
  getTraceStatistics(): {
    totalTraces: number;
    averageDuration: number;
    maxDuration: number;
    minDuration: number;
    bySource: Record<string, number>;
    byDestination: Record<string, number>;
    byEventType: Record<string, number>;
  } {
    if (this.traces.length === 0) {
      return {
        totalTraces: 0,
        averageDuration: 0,
        maxDuration: 0,
        minDuration: 0,
        bySource: {},
        byDestination: {},
        byEventType: {},
      };
    }

    const durations = this.traces.map(t => t.duration);
    const averageDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
    const maxDuration = Math.max(...durations);
    const minDuration = Math.min(...durations);

    const bySource: Record<string, number> = {};
    const byDestination: Record<string, number> = {};
    const byEventType: Record<string, number> = {};

    for (const trace of this.traces) {
      bySource[trace.source] = (bySource[trace.source] || 0) + 1;
      byDestination[trace.destination] = (byDestination[trace.destination] || 0) + 1;
      byEventType[trace.eventType] = (byEventType[trace.eventType] || 0) + 1;
    }

    return {
      totalTraces: this.traces.length,
      averageDuration,
      maxDuration,
      minDuration,
      bySource,
      byDestination,
      byEventType,
    };
  }

  /**
   * Build trace path for a correlation ID
   */
  buildTracePath(correlationId: string): string {
    const traces = this.getTracesByCorrelationId(correlationId);
    const sortedTraces = traces.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    const lines: string[] = [];
    lines.push(`Trace Path: ${correlationId}`);
    lines.push(``);

    for (let i = 0; i < sortedTraces.length; i++) {
      const trace = sortedTraces[i];
      const timeStr = this.formatTimestamp(trace.timestamp);
      
      lines.push(`${timeStr}`);
      lines.push(`${trace.eventType}`);
      lines.push(`${trace.source} → ${trace.destination}`);
      lines.push(`${trace.duration} ms`);
      
      if (i < sortedTraces.length - 1) {
        lines.push(`↓`);
        lines.push(``);
      }
    }

    return lines.join('\n');
  }

  /**
   * Format timestamp
   */
  private formatTimestamp(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const ms = date.getMilliseconds().toString().padStart(3, '0');
    return `${hours}:${minutes}:${seconds}.${ms}`;
  }

  /**
   * Generate trace ID
   */
  private generateTraceId(): string {
    return `TRACE-${this.traceCounter++}-${Date.now().toString(36)}`;
  }

  /**
   * Clear all traces
   */
  clearTraces(): void {
    this.traces = [];
    this.activeOperations.clear();
    this.traceCounter = 0;

    this.eventRecorder.recordEvent("runtime", "trace_recorder_cleared", {
      timestamp: new Date(),
    });
  }

  /**
   * Get incomplete traces
   */
  getIncompleteTraces(): EventTrace[] {
    return this.traces.filter(t => t.duration === 0 && !this.activeOperations.has(t.eventId));
  }
}
