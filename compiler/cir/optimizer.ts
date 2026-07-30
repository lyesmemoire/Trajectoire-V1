/**
 * Blueprint DSL IR Optimizer
 * 
 * Coordinates optimization passes on IR.
 */

import { IRModule } from './ir-generator';
import { PassManager, BasePass } from './pass-manager';

export interface OptimizationLevel {
  name: string;
  passes: string[];
}

export class Optimizer {
  private passManager: PassManager;
  private optimizationLevels: Map<string, OptimizationLevel> = new Map();

  constructor() {
    this.passManager = new PassManager();
    this.initializeOptimizationLevels();
  }

  /**
   * Initialize optimization levels
   */
  private initializeOptimizationLevels(): void {
    // O0: No optimization
    this.optimizationLevels.set('O0', {
      name: 'O0',
      passes: [],
    });

    // O1: Basic optimizations
    this.optimizationLevels.set('O1', {
      name: 'O1',
      passes: ['constant_folding', 'dead_code_elimination'],
    });

    // O2: Medium optimizations
    this.optimizationLevels.set('O2', {
      name: 'O2',
      passes: ['constant_folding', 'dead_code_elimination', 'inline', 'common_subexpression_elimination'],
    });

    // O3: Aggressive optimizations
    this.optimizationLevels.set('O3', {
      name: 'O3',
      passes: ['constant_folding', 'dead_code_elimination', 'inline', 'common_subexpression_elimination', 'loop_invariant_code_motion'],
    });
  }

  /**
   * Register a pass
   */
  public registerPass(pass: BasePass): void {
    this.passManager.registerPass(pass);
  }

  /**
   * Optimize IR module at a given optimization level
   */
  public optimize(module: IRModule, level: string = 'O2'): OptimizationResult {
    const optLevel = this.optimizationLevels.get(level);
    if (!optLevel) {
      return {
        success: false,
        errors: [`Unknown optimization level: ${level}`],
        warnings: [],
        metrics: new Map(),
      };
    }

    // Enable only the passes for this level
    this.passManager.disableAll();
    for (const passName of optLevel.passes) {
      this.passManager.enablePass(passName);
    }

    // Run the passes
    this.passManager.runAll(module);

    // Collect results
    const allResults = this.passManager.getAllPassResults();
    const errors: string[] = [];
    const warnings: string[] = [];
    const metrics = new Map<string, number>();

    for (const [passName, result] of allResults) {
      errors.push(...result.errors.map(e => `${passName}: ${e}`));
      warnings.push(...result.warnings.map(w => `${passName}: ${w}`));
      for (const [key, value] of result.metrics) {
        metrics.set(`${passName}_${key}`, value);
      }
    }

    const stats = this.passManager.getStatistics();

    return {
      success: stats.failed === 0,
      errors,
      warnings,
      metrics,
      statistics: stats,
    };
  }

  /**
   * Run a specific optimization pass
   */
  public runPass(module: IRModule, passName: string): OptimizationResult {
    const result = this.passManager.runPass(module, passName);
    if (!result) {
      return {
        success: false,
        errors: [`Pass not found: ${passName}`],
        warnings: [],
        metrics: new Map(),
      };
    }

    return {
      success: result.success,
      errors: result.errors,
      warnings: result.warnings,
      metrics: result.metrics,
    };
  }

  /**
   * Get available optimization levels
   */
  public getOptimizationLevels(): string[] {
    return Array.from(this.optimizationLevels.keys());
  }

  /**
   * Get passes for a specific optimization level
   */
  public getPassesForLevel(level: string): string[] {
    const optLevel = this.optimizationLevels.get(level);
    return optLevel ? optLevel.passes : [];
  }

  /**
   * Get pass manager statistics
   */
  public getStatistics(): { total: number; successful: number; failed: number } {
    return this.passManager.getStatistics();
  }

  /**
   * Clear all pass results
   */
  public clearResults(): void {
    this.passManager.clearResults();
  }
}

export interface OptimizationResult {
  success: boolean;
  errors: string[];
  warnings: string[];
  metrics: Map<string, number>;
  statistics?: { total: number; successful: number; failed: number };
}

export class OptimizationPipeline {
  private optimizer: Optimizer;
  private stages: OptimizationStage[] = [];

  constructor() {
    this.optimizer = new Optimizer();
  }

  /**
   * Add an optimization stage
   */
  public addStage(stage: OptimizationStage): void {
    this.stages.push(stage);
  }

  /**
   * Run the optimization pipeline
   */
  public run(module: IRModule): PipelineResult {
    const stageResults: Map<string, OptimizationResult> = new Map();
    let totalSuccess = true;

    for (const stage of this.stages) {
      const result = this.optimizer.optimize(module, stage.level);
      stageResults.set(stage.name, result);

      if (!result.success) {
        totalSuccess = false;
        if (stage.stopOnFailure) {
          break;
        }
      }
    }

    const allErrors: string[] = [];
    const allWarnings: string[] = [];
    const allMetrics = new Map<string, number>();

    for (const [stageName, result] of stageResults) {
      allErrors.push(...result.errors.map(e => `${stageName}: ${e}`));
      allWarnings.push(...result.warnings.map(w => `${stageName}: ${w}`));
      for (const [key, value] of result.metrics) {
        allMetrics.set(`${stageName}_${key}`, value);
      }
    }

    return {
      success: totalSuccess,
      stageResults,
      errors: allErrors,
      warnings: allWarnings,
      metrics: allMetrics,
    };
  }

  /**
   * Get the optimizer
   */
  public getOptimizer(): Optimizer {
    return this.optimizer;
  }
}

export interface OptimizationStage {
  name: string;
  level: string;
  stopOnFailure: boolean;
}

export interface PipelineResult {
  success: boolean;
  stageResults: Map<string, OptimizationResult>;
  errors: string[];
  warnings: string[];
  metrics: Map<string, number>;
}
