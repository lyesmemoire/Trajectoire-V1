/**
 * Blueprint DSL CPR Distributed Trace
 * 
 * Manages distributed tracing across the cluster.
 */

import { ClusterManager } from './cluster-manager';

export interface TraceSpan {
  id: string;
  traceId: string;
  parentId?: string;
  nodeId: string;
  operation: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  status: SpanStatus;
  tags: Map<string, string>;
  logs: TraceLog[];
}

export enum SpanStatus {
  OK = 'OK',
  ERROR = 'ERROR',
  CANCELLED = 'CANCELLED',
}

export interface TraceLog {
  timestamp: number;
  message: string;
  level: LogLevel;
}

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

export interface Trace {
  id: string;
  spans: TraceSpan[];
  startTime: number;
  endTime?: number;
  duration?: number;
}

export class DistributedTrace {
  private clusterManager: ClusterManager;
  private traces: Map<string, Trace> = new Map();
  private spans: Map<string, TraceSpan> = new Map();
  private traceCounter: number = 0;
  private spanCounter: number = 0;

  constructor(clusterManager: ClusterManager) {
    this.clusterManager = clusterManager;
  }

  /**
   * Create new trace
   */
  public createTrace(): Trace {
    const trace: Trace = {
      id: `trace_${this.traceCounter++}`,
      spans: [],
      startTime: Date.now(),
    };

    this.traces.set(trace.id, trace);
    return trace;
  }

  /**
   * Create span
   */
  public createSpan(traceId: string, nodeId: string, operation: string, parentId?: string): TraceSpan {
    const span: TraceSpan = {
      id: `span_${this.spanCounter++}`,
      traceId,
      parentId,
      nodeId,
      operation,
      startTime: Date.now(),
      status: SpanStatus.OK,
      tags: new Map(),
      logs: [],
    };

    this.spans.set(span.id, span);

    const trace = this.traces.get(traceId);
    if (trace) {
      trace.spans.push(span);
    }

    return span;
  }

  /**
   * Finish span
   */
  public finishSpan(spanId: string, status: SpanStatus = SpanStatus.OK): void {
    const span = this.spans.get(spanId);

    if (span) {
      span.endTime = Date.now();
      span.duration = span.endTime - span.startTime;
      span.status = status;

      // Update trace end time
      const trace = this.traces.get(span.traceId);
      if (trace) {
        trace.endTime = Math.max(trace.endTime || 0, span.endTime);
        trace.duration = trace.endTime - trace.startTime;
      }
    }
  }

  /**
   * Add tag to span
   */
  public addTag(spanId: string, key: string, value: string): void {
    const span = this.spans.get(spanId);

    if (span) {
      span.tags.set(key, value);
    }
  }

  /**
   * Add log to span
   */
  public addLog(spanId: string, message: string, level: LogLevel = LogLevel.INFO): void {
    const span = this.spans.get(spanId);

    if (span) {
      span.logs.push({
        timestamp: Date.now(),
        message,
        level,
      });
    }
  }

  /**
   * Get trace by id
   */
  public getTrace(traceId: string): Trace | null {
    const trace = this.traces.get(traceId);
    return trace ? { ...trace, spans: [...trace.spans] } : null;
  }

  /**
   * Get span by id
   */
  public getSpan(spanId: string): TraceSpan | null {
    const span = this.spans.get(spanId);
    return span ? { ...span, tags: new Map(span.tags), logs: [...span.logs] } : null;
  }

  /**
   * Get all traces
   */
  public getAllTraces(): Trace[] {
    return Array.from(this.traces.values()).map(t => ({ ...t, spans: [...t.spans] }));
  }

  /**
   * Get traces in time range
   */
  public getTracesInRange(start: number, end: number): Trace[] {
    return Array.from(this.traces.values())
      .filter(t => t.startTime >= start && t.startTime <= end)
      .map(t => ({ ...t, spans: [...t.spans] }));
  }

  /**
   * Get spans by node
   */
  public getSpansByNode(nodeId: string): TraceSpan[] {
    return Array.from(this.spans.values())
      .filter(s => s.nodeId === nodeId)
      .map(s => ({ ...s, tags: new Map(s.tags), logs: [...s.logs] }));
  }

  /**
   * Get spans by operation
   */
  public getSpansByOperation(operation: string): TraceSpan[] {
    return Array.from(this.spans.values())
      .filter(s => s.operation === operation)
      .map(s => ({ ...s, tags: new Map(s.tags), logs: [...s.logs] }));
  }

  /**
   * Get spans by status
   */
  public getSpansByStatus(status: SpanStatus): TraceSpan[] {
    return Array.from(this.spans.values())
      .filter(s => s.status === status)
      .map(s => ({ ...s, tags: new Map(s.tags), logs: [...s.logs] }));
  }

  /**
   * Delete trace
   */
  public deleteTrace(traceId: string): boolean {
    const trace = this.traces.get(traceId);

    if (trace) {
      for (const span of trace.spans) {
        this.spans.delete(span.id);
      }
    }

    return this.traces.delete(traceId);
  }

  /**
   * Clear all traces
   */
  public clear(): void {
    this.traces.clear();
    this.spans.clear();
    this.traceCounter = 0;
    this.spanCounter = 0;
  }

  /**
   * Get trace statistics
   */
  public getStatistics(): {
    totalTraces: number;
    totalSpans: number;
    averageSpansPerTrace: number;
    averageDuration: number;
    errorRate: number;
  } {
    const totalSpans = this.spans.size;
    const averageSpansPerTrace = this.traces.size > 0 ? totalSpans / this.traces.size : 0;

    const completedTraces = Array.from(this.traces.values()).filter(t => t.endTime !== undefined);
    const durations = completedTraces.map(t => t.duration || 0);
    const averageDuration = durations.length > 0 ? durations.reduce((sum, d) => sum + d, 0) / durations.length : 0;

    const errorSpans = Array.from(this.spans.values()).filter(s => s.status === SpanStatus.ERROR);
    const errorRate = totalSpans > 0 ? errorSpans.length / totalSpans : 0;

    return {
      totalTraces: this.traces.size,
      totalSpans,
      averageSpansPerTrace,
      averageDuration,
      errorRate,
    };
  }

  /**
   * Validate distributed trace state
   */
  public validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    for (const [id, trace] of this.traces) {
      if (trace.id !== id) {
        errors.push(`Trace ID mismatch at ${id}`);
      }

      if (trace.startTime < 0) {
        errors.push(`Invalid start time in trace ${id}`);
      }

      if (trace.endTime !== undefined && trace.endTime < trace.startTime) {
        errors.push(`Invalid end time in trace ${id}`);
      }

      for (const span of trace.spans) {
        if (span.traceId !== trace.id) {
          errors.push(`Span ${span.id} belongs to wrong trace ${span.traceId}`);
        }
      }
    }

    for (const [id, span] of this.spans) {
      if (span.id !== id) {
        errors.push(`Span ID mismatch at ${id}`);
      }

      if (!this.clusterManager.getNode(span.nodeId)) {
        errors.push(`Span ${id} references non-existent node ${span.nodeId}`);
      }

      if (span.startTime < 0) {
        errors.push(`Invalid start time in span ${id}`);
      }

      if (span.endTime !== undefined && span.endTime < span.startTime) {
        errors.push(`Invalid end time in span ${id}`);
      }

      if (span.parentId && !this.spans.has(span.parentId)) {
        errors.push(`Span ${id} references non-existent parent ${span.parentId}`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Export traces to JSON
   */
  public export(): string {
    const data = Array.from(this.traces.values()).map(t => ({
      ...t,
      spans: t.spans.map(s => ({
        ...s,
        tags: Array.from(s.tags.entries()),
        logs: s.logs,
      })),
    }));
    return JSON.stringify(data, null, 2);
  }

  /**
   * Import traces from JSON
   */
  public import(json: string): void {
    const data = JSON.parse(json) as Trace[];

    for (const trace of data) {
      this.traces.set(trace.id, {
        ...trace,
        spans: [],
      });

      for (const span of trace.spans) {
        const spanData: TraceSpan = {
          ...span,
          tags: new Map(span.tags),
          logs: span.logs,
        };
        this.spans.set(span.id, spanData);
        this.traces.get(trace.id)!.spans.push(spanData);
      }

      this.traceCounter = Math.max(this.traceCounter, parseInt(trace.id.split('_')[1]) + 1);
    }
  }

  /**
   * Set cluster manager
   */
  public setClusterManager(clusterManager: ClusterManager): void {
    this.clusterManager = clusterManager;
  }

  /**
   * Get cluster manager
   */
  public getClusterManager(): ClusterManager {
    return this.clusterManager;
  }
}
