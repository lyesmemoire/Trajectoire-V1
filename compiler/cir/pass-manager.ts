/**
 * Blueprint DSL IR Pass Manager
 * 
 * Manages optimization and transformation passes on IR.
 */

import { IRModule, IRFunction, IRBasicBlock, IRInstruction } from './ir-generator';

export interface PassResult {
  success: boolean;
  errors: string[];
  warnings: string[];
  metrics: Map<string, number>;
}

export interface Pass {
  name: string;
  description: string;
  run(module: IRModule): PassResult;
  isEnabled: boolean;
}

export class PassManager {
  private passes: Pass[] = [];
  private passResults: Map<string, PassResult> = new Map();
  private totalPasses: number = 0;
  private successfulPasses: number = 0;
  private failedPasses: number = 0;

  /**
   * Register a pass
   */
  public registerPass(pass: Pass): void {
    this.passes.push(pass);
  }

  /**
   * Unregister a pass by name
   */
  public unregisterPass(name: string): void {
    this.passes = this.passes.filter(pass => pass.name !== name);
  }

  /**
   * Enable a pass by name
   */
  public enablePass(name: string): void {
    const pass = this.passes.find(p => p.name === name);
    if (pass) {
      pass.isEnabled = true;
    }
  }

  /**
   * Disable a pass by name
   */
  public disablePass(name: string): void {
    const pass = this.passes.find(p => p.name === name);
    if (pass) {
      pass.isEnabled = false;
    }
  }

  /**
   * Disable all passes
   */
  public disableAll(): void {
    for (const pass of this.passes) {
      pass.isEnabled = false;
    }
  }

  /**
   * Run all enabled passes
   */
  public runAll(module: IRModule): void {
    this.totalPasses = 0;
    this.successfulPasses = 0;
    this.failedPasses = 0;

    for (const pass of this.passes) {
      if (pass.isEnabled) {
        this.totalPasses++;
        const result = pass.run(module);
        this.passResults.set(pass.name, result);

        if (result.success) {
          this.successfulPasses++;
        } else {
          this.failedPasses++;
        }
      }
    }
  }

  /**
   * Run a specific pass by name
   */
  public runPass(module: IRModule, name: string): PassResult | null {
    const pass = this.passes.find(p => p.name === name);
    if (!pass) {
      return null;
    }

    const result = pass.run(module);
    this.passResults.set(name, result);
    return result;
  }

  /**
   * Get pass result by name
   */
  public getPassResult(name: string): PassResult | null {
    return this.passResults.get(name) || null;
  }

  /**
   * Get all pass results
   */
  public getAllPassResults(): Map<string, PassResult> {
    return new Map(this.passResults);
  }

  /**
   * Get statistics
   */
  public getStatistics(): { total: number; successful: number; failed: number } {
    return {
      total: this.totalPasses,
      successful: this.successfulPasses,
      failed: this.failedPasses,
    };
  }

  /**
   * Clear all pass results
   */
  public clearResults(): void {
    this.passResults.clear();
    this.totalPasses = 0;
    this.successfulPasses = 0;
    this.failedPasses = 0;
  }

  /**
   * Get all registered passes
   */
  public getPasses(): Pass[] {
    return [...this.passes];
  }
}

export abstract class BasePass implements Pass {
  public name: string;
  public description: string;
  public isEnabled: boolean = true;

  constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
  }

  public abstract run(module: IRModule): PassResult;

  protected createResult(success: boolean, errors: string[] = [], warnings: string[] = [], metrics: Map<string, number> = new Map()): PassResult {
    return {
      success,
      errors,
      warnings,
      metrics,
    };
  }
}

export class DeadCodeEliminationPass extends BasePass {
  constructor() {
    super('dead_code_elimination', 'Eliminates dead code from IR');
  }

  public run(module: IRModule): PassResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const metrics = new Map<string, number>();
    let eliminatedInstructions = 0;

    for (const func of module.functions) {
      for (const block of func.basicBlocks) {
        const liveInstructions = new Set<string>();
        this.markLiveInstructions(block, liveInstructions);

        const originalLength = block.instructions.length;
        block.instructions = block.instructions.filter(inst => liveInstructions.has(inst.id));
        eliminatedInstructions += originalLength - block.instructions.length;
      }
    }

    metrics.set('eliminated_instructions', eliminatedInstructions);
    return this.createResult(true, errors, warnings, metrics);
  }

  private markLiveInstructions(block: IRBasicBlock, liveInstructions: Set<string>): void {
    // Mark instructions that have side effects or are used
    for (const instruction of block.instructions) {
      if (this.hasSideEffect(instruction) || this.isUsed(instruction, block)) {
        liveInstructions.add(instruction.id);
      }
    }
  }

  private hasSideEffect(instruction: IRInstruction): boolean {
    const sideEffects = ['STORE', 'CALL', 'RET', 'PROVIDER_CALL'];
    return sideEffects.includes(instruction.instructionType);
  }

  private isUsed(instruction: IRInstruction, block: IRBasicBlock): boolean {
    if (!instruction.result) {
      return false;
    }

    for (const inst of block.instructions) {
      if (inst.operands.includes(instruction.result)) {
        return true;
      }
    }
    return false;
  }
}

export class ConstantFoldingPass extends BasePass {
  constructor() {
    super('constant_folding', 'Folds constant expressions');
  }

  public run(module: IRModule): PassResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const metrics = new Map<string, number>();
    let foldedInstructions = 0;

    for (const func of module.functions) {
      for (const block of func.basicBlocks) {
        for (let i = 0; i < block.instructions.length; i++) {
          const instruction = block.instructions[i];
          const folded = this.tryFold(instruction);
          if (folded) {
            block.instructions[i] = folded;
            foldedInstructions++;
          }
        }
      }
    }

    metrics.set('folded_instructions', foldedInstructions);
    return this.createResult(true, errors, warnings, metrics);
  }

  private tryFold(instruction: IRInstruction): IRInstruction | null {
    if (!this.isArithmetic(instruction.instructionType)) {
      return null;
    }

    const operands = instruction.operands;
    if (operands.length < 2) {
      return null;
    }

    const left = this.getConstantValue(operands[0]);
    const right = this.getConstantValue(operands[1]);

    if (left === null || right === null) {
      return null;
    }

    let result: number;
    switch (instruction.instructionType) {
      case 'ADD':
        result = left + right;
        break;
      case 'SUB':
        result = left - right;
        break;
      case 'MUL':
        result = left * right;
        break;
      case 'DIV':
        if (right === 0) {
          return null;
        }
        result = left / right;
        break;
      default:
        return null;
    }

    return {
      ...instruction,
      operands: [String(result)],
    };
  }

  private isArithmetic(type: string): boolean {
    return ['ADD', 'SUB', 'MUL', 'DIV'].includes(type);
  }

  private getConstantValue(operand: unknown): number | null {
    if (typeof operand === 'object' && operand !== null && typeof operand.value === 'number') {
      return operand.value;
    }
    return null;
  }
}

export class InlinePass extends BasePass {
  private maxInlineSize: number = 10;

  constructor(maxInlineSize: number = 10) {
    super('inline', 'Inlines small functions');
    this.maxInlineSize = maxInlineSize;
  }

  public run(module: IRModule): PassResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const metrics = new Map<string, number>();
    let inlinedFunctions = 0;

    for (const func of module.functions) {
      for (const block of func.basicBlocks) {
        for (let i = 0; i < block.instructions.length; i++) {
          const instruction = block.instructions[i];
          if (instruction.instructionType === 'CALL') {
            const calleeName = String(instruction.operands[0]);
            const callee = module.functions.find(f => f.name === calleeName);
            
            if (callee && this.shouldInline(callee)) {
              this.inlineFunction(block, i, callee);
              inlinedFunctions++;
            }
          }
        }
      }
    }

    metrics.set('inlined_functions', inlinedFunctions);
    return this.createResult(true, errors, warnings, metrics);
  }

  private shouldInline(func: IRFunction): boolean {
    let totalInstructions = 0;
    for (const block of func.basicBlocks) {
      totalInstructions += block.instructions.length;
    }
    return totalInstructions <= this.maxInlineSize;
  }

  private inlineFunction(block: IRBasicBlock, index: number, callee: IRFunction): void {
    const callInstruction = block.instructions[index];
    const resultVar = callInstruction.result;

    // Remove the call instruction
    block.instructions.splice(index, 1);

    // Insert callee's instructions
    const instructionsToInsert: IRInstruction[] = [];
    for (const calleeBlock of callee.basicBlocks) {
      for (const inst of calleeBlock.instructions) {
        const newInst = { ...inst };
        if (inst.result) {
          newInst.result = `${resultVar}_${inst.result}`;
        }
        instructionsToInsert.push(newInst);
      }
    }

    block.instructions.splice(index, 0, ...instructionsToInsert);
  }
}

export class LoopInvariantCodeMotionPass extends BasePass {
  constructor() {
    super('loop_invariant_code_motion', 'Moves loop-invariant code out of loops');
  }

  public run(module: IRModule): PassResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const metrics = new Map<string, number>();
    const movedInstructions = 0;

    // This is a simplified implementation
    // A full implementation would require loop detection and dominance analysis

    metrics.set('moved_instructions', movedInstructions);
    warnings.push('Loop invariant code motion is not fully implemented');
    return this.createResult(true, errors, warnings, metrics);
  }
}

export class CommonSubexpressionEliminationPass extends BasePass {
  constructor() {
    super('common_subexpression_elimination', 'Eliminates common subexpressions');
  }

  public run(module: IRModule): PassResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const metrics = new Map<string, number>();
    let eliminatedExpressions = 0;

    for (const func of module.functions) {
      for (const block of func.basicBlocks) {
        const expressionMap = new Map<string, string>();

        for (const instruction of block.instructions) {
          const key = this.getExpressionKey(instruction);
          if (key && expressionMap.has(key)) {
            const existingResult = expressionMap.get(key);
            if (instruction.result) {
              instruction.operands = [existingResult || ''];
              eliminatedExpressions++;
            }
          } else if (key && instruction.result) {
            expressionMap.set(key, instruction.result);
          }
        }
      }
    }

    metrics.set('eliminated_expressions', eliminatedExpressions);
    return this.createResult(true, errors, warnings, metrics);
  }

  private getExpressionKey(instruction: IRInstruction): string | null {
    if (!['ADD', 'SUB', 'MUL', 'DIV'].includes(instruction.instructionType)) {
      return null;
    }
    return `${instruction.instructionType}_${instruction.operands.join('_')}`;
  }
}
