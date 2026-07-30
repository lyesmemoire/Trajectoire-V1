/**
 * Blueprint DSL CVM Scheduler
 * 
 * Manages instruction scheduling and execution order.
 */

import { ExecutionContext } from './execution-context';
import { Opcode } from '../cbs/opcode-table';

export interface ScheduledInstruction {
  address: number;
  opcode: Opcode;
  dependencies: number[];
  latency: number;
  ready: boolean;
}

export interface SchedulingOptions {
  enableReordering?: boolean;
  enableSpeculation?: boolean;
  windowSize?: number;
}

export class Scheduler {
  private context: ExecutionContext;
  private scheduled: Map<number, ScheduledInstruction> = new Map();
  private readyQueue: ScheduledInstruction[] = [];
  private options: SchedulingOptions;
  private currentCycle: number = 0;

  constructor(context: ExecutionContext, options: SchedulingOptions = {}) {
    this.context = context;
    this.options = {
      enableReordering: options.enableReordering !== false,
      enableSpeculation: options.enableSpeculation !== false,
      windowSize: options.windowSize || 16,
    };
  }

  /**
   * Schedule instruction at address
   */
  public schedule(address: number, opcode: Opcode): ScheduledInstruction {
    const instruction: ScheduledInstruction = {
      address,
      opcode,
      dependencies: this.analyzeDependencies(opcode),
      latency: this.getLatency(opcode),
      ready: false,
    };

    this.scheduled.set(address, instruction);

    if (instruction.dependencies.length === 0) {
      instruction.ready = true;
      this.readyQueue.push(instruction);
    }

    return instruction;
  }

  /**
   * Analyze dependencies for instruction
   */
  private analyzeDependencies(opcode: Opcode): number[] {
    const dependencies: number[] = [];

    if (this.isMemoryOperation(opcode)) {
      // Memory operations depend on previous memory operations
      for (const [addr, inst] of this.scheduled) {
        if (this.isMemoryOperation(inst.opcode) && addr < this.context.getProgramCounter()) {
          dependencies.push(addr);
        }
      }
    }

    return dependencies;
  }

  /**
   * Check if opcode is memory operation
   */
  private isMemoryOperation(opcode: Opcode): boolean {
    return [Opcode.LOAD, Opcode.STORE].includes(opcode);
  }

  /**
   * Get latency for opcode
   */
  private getLatency(opcode: Opcode): number {
    const latencies: Map<Opcode, number> = new Map([
      [Opcode.LOAD, 3],
      [Opcode.STORE, 2],
      [Opcode.MUL, 2],
      [Opcode.DIV, 4],
      [Opcode.CALL, 5],
      [Opcode.RET, 3],
    ]);

    return latencies.get(opcode) || 1;
  }

  /**
   * Get next ready instruction
   */
  public getNextReady(): ScheduledInstruction | null {
    if (this.readyQueue.length === 0) {
      return null;
    }

    // Sort by priority (shorter latency first)
    this.readyQueue.sort((a, b) => a.latency - b.latency);

    return this.readyQueue.shift() || null;
  }

  /**
   * Mark instruction as complete
   */
  public markComplete(address: number): void {
    const instruction = this.scheduled.get(address);

    if (!instruction) {
      return;
    }

    // Update dependent instructions
    for (const [addr, inst] of this.scheduled) {
      if (inst.dependencies.includes(address)) {
        inst.dependencies = inst.dependencies.filter(d => d !== address);

        if (inst.dependencies.length === 0) {
          inst.ready = true;
          this.readyQueue.push(inst);
        }
      }
    }
  }

  /**
   * Get scheduled instruction
   */
  public getScheduled(address: number): ScheduledInstruction | null {
    return this.scheduled.get(address) || null;
  }

  /**
   * Get all scheduled instructions
   */
  public getAllScheduled(): ScheduledInstruction[] {
    return Array.from(this.scheduled.values());
  }

  /**
   * Get ready queue
   */
  public getReadyQueue(): ScheduledInstruction[] {
    return [...this.readyQueue];
  }

  /**
   * Clear scheduler state
   */
  public clear(): void {
    this.scheduled.clear();
    this.readyQueue = [];
    this.currentCycle = 0;
  }

  /**
   * Advance cycle
   */
  public advanceCycle(): void {
    this.currentCycle++;
  }

  /**
   * Get current cycle
   */
  public getCurrentCycle(): number {
    return this.currentCycle;
  }

  /**
   * Check if reordering is enabled
   */
  public isReorderingEnabled(): boolean {
    return this.options.enableReordering ?? true;
  }

  /**
   * Enable reordering
   */
  public enableReordering(): void {
    this.options.enableReordering = true;
  }

  /**
   * Disable reordering
   */
  public disableReordering(): void {
    this.options.enableReordering = false;
  }

  /**
   * Check if speculation is enabled
   */
  public isSpeculationEnabled(): boolean {
    return this.options.enableSpeculation ?? true;
  }

  /**
   * Enable speculation
   */
  public enableSpeculation(): void {
    this.options.enableSpeculation = true;
  }

  /**
   * Disable speculation
   */
  public disableSpeculation(): void {
    this.options.enableSpeculation = false;
  }

  /**
   * Get window size
   */
  public getWindowSize(): number {
    return this.options.windowSize ?? 16;
  }

  /**
   * Set window size
   */
  public setWindowSize(size: number): void {
    this.options.windowSize = size;
  }

  /**
   * Validate scheduler state
   */
  public validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    for (const [addr, inst] of this.scheduled) {
      if (inst.dependencies.length === 0 && !inst.ready) {
        errors.push(`Instruction at ${addr} has no dependencies but is not ready`);
      }

      if (inst.dependencies.length > 0 && inst.ready) {
        errors.push(`Instruction at ${addr} has dependencies but is ready`);
      }

      for (const dep of inst.dependencies) {
        if (!this.scheduled.has(dep)) {
          errors.push(`Instruction at ${addr} depends on non-existent instruction ${dep}`);
        }
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
    scheduledCount: number;
    readyCount: number;
    averageLatency: number;
    currentCycle: number;
  } {
    const scheduled = Array.from(this.scheduled.values());
    const avgLatency = scheduled.length > 0
      ? scheduled.reduce((sum, inst) => sum + inst.latency, 0) / scheduled.length
      : 0;

    return {
      scheduledCount: this.scheduled.size,
      readyCount: this.readyQueue.length,
      averageLatency: avgLatency,
      currentCycle: this.currentCycle,
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
