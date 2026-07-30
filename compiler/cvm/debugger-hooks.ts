/**
 * Blueprint DSL CVM Debugger Hooks
 * 
 * Provides hooks for debugging execution.
 */

import { ExecutionContext } from './execution-context';
import { Opcode } from '../cbs/opcode-table';

export interface Breakpoint {
  id: number;
  address: number;
  enabled: boolean;
  hitCount: number;
  condition?: string;
}

export interface Watchpoint {
  id: number;
  address: number;
  type: WatchpointType;
  enabled: boolean;
  hitCount: number;
}

export enum WatchpointType {
  READ = 'READ',
  WRITE = 'WRITE',
  READ_WRITE = 'READ_WRITE',
}

export interface DebuggerState {
  paused: boolean;
  stepMode: StepMode;
  currentBreakpoint: number | null;
  currentWatchpoint: number | null;
}

export enum StepMode {
  NONE = 'NONE',
  STEP_INTO = 'STEP_INTO',
  STEP_OVER = 'STEP_OVER',
  STEP_OUT = 'STEP_OUT',
}

export class DebuggerHooks {
  private context: ExecutionContext;
  private breakpoints: Map<number, Breakpoint> = new Map();
  private watchpoints: Map<number, Watchpoint> = new Map();
  private breakpointCounter: number = 0;
  private watchpointCounter: number = 0;
  private state: DebuggerState;
  private stepDepth: number = 0;

  constructor(context: ExecutionContext) {
    this.context = context;
    this.state = {
      paused: false,
      stepMode: StepMode.NONE,
      currentBreakpoint: null,
      currentWatchpoint: null,
    };
  }

  /**
   * Check if execution should pause
   */
  public shouldPause(opcode: Opcode): boolean {
    if (this.state.paused) {
      return true;
    }

    const pc = this.context.getProgramCounter();

    // Check breakpoints
    const breakpoint = this.breakpoints.get(pc);
    if (breakpoint && breakpoint.enabled) {
      breakpoint.hitCount++;
      this.state.currentBreakpoint = breakpoint.id;
      return true;
    }

    // Check step mode
    switch (this.state.stepMode) {
      case StepMode.STEP_INTO:
        this.state.stepMode = StepMode.NONE;
        return true;

      case StepMode.STEP_OVER:
        if (opcode === Opcode.CALL) {
          this.stepDepth++;
        } else if (opcode === Opcode.RET && this.stepDepth > 0) {
          this.stepDepth--;
        }

        if (this.stepDepth === 0) {
          this.state.stepMode = StepMode.NONE;
          return true;
        }
        break;

      case StepMode.STEP_OUT:
        if (opcode === Opcode.RET && this.stepDepth > 0) {
          this.stepDepth--;
          if (this.stepDepth === 0) {
            this.state.stepMode = StepMode.NONE;
            return true;
          }
        }
        break;
    }

    return false;
  }

  /**
   * Set breakpoint
   */
  public setBreakpoint(address: number, condition?: string): Breakpoint {
    const breakpoint: Breakpoint = {
      id: this.breakpointCounter++,
      address,
      enabled: true,
      hitCount: 0,
      condition,
    };

    this.breakpoints.set(address, breakpoint);
    return breakpoint;
  }

  /**
   * Remove breakpoint
   */
  public removeBreakpoint(address: number): boolean {
    return this.breakpoints.delete(address);
  }

  /**
   * Enable breakpoint
   */
  public enableBreakpoint(address: number): void {
    const breakpoint = this.breakpoints.get(address);
    if (breakpoint) {
      breakpoint.enabled = true;
    }
  }

  /**
   * Disable breakpoint
   */
  public disableBreakpoint(address: number): void {
    const breakpoint = this.breakpoints.get(address);
    if (breakpoint) {
      breakpoint.enabled = false;
    }
  }

  /**
   * Get breakpoint
   */
  public getBreakpoint(address: number): Breakpoint | null {
    const breakpoint = this.breakpoints.get(address);
    return breakpoint ? { ...breakpoint } : null;
  }

  /**
   * Get all breakpoints
   */
  public getAllBreakpoints(): Breakpoint[] {
    return Array.from(this.breakpoints.values()).map(b => ({ ...b }));
  }

  /**
   * Clear all breakpoints
   */
  public clearBreakpoints(): void {
    this.breakpoints.clear();
    this.breakpointCounter = 0;
  }

  /**
   * Set watchpoint
   */
  public setWatchpoint(address: number, type: WatchpointType): Watchpoint {
    const watchpoint: Watchpoint = {
      id: this.watchpointCounter++,
      address,
      type,
      enabled: true,
      hitCount: 0,
    };

    this.watchpoints.set(address, watchpoint);
    return watchpoint;
  }

  /**
   * Remove watchpoint
   */
  public removeWatchpoint(address: number): boolean {
    return this.watchpoints.delete(address);
  }

  /**
   * Enable watchpoint
   */
  public enableWatchpoint(address: number): void {
    const watchpoint = this.watchpoints.get(address);
    if (watchpoint) {
      watchpoint.enabled = true;
    }
  }

  /**
   * Disable watchpoint
   */
  public disableWatchpoint(address: number): void {
    const watchpoint = this.watchpoints.get(address);
    if (watchpoint) {
      watchpoint.enabled = false;
    }
  }

  /**
   * Get watchpoint
   */
  public getWatchpoint(address: number): Watchpoint | null {
    const watchpoint = this.watchpoints.get(address);
    return watchpoint ? { ...watchpoint } : null;
  }

  /**
   * Get all watchpoints
   */
  public getAllWatchpoints(): Watchpoint[] {
    return Array.from(this.watchpoints.values()).map(w => ({ ...w }));
  }

  /**
   * Clear all watchpoints
   */
  public clearWatchpoints(): void {
    this.watchpoints.clear();
    this.watchpointCounter = 0;
  }

  /**
   * Check watchpoint on memory read
   */
  public checkWatchpointRead(address: number): boolean {
    const watchpoint = this.watchpoints.get(address);

    if (!watchpoint || !watchpoint.enabled) {
      return false;
    }

    if (watchpoint.type === WatchpointType.READ || watchpoint.type === WatchpointType.READ_WRITE) {
      watchpoint.hitCount++;
      this.state.currentWatchpoint = watchpoint.id;
      return true;
    }

    return false;
  }

  /**
   * Check watchpoint on memory write
   */
  public checkWatchpointWrite(address: number): boolean {
    const watchpoint = this.watchpoints.get(address);

    if (!watchpoint || !watchpoint.enabled) {
      return false;
    }

    if (watchpoint.type === WatchpointType.WRITE || watchpoint.type === WatchpointType.READ_WRITE) {
      watchpoint.hitCount++;
      this.state.currentWatchpoint = watchpoint.id;
      return true;
    }

    return false;
  }

  /**
   * Pause execution
   */
  public pause(): void {
    this.state.paused = true;
  }

  /**
   * Resume execution
   */
  public resume(): void {
    this.state.paused = false;
    this.state.currentBreakpoint = null;
    this.state.currentWatchpoint = null;
  }

  /**
   * Step into
   */
  public stepInto(): void {
    this.state.stepMode = StepMode.STEP_INTO;
    this.state.paused = false;
  }

  /**
   * Step over
   */
  public stepOver(): void {
    this.state.stepMode = StepMode.STEP_OVER;
    this.state.paused = false;
    this.stepDepth = 0;
  }

  /**
   * Step out
   */
  public stepOut(): void {
    this.state.stepMode = StepMode.STEP_OUT;
    this.state.paused = false;
    this.stepDepth = this.context.getCallFrames().getFrameCount();
  }

  /**
   * Get debugger state
   */
  public getState(): DebuggerState {
    return { ...this.state };
  }

  /**
   * Check if paused
   */
  public isPaused(): boolean {
    return this.state.paused;
  }

  /**
   * Get current breakpoint
   */
  public getCurrentBreakpoint(): Breakpoint | null {
    if (this.state.currentBreakpoint === null) {
      return null;
    }

    for (const breakpoint of this.breakpoints.values()) {
      if (breakpoint.id === this.state.currentBreakpoint) {
        return { ...breakpoint };
      }
    }

    return null;
  }

  /**
   * Get current watchpoint
   */
  public getCurrentWatchpoint(): Watchpoint | null {
    if (this.state.currentWatchpoint === null) {
      return null;
    }

    for (const watchpoint of this.watchpoints.values()) {
      if (watchpoint.id === this.state.currentWatchpoint) {
        return { ...watchpoint };
      }
    }

    return null;
  }

  /**
   * Clear debugger state
   */
  public clear(): void {
    this.state = {
      paused: false,
      stepMode: StepMode.NONE,
      currentBreakpoint: null,
      currentWatchpoint: null,
    };
    this.stepDepth = 0;
  }

  /**
   * Validate debugger state
   */
  public validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    for (const [address, breakpoint] of this.breakpoints) {
      if (breakpoint.address !== address) {
        errors.push(`Breakpoint address mismatch at ${address}`);
      }

      if (breakpoint.hitCount < 0) {
        errors.push(`Invalid hit count in breakpoint at ${address}`);
      }
    }

    for (const [address, watchpoint] of this.watchpoints) {
      if (watchpoint.address !== address) {
        errors.push(`Watchpoint address mismatch at ${address}`);
      }

      if (watchpoint.hitCount < 0) {
        errors.push(`Invalid hit count in watchpoint at ${address}`);
      }
    }

    if (this.state.currentBreakpoint !== null) {
      const exists = Array.from(this.breakpoints.values()).some(b => b.id === this.state.currentBreakpoint);
      if (!exists) {
        errors.push('Current breakpoint does not exist');
      }
    }

    if (this.state.currentWatchpoint !== null) {
      const exists = Array.from(this.watchpoints.values()).some(w => w.id === this.state.currentWatchpoint);
      if (!exists) {
        errors.push('Current watchpoint does not exist');
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
    breakpointCount: number;
    watchpointCount: number;
    totalBreakpointHits: number;
    totalWatchpointHits: number;
    paused: boolean;
    stepMode: StepMode;
  } {
    const totalBreakpointHits = Array.from(this.breakpoints.values())
      .reduce((sum, b) => sum + b.hitCount, 0);
    const totalWatchpointHits = Array.from(this.watchpoints.values())
      .reduce((sum, w) => sum + w.hitCount, 0);

    return {
      breakpointCount: this.breakpoints.size,
      watchpointCount: this.watchpoints.size,
      totalBreakpointHits,
      totalWatchpointHits,
      paused: this.state.paused,
      stepMode: this.state.stepMode,
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
