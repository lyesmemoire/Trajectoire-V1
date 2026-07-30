/**
 * Blueprint DSL CBS Bytecode Validator
 * 
 * Validates bytecode structure and correctness.
 */

import { OpcodeTable } from './opcode-table';
import { Instruction, InstructionTable } from './instruction-table';
import { Package, PackageLoader } from './package-loader';

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  statistics: ValidationStatistics;
}

export interface ValidationError {
  type: ErrorType;
  message: string;
  offset: number;
  severity: 'error' | 'fatal';
}

export interface ValidationWarning {
  type: WarningType;
  message: string;
  offset: number;
}

export interface ValidationStatistics {
  totalInstructions: number;
  validInstructions: number;
  invalidInstructions: number;
  branchInstructions: number;
  callInstructions: number;
  returnInstructions: number;
  stackDepth: number;
  maxStackDepth: number;
}

export enum ErrorType {
  INVALID_OPCODE = 'INVALID_OPCODE',
  INVALID_OPERAND = 'INVALID_OPERAND',
  INVALID_STACK_EFFECT = 'INVALID_STACK_EFFECT',
  INVALID_BRANCH_TARGET = 'INVALID_BRANCH_TARGET',
  INVALID_CALL_TARGET = 'INVALID_CALL_TARGET',
  UNREACHABLE_CODE = 'UNREACHABLE_CODE',
  STACK_UNDERFLOW = 'STACK_UNDERFLOW',
  STACK_OVERFLOW = 'STACK_OVERFLOW',
  MISMATCHED_TYPES = 'MISMATCHED_TYPES',
}

export enum WarningType {
  DEAD_CODE = 'DEAD_CODE',
  REDUNDANT_OPERATION = 'REDUNDANT_OPERATION',
  POTENTIAL_OPTIMIZATION = 'POTENTIAL_OPTIMIZATION',
  UNUSUAL_PATTERN = 'UNUSUAL_PATTERN',
}

export class BytecodeValidator {
  private errors: ValidationError[] = [];
  private warnings: ValidationWarning[] = [];
  private statistics: ValidationStatistics;
  private currentStackDepth: number = 0;
  private maxStackDepth: number = 0;
  private visitedOffsets: Set<number> = new Set();
  private branchTargets: Set<number> = new Set();

  constructor() {
    this.statistics = {
      totalInstructions: 0,
      validInstructions: 0,
      invalidInstructions: 0,
      branchInstructions: 0,
      callInstructions: 0,
      returnInstructions: 0,
      stackDepth: 0,
      maxStackDepth: 0,
    };
  }

  /**
   * Validate bytecode
   */
  public validate(bytecode: Uint8Array): ValidationResult {
    this.errors = [];
    this.warnings = [];
    this.currentStackDepth = 0;
    this.maxStackDepth = 0;
    this.visitedOffsets.clear();
    this.branchTargets.clear();

    let offset = 0;
    while (offset < bytecode.length) {
      this.visitedOffsets.add(offset);

      try {
        const { instruction, nextOffset } = InstructionTable.decode(bytecode, offset);
        this.validateInstruction(instruction, offset, bytecode);
        
        this.statistics.totalInstructions++;
        this.statistics.validInstructions++;

        offset = nextOffset;
      } catch (error) {
        this.errors.push({
          type: ErrorType.INVALID_OPCODE,
          message: `Invalid instruction at offset ${offset}: ${error}`,
          offset,
          severity: 'error',
        });
        this.statistics.invalidInstructions++;
        offset++;
      }
    }

    // Validate branch targets
    this.validateBranchTargets();

    // Check for unreachable code
    this.checkUnreachableCode(bytecode.length);

    this.statistics.stackDepth = this.currentStackDepth;
    this.statistics.maxStackDepth = this.maxStackDepth;

    return {
      valid: this.errors.filter(e => e.severity === 'fatal').length === 0,
      errors: this.errors,
      warnings: this.warnings,
      statistics: this.statistics,
    };
  }

  /**
   * Validate a single instruction
   */
  private validateInstruction(instruction: Instruction, offset: number, bytecode: Uint8Array): void {
    const opcodeInfo = OpcodeTable.getInfo(instruction.opcode);
    if (!opcodeInfo) {
      this.errors.push({
        type: ErrorType.INVALID_OPCODE,
        message: `Unknown opcode: ${instruction.opcode}`,
        offset,
        severity: 'fatal',
      });
      return;
    }

    // Validate stack effect
    const stackEffect = OpcodeTable.getStackEffect(instruction.opcode);
    this.currentStackDepth += stackEffect;

    if (this.currentStackDepth < 0) {
      this.errors.push({
        type: ErrorType.STACK_UNDERFLOW,
        message: `Stack underflow at offset ${offset}`,
        offset,
        severity: 'error',
      });
    }

    if (this.currentStackDepth > 1000) {
      this.errors.push({
        type: ErrorType.STACK_OVERFLOW,
        message: `Stack overflow at offset ${offset}`,
        offset,
        severity: 'error',
      });
    }

    this.maxStackDepth = Math.max(this.maxStackDepth, this.currentStackDepth);

    // Count instruction types
    if (OpcodeTable.isBranch(instruction.opcode)) {
      this.statistics.branchInstructions++;
      this.validateBranchTarget(instruction, offset, bytecode);
    }

    if (OpcodeTable.isCall(instruction.opcode)) {
      this.statistics.callInstructions++;
      this.validateCallTarget(instruction, offset);
    }

    if (OpcodeTable.isReturn(instruction.opcode)) {
      this.statistics.returnInstructions++;
    }
  }

  /**
   * Validate branch target
   */
  private validateBranchTarget(instruction: Instruction, offset: number, bytecode: Uint8Array): void {
    if (instruction.operands.length > 0) {
      const target = instruction.operands[0];
      if (target < 0 || target >= bytecode.length) {
        this.errors.push({
          type: ErrorType.INVALID_BRANCH_TARGET,
          message: `Invalid branch target: ${target} at offset ${offset}`,
          offset,
          severity: 'error',
        });
      } else {
        this.branchTargets.add(target);
      }
    }
  }

  /**
   * Validate call target
   */
  private validateCallTarget(instruction: Instruction, offset: number): void {
    if (instruction.operands.length > 0) {
      const target = instruction.operands[0];
      if (target < 0) {
        this.errors.push({
          type: ErrorType.INVALID_CALL_TARGET,
          message: `Invalid call target: ${target} at offset ${offset}`,
          offset,
          severity: 'error',
        });
      }
    }
  }

  /**
   * Validate branch targets
   */
  private validateBranchTargets(): void {
    for (const target of this.branchTargets) {
      if (!this.visitedOffsets.has(target)) {
        this.warnings.push({
          type: WarningType.UNUSUAL_PATTERN,
          message: `Branch target ${target} not reached during validation`,
          offset: target,
        });
      }
    }
  }

  /**
   * Check for unreachable code
   */
  private checkUnreachableCode(bytecodeLength: number): void {
    for (let offset = 0; offset < bytecodeLength; offset++) {
      if (!this.visitedOffsets.has(offset)) {
        this.warnings.push({
          type: WarningType.DEAD_CODE,
          message: `Unreachable code at offset ${offset}`,
          offset,
        });
      }
    }
  }

  /**
   * Validate package
   */
  public validatePackage(pkg: Package): ValidationResult {
    const loader = new PackageLoader();
    const validation = loader.validatePackage(pkg);

    if (!validation.valid) {
      for (const error of validation.errors) {
        this.errors.push({
          type: ErrorType.INVALID_OPCODE,
          message: error,
          offset: 0,
          severity: 'error',
        });
      }
    }

    // Validate code section
    const codeSection = pkg.sections.get(0x01 as unknown);
    if (codeSection) {
      const codeValidation = this.validate(codeSection.data);
      this.errors.push(...codeValidation.errors);
      this.warnings.push(...codeValidation.warnings);
    }

    return {
      valid: this.errors.filter(e => e.severity === 'fatal').length === 0,
      errors: this.errors,
      warnings: this.warnings,
      statistics: this.statistics,
    };
  }

  /**
   * Get errors
   */
  public getErrors(): ValidationError[] {
    return [...this.errors];
  }

  /**
   * Get warnings
   */
  public getWarnings(): ValidationWarning[] {
    return [...this.warnings];
  }

  /**
   * Get statistics
   */
  public getStatistics(): ValidationStatistics {
    return { ...this.statistics };
  }

  /**
   * Clear validation state
   */
  public clear(): void {
    this.errors = [];
    this.warnings = [];
    this.currentStackDepth = 0;
    this.maxStackDepth = 0;
    this.visitedOffsets.clear();
    this.branchTargets.clear();
    this.statistics = {
      totalInstructions: 0,
      validInstructions: 0,
      invalidInstructions: 0,
      branchInstructions: 0,
      callInstructions: 0,
      returnInstructions: 0,
      stackDepth: 0,
      maxStackDepth: 0,
    };
  }
}
