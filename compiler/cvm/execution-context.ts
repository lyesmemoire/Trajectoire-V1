/**
 * Blueprint DSL CVM Execution Context
 * 
 * Manages the execution context for the virtual machine.
 */

import { Stack } from '../cbs/stack';
import { Heap } from '../cbs/heap';
import { CallFrameManager } from '../cbs/call-frames';
import { Register, RegisterTable } from '../cbs/register-table';

export interface ExecutionContextOptions {
  stackSize?: number;
  heapSize?: number;
  maxFrames?: number;
}

export class ExecutionContext {
  private stack: Stack;
  private heap: Heap;
  private callFrames: CallFrameManager;
  private registers: Map<Register, number>;
  private programCounter: number = 0;
  private halted: boolean = false;
  private error: Error | null = null;

  constructor(options: ExecutionContextOptions = {}) {
    this.stack = new Stack(options.stackSize || 65536);
    this.heap = new Heap();
    this.heap.setMaxBlocks(options.heapSize || 1024);
    this.callFrames = new CallFrameManager();
    this.registers = this.initializeRegisters();
  }

  /**
   * Initialize registers
   */
  private initializeRegisters(): Map<Register, number> {
    const registers = new Map<Register, number>();

    for (const register of RegisterTable.getAllRegisters()) {
      registers.set(register, 0);
    }

    return registers;
  }

  /**
   * Get stack
   */
  public getStack(): Stack {
    return this.stack;
  }

  /**
   * Get heap
   */
  public getHeap(): Heap {
    return this.heap;
  }

  /**
   * Get call frames
   */
  public getCallFrames(): CallFrameManager {
    return this.callFrames;
  }

  /**
   * Get register value
   */
  public getRegister(register: Register): number {
    return this.registers.get(register) || 0;
  }

  /**
   * Set register value
   */
  public setRegister(register: Register, value: number): void {
    this.registers.set(register, value);
  }

  /**
   * Get program counter
   */
  public getProgramCounter(): number {
    return this.programCounter;
  }

  /**
   * Set program counter
   */
  public setProgramCounter(value: number): void {
    this.programCounter = value;
  }

  /**
   * Increment program counter
   */
  public incrementProgramCounter(delta: number = 1): void {
    this.programCounter += delta;
  }

  /**
   * Check if halted
   */
  public isHalted(): boolean {
    return this.halted;
  }

  /**
   * Halt execution
   */
  public halt(): void {
    this.halted = true;
  }

  /**
   * Resume execution
   */
  public resume(): void {
    this.halted = false;
  }

  /**
   * Get error
   */
  public getError(): Error | null {
    return this.error;
  }

  /**
   * Set error
   */
  public setError(error: Error): void {
    this.error = error;
    this.halt();
  }

  /**
   * Clear error
   */
  public clearError(): void {
    this.error = null;
  }

  /**
   * Reset context
   */
  public reset(): void {
    this.stack.clear();
    this.heap.clear();
    this.callFrames.clear();
    this.registers = this.initializeRegisters();
    this.programCounter = 0;
    this.halted = false;
    this.error = null;
  }

  /**
   * Get snapshot
   */
  public getSnapshot(): {
    stack: number[];
    heap: unknown[];
    registers: Map<Register, number>;
    programCounter: number;
    halted: boolean;
  } {
    return {
      stack: this.stack.getSnapshot(),
      heap: this.heap.getAllBlocks(),
      registers: new Map(this.registers),
      programCounter: this.programCounter,
      halted: this.halted,
    };
  }

  /**
   * Restore snapshot
   */
  public restoreSnapshot(snapshot: unknown): void {
    this.stack.restoreSnapshot(snapshot.stack);
    this.heap.clear();
    // Note: Heap blocks would need to be restored properly
    this.registers = new Map(snapshot.registers);
    this.programCounter = snapshot.programCounter;
    this.halted = snapshot.halted;
  }

  /**
   * Validate context
   */
  public validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    const stackValidation = this.stack.validate();
    errors.push(...stackValidation.errors);

    const heapValidation = this.heap.validate();
    errors.push(...heapValidation.errors);

    const frameValidation = this.callFrames.validate();
    errors.push(...frameValidation.errors);

    if (this.programCounter < 0) {
      errors.push('Program counter is negative');
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
    stackUtilization: number;
    heapUtilization: number;
    frameCount: number;
    registerCount: number;
  } {
    const stackStats = this.stack.getStatistics();
    const heapStats = this.heap.getStatistics();

    return {
      stackUtilization: stackStats.utilization,
      heapUtilization: heapStats.utilization,
      frameCount: this.callFrames.getFrameCount(),
      registerCount: this.registers.size,
    };
  }
}
