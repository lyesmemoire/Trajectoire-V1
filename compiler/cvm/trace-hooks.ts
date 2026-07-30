/**
 * Blueprint DSL CVM Trace Hooks
 * 
 * Provides hooks for tracing execution.
 */

import { ExecutionContext } from './execution-context';
import { Opcode } from '../cbs/opcode-table';

export interface TraceEvent {
  type: TraceEventType;
  timestamp: number;
  programCounter: number;
  opcode?: Opcode;
  data?: unknown;
}

export enum TraceEventType {
  INSTRUCTION_START = 'INSTRUCTION_START',
  INSTRUCTION_END = 'INSTRUCTION_END',
  BRANCH_TAKEN = 'BRANCH_TAKEN',
  BRANCH_NOT_TAKEN = 'BRANCH_NOT_TAKEN',
  CALL = 'CALL',
  RETURN = 'RETURN',
  EXCEPTION = 'EXCEPTION',
  INTERRUPT = 'INTERRUPT',
  MEMORY_READ = 'MEMORY_READ',
  MEMORY_WRITE = 'MEMORY_WRITE',
}

export interface TraceOptions {
  enableInstructionTrace?: boolean;
  enableBranchTrace?: boolean;
  enableCallTrace?: boolean;
  enableMemoryTrace?: boolean;
  enableExceptionTrace?: boolean;
  maxEvents?: number;
}

export class TraceHooks {
  private context: ExecutionContext;
  private events: TraceEvent[] = [];
  private options: TraceOptions;
  private enabled: boolean = false;

  constructor(context: ExecutionContext, options: TraceOptions = {}) {
    this.context = context;
    this.options = {
      enableInstructionTrace: options.enableInstructionTrace !== false,
      enableBranchTrace: options.enableBranchTrace !== false,
      enableCallTrace: options.enableCallTrace !== false,
      enableMemoryTrace: options.enableMemoryTrace !== false,
      enableExceptionTrace: options.enableExceptionTrace !== false,
      maxEvents: options.maxEvents || 10000,
    };
  }

  /**
   * Enable tracing
   */
  public enable(): void {
    this.enabled = true;
  }

  /**
   * Disable tracing
   */
  public disable(): void {
    this.enabled = false;
  }

  /**
   * Check if tracing is enabled
   */
  public isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Add trace event
   */
  private addEvent(event: TraceEvent): void {
    if (!this.enabled) {
      return;
    }

    this.events.push(event);

    // Evict old events if needed
    if (this.events.length > this.options.maxEvents!) {
      this.events.shift();
    }
  }

  /**
   * Hook before instruction execution
   */
  public beforeInstruction(opcode: Opcode): void {
    if (!this.options.enableInstructionTrace) {
      return;
    }

    this.addEvent({
      type: TraceEventType.INSTRUCTION_START,
      timestamp: performance.now(),
      programCounter: this.context.getProgramCounter(),
      opcode,
    });
  }

  /**
   * Hook after instruction execution
   */
  public afterInstruction(opcode: Opcode): void {
    if (!this.options.enableInstructionTrace) {
      return;
    }

    this.addEvent({
      type: TraceEventType.INSTRUCTION_END,
      timestamp: performance.now(),
      programCounter: this.context.getProgramCounter(),
      opcode,
    });
  }

  /**
   * Hook for branch taken
   */
  public onBranchTaken(target: number): void {
    if (!this.options.enableBranchTrace) {
      return;
    }

    this.addEvent({
      type: TraceEventType.BRANCH_TAKEN,
      timestamp: performance.now(),
      programCounter: this.context.getProgramCounter(),
      data: { target },
    });
  }

  /**
   * Hook for branch not taken
   */
  public onBranchNotTaken(): void {
    if (!this.options.enableBranchTrace) {
      return;
    }

    this.addEvent({
      type: TraceEventType.BRANCH_NOT_TAKEN,
      timestamp: performance.now(),
      programCounter: this.context.getProgramCounter(),
    });
  }

  /**
   * Hook for call
   */
  public onCall(target: number): void {
    if (!this.options.enableCallTrace) {
      return;
    }

    this.addEvent({
      type: TraceEventType.CALL,
      timestamp: performance.now(),
      programCounter: this.context.getProgramCounter(),
      data: { target },
    });
  }

  /**
   * Hook for return
   */
  public onReturn(): void {
    if (!this.options.enableCallTrace) {
      return;
    }

    this.addEvent({
      type: TraceEventType.RETURN,
      timestamp: performance.now(),
      programCounter: this.context.getProgramCounter(),
    });
  }

  /**
   * Hook for exception
   */
  public onException(type: string, message: string): void {
    if (!this.options.enableExceptionTrace) {
      return;
    }

    this.addEvent({
      type: TraceEventType.EXCEPTION,
      timestamp: performance.now(),
      programCounter: this.context.getProgramCounter(),
      data: { type, message },
    });
  }

  /**
   * Hook for interrupt
   */
  public onInterrupt(interruptType: string): void {
    this.addEvent({
      type: TraceEventType.INTERRUPT,
      timestamp: performance.now(),
      programCounter: this.context.getProgramCounter(),
      data: { interruptType },
    });
  }

  /**
   * Hook for memory read
   */
  public onMemoryRead(address: number, size: number): void {
    if (!this.options.enableMemoryTrace) {
      return;
    }

    this.addEvent({
      type: TraceEventType.MEMORY_READ,
      timestamp: performance.now(),
      programCounter: this.context.getProgramCounter(),
      data: { address, size },
    });
  }

  /**
   * Hook for memory write
   */
  public onMemoryWrite(address: number, size: number): void {
    if (!this.options.enableMemoryTrace) {
      return;
    }

    this.addEvent({
      type: TraceEventType.MEMORY_WRITE,
      timestamp: performance.now(),
      programCounter: this.context.getProgramCounter(),
      data: { address, size },
    });
  }

  /**
   * Get all trace events
   */
  public getEvents(): TraceEvent[] {
    return [...this.events];
  }

  /**
   * Get events by type
   */
  public getEventsByType(type: TraceEventType): TraceEvent[] {
    return this.events.filter(e => e.type === type);
  }

  /**
   * Get events in time range
   */
  public getEventsInRange(start: number, end: number): TraceEvent[] {
    return this.events.filter(e => e.timestamp >= start && e.timestamp <= end);
  }

  /**
   * Clear trace events
   */
  public clear(): void {
    this.events = [];
  }

  /**
   * Export trace to JSON
   */
  public export(): string {
    return JSON.stringify(this.events, null, 2);
  }

  /**
   * Import trace from JSON
   */
  public import(json: string): void {
    this.events = JSON.parse(json);
  }

  /**
   * Get event count
   */
  public getEventCount(): number {
    return this.events.length;
  }

  /**
   * Get trace statistics
   */
  public getStatistics(): {
    totalEvents: number;
    eventsByType: Map<TraceEventType, number>;
    timeRange: { start: number; end: number };
  } {
    const eventsByType = new Map<TraceEventType, number>();

    for (const event of this.events) {
      const count = eventsByType.get(event.type) || 0;
      eventsByType.set(event.type, count + 1);
    }

    const timestamps = this.events.map(e => e.timestamp);
    const timeRange = timestamps.length > 0
      ? { start: Math.min(...timestamps), end: Math.max(...timestamps) }
      : { start: 0, end: 0 };

    return {
      totalEvents: this.events.length,
      eventsByType,
      timeRange,
    };
  }

  /**
   * Set trace options
   */
  public setOptions(options: Partial<TraceOptions>): void {
    this.options = { ...this.options, ...options };
  }

  /**
   * Get trace options
   */
  public getOptions(): TraceOptions {
    return { ...this.options };
  }

  /**
   * Validate trace state
   */
  public validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    for (const event of this.events) {
      if (event.programCounter < 0) {
        errors.push(`Invalid program counter in event at ${event.timestamp}`);
      }

      if (event.timestamp < 0) {
        errors.push(`Invalid timestamp in event`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Set execution context
   */
  public setContext(context: ExecutionContext): void {
    this.context = context;
  }

  /**
   * Get execution context
   */
  public getContext(): ExecutionContext {
    return this.context;
  }
}
