/**
 * Blueprint DSL CVM Interrupt Manager
 * 
 * Manages interrupts for the virtual machine.
 */

import { ExecutionContext } from './execution-context';

export enum InterruptType {
  TIMER = 'TIMER',
  IO = 'IO',
  SYSTEM = 'SYSTEM',
  DEBUG = 'DEBUG',
  USER = 'USER',
}

export interface Interrupt {
  id: number;
  type: InterruptType;
  priority: number;
  handlerAddress: number;
  data?: unknown;
}

export interface InterruptHandler {
  type: InterruptType;
  address: number;
  enabled: boolean;
}

export class InterruptManager {
  private context: ExecutionContext;
  private pendingInterrupts: Interrupt[] = [];
  private handlers: Map<InterruptType, InterruptHandler> = new Map();
  private interruptCounter: number = 0;
  private interruptsEnabled: boolean = true;
  private currentInterrupt: Interrupt | null = null;

  constructor(context: ExecutionContext) {
    this.context = context;
    this.initializeHandlers();
  }

  /**
   * Initialize default interrupt handlers
   */
  private initializeHandlers(): void {
    // Timer interrupt
    this.handlers.set(InterruptType.TIMER, {
      type: InterruptType.TIMER,
      address: 0,
      enabled: false,
    });

    // I/O interrupt
    this.handlers.set(InterruptType.IO, {
      type: InterruptType.IO,
      address: 0,
      enabled: false,
    });

    // System interrupt
    this.handlers.set(InterruptType.SYSTEM, {
      type: InterruptType.SYSTEM,
      address: 0,
      enabled: true,
    });

    // Debug interrupt
    this.handlers.set(InterruptType.DEBUG, {
      type: InterruptType.DEBUG,
      address: 0,
      enabled: true,
    });

    // User interrupt
    this.handlers.set(InterruptType.USER, {
      type: InterruptType.USER,
      address: 0,
      enabled: false,
    });
  }

  /**
   * Raise interrupt
   */
  public raise(type: InterruptType, data?: unknown): void {
    if (!this.interruptsEnabled) {
      return;
    }

    const handler = this.handlers.get(type);

    if (!handler || !handler.enabled) {
      return;
    }

    const interrupt: Interrupt = {
      id: this.interruptCounter++,
      type,
      priority: this.getPriority(type),
      handlerAddress: handler.address,
      data,
    };

    this.pendingInterrupts.push(interrupt);
    this.sortInterrupts();
  }

  /**
   * Get priority for interrupt type
   */
  private getPriority(type: InterruptType): number {
    const priorities: Map<InterruptType, number> = new Map([
      [InterruptType.SYSTEM, 0],
      [InterruptType.DEBUG, 1],
      [InterruptType.TIMER, 2],
      [InterruptType.IO, 3],
      [InterruptType.USER, 4],
    ]);

    return priorities.get(type) || 5;
  }

  /**
   * Sort interrupts by priority
   */
  private sortInterrupts(): void {
    this.pendingInterrupts.sort((a, b) => a.priority - b.priority);
  }

  /**
   * Check for pending interrupts
   */
  public hasPendingInterrupt(): boolean {
    return this.pendingInterrupts.length > 0;
  }

  /**
   * Get next interrupt
   */
  public getNextInterrupt(): Interrupt | null {
    if (this.pendingInterrupts.length === 0) {
      return null;
    }

    return this.pendingInterrupts[0];
  }

  /**
   * Process next interrupt
   */
  public processNextInterrupt(): boolean {
    if (this.pendingInterrupts.length === 0) {
      return false;
    }

    const interrupt = this.pendingInterrupts.shift()!;
    this.currentInterrupt = interrupt;

    // Save current context
    const snapshot = this.context.getSnapshot();

    // Jump to handler
    this.context.setProgramCounter(interrupt.handlerAddress);

    // Store snapshot for return
    this.context.getCallFrames().setLocal('interrupt_snapshot', snapshot);

    return true;
  }

  /**
   * Return from interrupt
   */
  public returnFromInterrupt(): void {
    if (!this.currentInterrupt) {
      return;
    }

    // Restore context
    const snapshot = this.context.getCallFrames().getLocal('interrupt_snapshot');
    if (snapshot) {
      this.context.restoreSnapshot(snapshot);
    }

    this.currentInterrupt = null;
  }

  /**
   * Get current interrupt
   */
  public getCurrentInterrupt(): Interrupt | null {
    return this.currentInterrupt;
  }

  /**
   * Enable interrupts
   */
  public enableInterrupts(): void {
    this.interruptsEnabled = true;
  }

  /**
   * Disable interrupts
   */
  public disableInterrupts(): void {
    this.interruptsEnabled = false;
  }

  /**
   * Check if interrupts are enabled
   */
  public areInterruptsEnabled(): boolean {
    return this.interruptsEnabled;
  }

  /**
   * Set interrupt handler
   */
  public setHandler(type: InterruptType, address: number, enabled: boolean = true): void {
    this.handlers.set(type, {
      type,
      address,
      enabled,
    });
  }

  /**
   * Get interrupt handler
   */
  public getHandler(type: InterruptType): InterruptHandler | null {
    return this.handlers.get(type) || null;
  }

  /**
   * Enable interrupt handler
   */
  public enableHandler(type: InterruptType): void {
    const handler = this.handlers.get(type);
    if (handler) {
      handler.enabled = true;
    }
  }

  /**
   * Disable interrupt handler
   */
  public disableHandler(type: InterruptType): void {
    const handler = this.handlers.get(type);
    if (handler) {
      handler.enabled = false;
    }
  }

  /**
   * Clear all pending interrupts
   */
  public clearPending(): void {
    this.pendingInterrupts = [];
  }

  /**
   * Get pending interrupt count
   */
  public getPendingCount(): number {
    return this.pendingInterrupts.length;
  }

  /**
   * Get all pending interrupts
   */
  public getPendingInterrupts(): Interrupt[] {
    return [...this.pendingInterrupts];
  }

  /**
   * Validate interrupt manager state
   */
  public validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (this.currentInterrupt && !this.handlers.has(this.currentInterrupt.type)) {
      errors.push('Current interrupt has no handler');
    }

    for (const interrupt of this.pendingInterrupts) {
      if (!this.handlers.has(interrupt.type)) {
        errors.push(`Pending interrupt ${interrupt.id} has no handler`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Get statistics
   */
  public getStatistics(): {
    pendingCount: number;
    enabled: boolean;
    inHandler: boolean;
    handlerCount: number;
  } {
    return {
      pendingCount: this.pendingInterrupts.length,
      enabled: this.interruptsEnabled,
      inHandler: this.currentInterrupt !== null,
      handlerCount: this.handlers.size,
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
