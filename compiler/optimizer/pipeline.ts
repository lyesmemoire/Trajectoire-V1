/**
 * Blueprint Compiler: Optimizer Pipeline
 */

import { DeadCodeElimination } from './dead-code-elimination';
import { Inlining } from './inlining';
import { ConstantFolding } from './constant-folding';
import { SSA } from './ssa';
import { LoopOptimization } from './loop-optimization';
import { GraphSimplification } from './graph-simplification';
import { MemoryOptimization } from './memory-optimization';
import { InstructionFusion } from './instruction-fusion';

export interface OptimizationConfig {
  enableDCE: boolean;
  enableInlining: boolean;
  enableConstantFolding: boolean;
  enableSSA: boolean;
  enableLoopOptimization: boolean;
  enableGraphSimplification: boolean;
  enableMemoryOptimization: boolean;
  enableInstructionFusion: boolean;
}

export interface OptimizationResult {
  optimizedIR: unknown;
  stats: {
    dce?: unknown;
    inlining?: unknown;
    constantFolding?: unknown;
    ssa?: unknown;
    loopOptimization?: unknown;
    graphSimplification?: unknown;
    memoryOptimization?: unknown;
    instructionFusion?: unknown;
  };
}

export class OptimizerPipeline {
  private dce: DeadCodeElimination;
  private inlining: Inlining;
  private constantFolding: ConstantFolding;
  private ssa: SSA;
  private loopOptimization: LoopOptimization;
  private graphSimplification: GraphSimplification;
  private memoryOptimization: MemoryOptimization;
  private instructionFusion: InstructionFusion;

  constructor() {
    this.dce = new DeadCodeElimination();
    this.inlining = new Inlining();
    this.constantFolding = new ConstantFolding();
    this.ssa = new SSA();
    this.loopOptimization = new LoopOptimization();
    this.graphSimplification = new GraphSimplification();
    this.memoryOptimization = new MemoryOptimization();
    this.instructionFusion = new InstructionFusion();
  }

  /**
   * Run optimization pipeline
   */
  optimize(ir: unknown, config: OptimizationConfig = this.getDefaultConfig()): OptimizationResult {
    const stats: unknown = {};
    let optimized = ir;

    console.log('Running optimization pipeline...');

    // Constant folding (early)
    if (config.enableConstantFolding) {
      console.log('  Running Constant Folding...');
      const result = this.constantFolding.fold(optimized);
      optimized = result.optimizedIR;
      stats.constantFolding = result.stats;
    }

    // SSA form
    if (config.enableSSA) {
      console.log('  Running SSA...');
      const result = this.ssa.convertToSSA(optimized);
      optimized = result.optimizedIR;
      stats.ssa = result.stats;
    }

    // Inlining
    if (config.enableInlining) {
      console.log('  Running Inlining...');
      const result = this.inlining.inline(optimized);
      optimized = result.optimizedIR;
      stats.inlining = result.stats;
    }

    // Constant folding (after inlining)
    if (config.enableConstantFolding) {
      console.log('  Running Constant Folding (after inlining)...');
      const result = this.constantFolding.fold(optimized);
      optimized = result.optimizedIR;
      stats.constantFolding = result.stats;
    }

    // Loop optimization
    if (config.enableLoopOptimization) {
      console.log('  Running Loop Optimization...');
      const result = this.loopOptimization.optimize(optimized);
      optimized = result.optimizedIR;
      stats.loopOptimization = result.stats;
    }

    // Memory optimization
    if (config.enableMemoryOptimization) {
      console.log('  Running Memory Optimization...');
      const result = this.memoryOptimization.optimize(optimized);
      optimized = result.optimizedIR;
      stats.memoryOptimization = result.stats;
    }

    // Instruction fusion
    if (config.enableInstructionFusion) {
      console.log('  Running Instruction Fusion...');
      const result = this.instructionFusion.fuse(optimized);
      optimized = result.optimizedIR;
      stats.instructionFusion = result.stats;
    }

    // Graph simplification
    if (config.enableGraphSimplification) {
      console.log('  Running Graph Simplification...');
      const result = this.graphSimplification.simplify(optimized);
      optimized = result.optimizedIR;
      stats.graphSimplification = result.stats;
    }

    // Dead code elimination (late)
    if (config.enableDCE) {
      console.log('  Running Dead Code Elimination...');
      const result = this.dce.eliminate(optimized);
      optimized = result.optimizedIR;
      stats.dce = result.stats;
    }

    console.log('Optimization pipeline complete');

    return { optimizedIR: optimized, stats };
  }

  /**
   * Get default config
   */
  private getDefaultConfig(): OptimizationConfig {
    return {
      enableDCE: true,
      enableInlining: true,
      enableConstantFolding: true,
      enableSSA: true,
      enableLoopOptimization: true,
      enableGraphSimplification: true,
      enableMemoryOptimization: true,
      enableInstructionFusion: true,
    };
  }
}
