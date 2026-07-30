/**
 * Blueprint DSL CVM Execution Pipeline
 * 
 * Manages the fetch-decode-execute pipeline.
 */

import { ExecutionContext } from './execution-context';
import { InstructionFetch } from './instruction-fetch';
import { InstructionDecode } from './instruction-decode';
import { InstructionExecute, ExecutionResult } from './instruction-execute';

export interface PipelineStatistics {
  instructionsExecuted: number;
  cycles: number;
  branchesTaken: number;
  branchesNotTaken: number;
  calls: number;
  returns: number;
  errors: number;
}

export class ExecutionPipeline {
  private fetch: InstructionFetch;
  private decode: InstructionDecode;
  private execute: InstructionExecute;
  private context: ExecutionContext;
  private statistics: PipelineStatistics;
  private running: boolean = false;

  constructor(bytecode: Uint8Array, context: ExecutionContext) {
    this.context = context;
    this.fetch = new InstructionFetch(bytecode);
    this.decode = new InstructionDecode();
    this.execute = new InstructionExecute(context);
    this.statistics = this.initializeStatistics();
  }

  /**
   * Initialize statistics
   */
  private initializeStatistics(): PipelineStatistics {
    return {
      instructionsExecuted: 0,
      cycles: 0,
      branchesTaken: 0,
      branchesNotTaken: 0,
      calls: 0,
      returns: 0,
      errors: 0,
    };
  }

  /**
   * Run pipeline for one cycle
   */
  public cycle(): ExecutionResult | null {
    if (this.context.isHalted()) {
      return null;
    }

    const pc = this.context.getProgramCounter();

    // Fetch
      const fetchResult = this.fetch.fetch(pc);
    this.context.incrementProgramCounter(fetchResult.size);

    // Decode
    const decoded = this.decode.decode(fetchResult.instruction);

    // Execute
    const result = this.execute.execute(decoded);

    // Update statistics
    this.statistics.instructionsExecuted++;
    this.statistics.cycles++;

    if (result.branchTaken) {
      this.statistics.branchesTaken++;
    } else if (result.branchTaken === false) {
      this.statistics.branchesNotTaken++;
    }

    if (decoded.isCall) {
      this.statistics.calls++;
    }

    if (decoded.isReturn) {
      this.statistics.returns++;
    }

    if (!result.success) {
      this.statistics.errors++;
      this.context.setError(new Error(result.error || 'Execution error'));
    }

    return result;
  }

  /**
   * Run pipeline until halt
   */
  public run(): PipelineStatistics {
    this.running = true;

    while (!this.context.isHalted() && this.running) {
      this.cycle();
    }

    return this.getStatistics();
  }

  /**
   * Run pipeline for N cycles
   */
  public runCycles(n: number): PipelineStatistics {
    for (let i = 0; i < n && !this.context.isHalted() && this.running; i++) {
      this.cycle();
    }

    return this.getStatistics();
  }

  /**
   * Stop pipeline
   */
  public stop(): void {
    this.running = false;
  }

  /**
   * Reset pipeline
   */
  public reset(): void {
    this.context.reset();
    this.fetch.clearCache();
    this.statistics = this.initializeStatistics();
    this.running = false;
  }

  /**
   * Get statistics
   */
  public getStatistics(): PipelineStatistics {
    return { ...this.statistics };
  }

  /**
   * Get fetch unit
   */
  public getFetch(): InstructionFetch {
    return this.fetch;
  }

  /**
   * Get decode unit
   */
  public getDecode(): InstructionDecode {
    return this.decode;
  }

  /**
   * Get execute unit
   */
  public getExecute(): InstructionExecute {
    return this.execute;
  }

  /**
   * Get context
   */
  public getContext(): ExecutionContext {
    return this.context;
  }

  /**
   * Set bytecode
   */
  public setBytecode(bytecode: Uint8Array): void {
    this.fetch.setBytecode(bytecode);
    this.reset();
  }

  /**
   * Get bytecode
   */
  public getBytecode(): Uint8Array {
    return this.fetch.getBytecode();
  }

  /**
   * Step through execution
   */
  public step(): ExecutionResult | null {
    return this.cycle();
  }

  /**
   * Get cache statistics
   */
  public getCacheStatistics() {
    return this.fetch.getCacheStatistics();
  }

  /**
   * Enable instruction cache
   */
  public enableCache(): void {
    this.fetch.enableCache();
  }

  /**
   * Disable instruction cache
   */
  public disableCache(): void {
    this.fetch.disableCache();
  }

  /**
   * Set cache size
   */
  public setCacheSize(size: number): void {
    this.fetch.setCacheSize(size);
  }

  /**
   * Validate pipeline state
   */
  public validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    const contextValidation = this.context.validate();
    errors.push(...contextValidation.errors);

    if (this.context.getProgramCounter() < 0) {
      errors.push('Program counter is negative');
    }

    const bytecode = this.fetch.getBytecode();
    if (this.context.getProgramCounter() >= bytecode.length) {
      errors.push('Program counter exceeds bytecode length');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
