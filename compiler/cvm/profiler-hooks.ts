/**
 * Blueprint DSL CVM Profiler Hooks
 * 
 * Provides hooks for profiling execution.
 */

import { ExecutionContext } from './execution-context';
import { Opcode } from '../cbs/opcode-table';

export interface ProfileData {
  opcode: Opcode;
  count: number;
  totalTime: number;
  averageTime: number;
  minTime: number;
  maxTime: number;
}

export interface ProfileStatistics {
  totalInstructions: number;
  totalExecutionTime: number;
  averageExecutionTime: number;
  opcodeDistribution: Map<Opcode, ProfileData>;
  hotspots: Opcode[];
}

export class ProfilerHooks {
  private context: ExecutionContext;
  private enabled: boolean = false;
  private instructionCounts: Map<Opcode, number> = new Map();
  private instructionTimes: Map<Opcode, number[]> = new Map();
  private startTime: number = 0;
  private totalInstructions: number = 0;

  constructor(context: ExecutionContext) {
    this.context = context;
  }

  /**
   * Enable profiler
   */
  public enable(): void {
    this.enabled = true;
    this.startTime = performance.now();
  }

  /**
   * Disable profiler
   */
  public disable(): void {
    this.enabled = false;
  }

  /**
   * Check if profiler is enabled
   */
  public isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Hook before instruction execution
   */
  public beforeInstruction(opcode: Opcode): void {
    if (!this.enabled) {
      return;
    }

    const count = this.instructionCounts.get(opcode) || 0;
    this.instructionCounts.set(opcode, count + 1);
    this.totalInstructions++;
  }

  /**
   * Hook after instruction execution
   */
  public afterInstruction(opcode: Opcode, duration: number): void {
    if (!this.enabled) {
      return;
    }

    const times = this.instructionTimes.get(opcode) || [];
    times.push(duration);
    this.instructionTimes.set(opcode, times);
  }

  /**
   * Get profile statistics
   */
  public getStatistics(): ProfileStatistics {
    const opcodeDistribution = new Map<Opcode, ProfileData>();
    const totalExecutionTime = performance.now() - this.startTime;

    for (const [opcode, count] of this.instructionCounts) {
      const times = this.instructionTimes.get(opcode) || [];
      const totalTime = times.reduce((sum, t) => sum + t, 0);
      const averageTime = times.length > 0 ? totalTime / times.length : 0;
      const minTime = times.length > 0 ? Math.min(...times) : 0;
      const maxTime = times.length > 0 ? Math.max(...times) : 0;

      opcodeDistribution.set(opcode, {
        opcode,
        count,
        totalTime,
        averageTime,
        minTime,
        maxTime,
      });
    }

    const hotspots = Array.from(opcodeDistribution.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
      .map(d => d.opcode);

    return {
      totalInstructions: this.totalInstructions,
      totalExecutionTime,
      averageExecutionTime: this.totalInstructions > 0 ? totalExecutionTime / this.totalInstructions : 0,
      opcodeDistribution,
      hotspots,
    };
  }

  /**
   * Get instruction count for opcode
   */
  public getInstructionCount(opcode: Opcode): number {
    return this.instructionCounts.get(opcode) || 0;
  }

  /**
   * Get all instruction counts
   */
  public getAllInstructionCounts(): Map<Opcode, number> {
    return new Map(this.instructionCounts);
  }

  /**
   * Get instruction times for opcode
   */
  public getInstructionTimes(opcode: Opcode): number[] {
    return this.instructionTimes.get(opcode) || [];
  }

  /**
   * Clear profiler data
   */
  public clear(): void {
    this.instructionCounts.clear();
    this.instructionTimes.clear();
    this.totalInstructions = 0;
    this.startTime = performance.now();
  }

  /**
   * Reset profiler
   */
  public reset(): void {
    this.clear();
    this.enabled = false;
  }

  /**
   * Export profile data to JSON
   */
  public export(): string {
    const stats = this.getStatistics();
    const data = {
      totalInstructions: stats.totalInstructions,
      totalExecutionTime: stats.totalExecutionTime,
      averageExecutionTime: stats.averageExecutionTime,
      opcodeDistribution: Array.from(stats.opcodeDistribution.entries()),
      hotspots: stats.hotspots,
    };
    return JSON.stringify(data, null, 2);
  }

  /**
   * Import profile data from JSON
   */
  public import(json: string): void {
    const data = JSON.parse(json);

    this.totalInstructions = data.totalInstructions;

    for (const [opcode, profileData] of data.opcodeDistribution) {
      this.instructionCounts.set(opcode as Opcode, (profileData as ProfileData).count);
      this.instructionTimes.set(opcode as Opcode, []);
    }
  }

  /**
   * Validate profiler state
   */
  public validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (this.totalInstructions < 0) {
      errors.push('Invalid total instruction count');
    }

    if (this.startTime < 0) {
      errors.push('Invalid start time');
    }

    for (const [opcode, count] of this.instructionCounts) {
      if (count < 0) {
        errors.push(`Invalid count for opcode ${opcode}`);
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
