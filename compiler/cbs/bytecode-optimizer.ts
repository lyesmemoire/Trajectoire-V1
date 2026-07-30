/**
 * Blueprint DSL CBS Bytecode Optimizer
 * 
 * Optimizes bytecode for better performance.
 */

import { Opcode, OpcodeTable } from './opcode-table';
import { Instruction, InstructionTable } from './instruction-table';

export interface OptimizationResult {
  success: boolean;
  optimizedBytecode: Uint8Array;
  originalSize: number;
  optimizedSize: number;
  reduction: number;
  passes: OptimizationPassResult[];
}

export interface OptimizationPassResult {
  name: string;
  success: boolean;
  optimizations: number;
  reduction: number;
}

export abstract class OptimizationPass {
  public name: string;
  public description: string;

  constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
  }

  public abstract optimize(bytecode: Uint8Array): Uint8Array;
}

export class BytecodeOptimizer {
  private passes: OptimizationPass[] = [];

  /**
   * Register an optimization pass
   */
  public registerPass(pass: OptimizationPass): void {
    this.passes.push(pass);
  }

  /**
   * Unregister a pass by name
   */
  public unregisterPass(name: string): void {
    this.passes = this.passes.filter(pass => pass.name !== name);
  }

  /**
   * Optimize bytecode
   */
  public optimize(bytecode: Uint8Array): OptimizationResult {
    const originalSize = bytecode.length;
    let currentBytecode = bytecode;
    const passResults: OptimizationPassResult[] = [];

    for (const pass of this.passes) {
      const beforeSize = currentBytecode.length;
      
      try {
        currentBytecode = pass.optimize(currentBytecode);
        const afterSize = currentBytecode.length;
        const optimizations = this.countOptimizations(beforeSize, afterSize);
        
        passResults.push({
          name: pass.name,
          success: true,
          optimizations,
          reduction: beforeSize - afterSize,
        });
      } catch {
        passResults.push({
          name: pass.name,
          success: false,
          optimizations: 0,
          reduction: 0,
        });
      }
    }

    const optimizedSize = currentBytecode.length;
    const reduction = originalSize - optimizedSize;
    const reductionPercentage = (reduction / originalSize) * 100;

    return {
      success: true,
      optimizedBytecode: currentBytecode,
      originalSize,
      optimizedSize,
      reduction: reductionPercentage,
      passes: passResults,
    };
  }

  /**
   * Count optimizations
   */
  private countOptimizations(beforeSize: number, afterSize: number): number {
    return Math.abs(beforeSize - afterSize);
  }

  /**
   * Get all passes
   */
  public getPasses(): OptimizationPass[] {
    return [...this.passes];
  }
}

export class ConstantFoldingPass extends OptimizationPass {
  constructor() {
    super('constant_folding', 'Folds constant operations');
  }

  public optimize(bytecode: Uint8Array): Uint8Array {
    const instructions: Instruction[] = [];
    let offset = 0;

    while (offset < bytecode.length) {
      const { instruction, nextOffset } = InstructionTable.decode(bytecode, offset);
      instructions.push(instruction);
      offset = nextOffset;
    }

    const optimizedInstructions = this.foldConstants(instructions);
    return this.encodeInstructions(optimizedInstructions);
  }

  private foldConstants(instructions: Instruction[]): Instruction[] {
    const optimized: Instruction[] = [];

    for (let i = 0; i < instructions.length; i++) {
      const instruction = instructions[i];

      if (this.isArithmetic(instruction.opcode)) {
        const folded = this.tryFold(instruction);
        if (folded) {
          optimized.push(folded);
        } else {
          optimized.push(instruction);
        }
      } else {
        optimized.push(instruction);
      }
    }

    return optimized;
  }

  private isArithmetic(opcode: Opcode): boolean {
    return [Opcode.ADD, Opcode.SUB, Opcode.MUL, Opcode.DIV].includes(opcode);
  }

  private tryFold(instruction: Instruction): Instruction | null {
    if (instruction.operands.length < 2) {
      return null;
    }

    const left = instruction.operands[0];
    const right = instruction.operands[1];

    if (typeof left !== 'number' || typeof right !== 'number') {
      return null;
    }

    let result: number;
    switch (instruction.opcode) {
      case Opcode.ADD:
        result = left + right;
        break;
      case Opcode.SUB:
        result = left - right;
        break;
      case Opcode.MUL:
        result = left * right;
        break;
      case Opcode.DIV:
        if (right === 0) return null;
        result = left / right;
        break;
      default:
        return null;
    }

    return {
      opcode: Opcode.PUSH,
      operands: [result],
      size: InstructionTable.getSize(Opcode.PUSH),
    };
  }

  private encodeInstructions(instructions: Instruction[]): Uint8Array {
    const buffer: number[] = [];

    for (const instruction of instructions) {
      const encoded = InstructionTable.encode(instruction);
      for (const byte of encoded) {
        buffer.push(byte);
      }
    }

    return new Uint8Array(buffer);
  }
}

export class DeadCodeEliminationPass extends OptimizationPass {
  constructor() {
    super('dead_code_elimination', 'Removes unreachable code');
  }

  public optimize(bytecode: Uint8Array): Uint8Array {
    const reachableOffsets = this.computeReachableOffsets(bytecode);
    const buffer: number[] = [];

    for (let offset = 0; offset < bytecode.length; offset++) {
      if (reachableOffsets.has(offset)) {
        buffer.push(bytecode[offset]);
      }
    }

    return new Uint8Array(buffer);
  }

  private computeReachableOffsets(bytecode: Uint8Array): Set<number> {
    const reachable = new Set<number>();
    const queue = [0];

    while (queue.length > 0) {
      const offset = queue.shift()!;
      if (reachable.has(offset)) continue;

      reachable.add(offset);

      try {
        const { instruction, nextOffset } = InstructionTable.decode(bytecode, offset);

        if (OpcodeTable.isBranch(instruction.opcode) && instruction.operands.length > 0) {
          const target = instruction.operands[0];
          if (target >= 0 && target < bytecode.length) {
            queue.push(target);
          }
        }

        if (!OpcodeTable.isTerminator(instruction.opcode)) {
          queue.push(nextOffset);
        }
      } catch {
        // Invalid instruction, skip
      }
    }

    return reachable;
  }
}

export class PeepholeOptimizationPass extends OptimizationPass {
  constructor() {
    super('peephole_optimization', 'Applies local optimizations');
  }

  public optimize(bytecode: Uint8Array): Uint8Array {
    const instructions: Instruction[] = [];
    let offset = 0;

    while (offset < bytecode.length) {
      const { instruction, nextOffset } = InstructionTable.decode(bytecode, offset);
      instructions.push(instruction);
      offset = nextOffset;
    }

    const optimizedInstructions = this.applyPeepholeOptimizations(instructions);
    return this.encodeInstructions(optimizedInstructions);
  }

  private applyPeepholeOptimizations(instructions: Instruction[]): Instruction[] {
    const optimized: Instruction[] = [];

    for (let i = 0; i < instructions.length; i++) {
      const current = instructions[i];
      const next = instructions[i + 1];

      // PUSH x; POP -> (remove both)
      if (current.opcode === Opcode.PUSH && next && next.opcode === Opcode.POP) {
        i++; // Skip next instruction
        continue;
      }

      // DUP; POP -> (remove both)
      if (current.opcode === Opcode.DUP && next && next.opcode === Opcode.POP) {
        i++; // Skip next instruction
        continue;
      }

      // NOP -> remove
      if (current.opcode === Opcode.NOP) {
        continue;
      }

      optimized.push(current);
    }

    return optimized;
  }

  private encodeInstructions(instructions: Instruction[]): Uint8Array {
    const buffer: number[] = [];

    for (const instruction of instructions) {
      const encoded = InstructionTable.encode(instruction);
      for (const byte of encoded) {
        buffer.push(byte);
      }
    }

    return new Uint8Array(buffer);
  }
}

export class JumpOptimizationPass extends OptimizationPass {
  constructor() {
    super('jump_optimization', 'Optimizes jump instructions');
  }

  public optimize(bytecode: Uint8Array): Uint8Array {
    const instructions: Instruction[] = [];
    const offsetMap = new Map<number, number>();
    let offset = 0;

    while (offset < bytecode.length) {
      const { instruction, nextOffset } = InstructionTable.decode(bytecode, offset);
      instructions.push(instruction);
      offsetMap.set(instructions.length - 1, offset);
      offset = nextOffset;
    }

    const optimizedInstructions = this.optimizeJumps(instructions, offsetMap);
    return this.encodeInstructions(optimizedInstructions);
  }

  private optimizeJumps(instructions: Instruction[], offsetMap: Map<number, number>): Instruction[] {
    const optimized: Instruction[] = [];

    for (let i = 0; i < instructions.length; i++) {
      const current = instructions[i];
      const next = instructions[i + 1];

      const currentOffset = offsetMap.get(i) || 0;
      const nextOffset = offsetMap.get(i + 1) || 0;

      // JMP to next instruction -> remove
      if (current.opcode === Opcode.JMP && current.operands[0] === nextOffset) {
        continue;
      }

      // JZ 0; JMP target -> JMP target
      if (current.opcode === Opcode.JZ && current.operands[0] === 0 && next && next.opcode === Opcode.JMP) {
        optimized.push(next);
        i++; // Skip next instruction
        continue;
      }

      // JNZ 0 -> remove
      if (current.opcode === Opcode.JNZ && current.operands[0] === 0) {
        continue;
      }

      optimized.push(current);
    }

    return optimized;
  }

  private encodeInstructions(instructions: Instruction[]): Uint8Array {
    const buffer: number[] = [];

    for (const instruction of instructions) {
      const encoded = InstructionTable.encode(instruction);
      for (const byte of encoded) {
        buffer.push(byte);
      }
    }

    return new Uint8Array(buffer);
  }
}

export class DefaultBytecodeOptimizer extends BytecodeOptimizer {
  constructor() {
    super();

    this.registerPass(new DeadCodeEliminationPass());
    this.registerPass(new PeepholeOptimizationPass());
    this.registerPass(new JumpOptimizationPass());
    this.registerPass(new ConstantFoldingPass());
  }
}
