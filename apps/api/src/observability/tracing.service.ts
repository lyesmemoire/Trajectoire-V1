/**
 * Tracing Service
 * Provides custom tracing capabilities with correlation IDs and span management
 */

import { Injectable, Scope } from '@nestjs/common';
import {
  trace,
  context,
  Span,
  SpanStatusCode,
  SpanKind,
  Attributes,
} from '@opentelemetry/api';
import { v4 as uuidv4 } from 'uuid';

export interface TracingOptions {
  name: string;
  attributes?: Attributes;
  kind?: SpanKind;
}

export interface GraphExecution {
  graphId: string;
  executionId: string;
  correlationId: string;
  spanId: string;
  startTime: Date;
  endTime?: Date;
  status: 'running' | 'completed' | 'failed';
  error: Error | undefined;
}

@Injectable({ scope: Scope.TRANSIENT })
export class TracingService {
  private readonly tracer = trace.getTracer('trajectoire-api', '1.0.0');
  private graphExecutions: Map<string, GraphExecution> = new Map();

  /**
   * Start a new span
   */
  startSpan(options: TracingOptions): Span {
    const span = this.tracer.startSpan(options.name, {
      kind: options.kind || SpanKind.INTERNAL,
      attributes: options.attributes || {},
    });

    return span;
  }

  /**
   * Start a new span with automatic context management
   */
  async withSpan<T>(
    options: TracingOptions,
    fn: (span: Span) => Promise<T>,
  ): Promise<T> {
    const span = this.startSpan(options);

    try {
      const result = await context.with(
        trace.setSpan(context.active(), span),
        async () => {
          return await fn(span);
        },
      );

      span.setStatus({ code: SpanStatusCode.OK });
      span.end();

      return result;
    } catch (error) {
      span.recordException(error as Error);
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: (error as Error).message,
      });
      span.end();
      throw error;
    }
  }

  /**
   * Get the current span from context
   */
  getCurrentSpan(): Span | undefined {
    return trace.getSpan(context.active());
  }

  /**
   * Add attributes to the current span
   */
  addAttributes(attributes: Attributes): void {
    const span = this.getCurrentSpan();
    if (span) {
      span.setAttributes(attributes);
    }
  }

  /**
   * Add an event to the current span
   */
  addEvent(name: string, attributes?: Attributes): void {
    const span = this.getCurrentSpan();
    if (span) {
      span.addEvent(name, attributes);
    }
  }

  /**
   * Record an exception in the current span
   */
  recordException(error: Error): void {
    const span = this.getCurrentSpan();
    if (span) {
      span.recordException(error);
      span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
    }
  }

  /**
   * Generate a correlation ID
   */
  generateCorrelationId(): string {
    return uuidv4();
  }

  /**
   * Generate a span ID
   */
  generateSpanId(): string {
    return uuidv4();
  }

  /**
   * Generate a graph execution ID
   */
  generateGraphExecutionId(): string {
    return uuidv4();
  }

  /**
   * Start a graph execution trace
   */
  startGraphExecution(graphId: string): GraphExecution {
    const executionId = this.generateGraphExecutionId();
    const correlationId = this.generateCorrelationId();
    const spanId = this.generateSpanId();

    const execution: GraphExecution = {
      graphId,
      executionId,
      correlationId,
      spanId,
      startTime: new Date(),
      status: 'running',
      error: undefined,
    };

    this.graphExecutions.set(executionId, execution);

    // Start a span for the graph execution
    const span = this.startSpan({
      name: 'graph.execution',
      kind: SpanKind.INTERNAL,
      attributes: {
        'graph.id': graphId,
        'execution.id': executionId,
        'correlation.id': correlationId,
        'span.id': spanId,
      },
    });

    return execution;
  }

  /**
   * Complete a graph execution trace
   */
  completeGraphExecution(executionId: string, error?: Error): void {
    const execution = this.graphExecutions.get(executionId);
    if (!execution) return;

    execution.endTime = new Date();
    execution.status = error ? 'failed' : 'completed';
    execution.error = error;

    if (error) {
      this.recordException(error);
    }

    this.graphExecutions.delete(executionId);
  }

  /**
   * Get a graph execution by ID
   */
  getGraphExecution(executionId: string): GraphExecution | undefined {
    return this.graphExecutions.get(executionId);
  }

  /**
   * Get all active graph executions
   */
  getActiveGraphExecutions(): GraphExecution[] {
    return Array.from(this.graphExecutions.values());
  }

  /**
   * Trace a graph operation
   */
  async traceGraphOperation<T>(
    graphId: string,
    operation: string,
    fn: (span: Span) => Promise<T>,
    attributes?: Record<string, unknown>,
  ): Promise<T> {
    const execution = this.startGraphExecution(graphId);

    return this.withSpan(
      {
        name: `graph.${operation}`,
        kind: SpanKind.INTERNAL,
        attributes: {
          'graph.id': graphId,
          'execution.id': execution.executionId,
          'correlation.id': execution.correlationId,
          'span.id': execution.spanId,
          ...attributes,
        },
      },
      async (span) => {
        try {
          const result = await fn(span);
          this.completeGraphExecution(execution.executionId);
          return result;
        } catch (error) {
          this.completeGraphExecution(execution.executionId, error as Error);
          throw error;
        }
      },
    );
  }

  /**
   * Trace a matching operation
   */
  async traceMatchingOperation<T>(
    candidateId: string,
    jobId: string,
    operation: string,
    fn: (span: Span) => Promise<T>,
    attributes?: Record<string, unknown>,
  ): Promise<T> {
    const correlationId = this.generateCorrelationId();
    const spanId = this.generateSpanId();

    return this.withSpan(
      {
        name: `matching.${operation}`,
        kind: SpanKind.INTERNAL,
        attributes: {
          'candidate.id': candidateId,
          'job.id': jobId,
          'correlation.id': correlationId,
          'span.id': spanId,
          ...attributes,
        },
      },
      fn,
    );
  }

  /**
   * Trace a search operation
   */
  async traceSearchOperation<T>(
    query: string,
    operation: string,
    fn: (span: Span) => Promise<T>,
    attributes?: Record<string, unknown>,
  ): Promise<T> {
    const correlationId = this.generateCorrelationId();
    const spanId = this.generateSpanId();

    return this.withSpan(
      {
        name: `search.${operation}`,
        kind: SpanKind.INTERNAL,
        attributes: {
          'search.query': query,
          'correlation.id': correlationId,
          'span.id': spanId,
          ...attributes,
        },
      },
      fn,
    );
  }

  /**
   * Trace a copilot operation
   */
  async traceCopilotOperation<T>(
    sessionId: string,
    operation: string,
    fn: (span: Span) => Promise<T>,
    attributes?: Record<string, unknown>,
  ): Promise<T> {
    const correlationId = this.generateCorrelationId();
    const spanId = this.generateSpanId();

    return this.withSpan(
      {
        name: `copilot.${operation}`,
        kind: SpanKind.INTERNAL,
        attributes: {
          'session.id': sessionId,
          'correlation.id': correlationId,
          'span.id': spanId,
          ...attributes,
        },
      },
      fn,
    );
  }

  /**
   * Trace a dashboard operation
   */
  async traceDashboardOperation<T>(
    userId: string,
    operation: string,
    fn: (span: Span) => Promise<T>,
    attributes?: Record<string, unknown>,
  ): Promise<T> {
    const correlationId = this.generateCorrelationId();
    const spanId = this.generateSpanId();

    return this.withSpan(
      {
        name: `dashboard.${operation}`,
        kind: SpanKind.INTERNAL,
        attributes: {
          'user.id': userId,
          'correlation.id': correlationId,
          'span.id': spanId,
          ...attributes,
        },
      },
      fn,
    );
  }

  /**
   * Trace an API operation
   */
  async traceApiOperation<T>(
    method: string,
    path: string,
    fn: (span: Span) => Promise<T>,
    attributes?: Record<string, unknown>,
  ): Promise<T> {
    const correlationId = this.generateCorrelationId();
    const spanId = this.generateSpanId();

    return this.withSpan(
      {
        name: `api.${method.toLowerCase()}.${path.replace(/\//g, '.')}`,
        kind: SpanKind.SERVER,
        attributes: {
          'http.method': method,
          'http.url': path,
          'correlation.id': correlationId,
          'span.id': spanId,
          ...attributes,
        },
      },
      fn,
    );
  }
}
