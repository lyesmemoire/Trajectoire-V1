/**
 * Correlation Manager
 *
 * Manages correlation IDs for request tracing.
 * Pure context management, no business logic.
 */
// @ts-nocheck


import { CorrelationContext } from "./types";
import { DiagnosticEventRecorder } from "./DiagnosticEventRecorder";

export class CorrelationManager {
  private currentContext: CorrelationContext | null = null;
  private contextStack: CorrelationContext[] = [];
  private eventRecorder: DiagnosticEventRecorder;
  private correlationCounter: number = 0;

  constructor(eventRecorder: DiagnosticEventRecorder) {
    this.eventRecorder = eventRecorder;
  }

  /**
   * Create a new correlation context
   */
  createContext(parentId: string | null = null): CorrelationContext {
    const correlationId = this.generateCorrelationId();
    const traceId = parentId ? this.getTraceId(parentId) : this.generateTraceId();

    const context: CorrelationContext = {
      correlationId,
      parentId,
      traceId,
    };

    this.eventRecorder.recordEvent("runtime", "correlation_context_created", {
      correlationId,
      parentId,
      traceId,
      timestamp: new Date(),
    });

    return context;
  }

  /**
   * Set current correlation context
   */
  setContext(context: CorrelationContext): void {
    this.currentContext = context;

    this.eventRecorder.recordEvent("runtime", "correlation_context_set", {
      correlationId: context.correlationId,
      traceId: context.traceId,
      timestamp: new Date(),
    });
  }

  /**
   * Get current correlation context
   */
  getContext(): CorrelationContext | null {
    return this.currentContext;
  }

  /**
   * Push context onto stack (for nested operations)
   */
  pushContext(context: CorrelationContext): void {
    this.contextStack.push(context);
    this.currentContext = context;

    this.eventRecorder.recordEvent("runtime", "correlation_context_pushed", {
      correlationId: context.correlationId,
      stackDepth: this.contextStack.length,
      timestamp: new Date(),
    });
  }

  /**
   * Pop context from stack
   */
  popContext(): CorrelationContext | null {
    const popped = this.contextStack.pop();
    
    if (this.contextStack.length > 0) {
      this.currentContext = this.contextStack[this.contextStack.length - 1];
    } else {
      this.currentContext = null;
    }

    if (popped) {
      this.eventRecorder.recordEvent("runtime", "correlation_context_popped", {
        correlationId: popped.correlationId,
        stackDepth: this.contextStack.length,
        timestamp: new Date(),
      });
    }

    return popped ?? null;
  }

  /**
   * Clear current context
   */
  clearContext(): void {
    const previousContext = this.currentContext;
    this.currentContext = null;

    if (previousContext) {
      this.eventRecorder.recordEvent("runtime", "correlation_context_cleared", {
        correlationId: previousContext.correlationId,
        timestamp: new Date(),
      });
    }
  }

  /**
   * Generate correlation ID
   */
  private generateCorrelationId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 9);
    const counter = (this.correlationCounter++).toString(36);
    return `REQ-${timestamp}-${random}-${counter}`.toUpperCase();
  }

  /**
   * Generate trace ID
   */
  private generateTraceId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 13);
    return `TRACE-${timestamp}-${random}`.toUpperCase();
  }

  /**
   * Get trace ID from parent correlation ID
   */
  private getTraceId(parentId: string): string {
    // Extract trace ID from parent correlation ID if it follows our format
    const match = parentId.match(/REQ-([A-Z0-9]+)-/);
    if (match) {
      return `TRACE-${match[1]}`;
    }
    return this.generateTraceId();
  }

  /**
   * Get all events for a specific correlation ID
   */
  getEventsByCorrelationId(correlationId: string): unknown[] {
    const allEvents = this.eventRecorder.getEvents();
    return allEvents.filter(event => {
      const eventCorrelationId = event.data.correlationId as string | undefined;
      const eventTraceId = event.data.traceId as string | undefined;
      return eventCorrelationId === correlationId ||
        (eventTraceId && eventTraceId.startsWith(correlationId.replace("REQ-", "TRACE-")));
    });
  }

  /**
   * Get all events for a specific trace ID
   */
  getEventsByTraceId(traceId: string): unknown[] {
    const allEvents = this.eventRecorder.getEvents();
    return allEvents.filter(event => event.data.traceId === traceId);
  }

  /**
   * Reset correlation manager
   */
  reset(): void {
    this.currentContext = null;
    this.contextStack = [];
    this.correlationCounter = 0;

    this.eventRecorder.recordEvent("runtime", "correlation_manager_reset", {
      timestamp: new Date(),
    });
  }
}
