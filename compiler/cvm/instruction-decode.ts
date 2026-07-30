/**
 * Blueprint DSL CVM Instruction Decode
 * 
 * Decodes fetched instructions for execution.
 */

import { Instruction, InstructionTable } from '../cbs/instruction-table';
import { Opcode, OpcodeTable } from '../cbs/opcode-table';

export interface DecodedInstruction {
  instruction: Instruction;
  opcode: Opcode;
  operands: number[];
  isBranch: boolean;
  isCall: boolean;
  isReturn: boolean;
  isTerminator: boolean;
  stackEffect: number;
}

export class InstructionDecode {
  /**
   * Decode instruction
   */
  public decode(instruction: Instruction): DecodedInstruction {
    const opcode = instruction.opcode as Opcode;
    const opcodeInfo = OpcodeTable.getInfo(opcode);

    if (!opcodeInfo) {
      throw new Error(`Unknown opcode: ${opcode}`);
    }

    return {
      instruction,
      opcode,
      operands: instruction.operands,
      isBranch: opcodeInfo.isBranch,
      isCall: opcodeInfo.isCall,
      isReturn: opcodeInfo.isReturn,
      isTerminator: opcodeInfo.isTerminator,
      stackEffect: opcodeInfo.stackEffect,
    };
  }

  /**
   * Decode multiple instructions
   */
  public decodeMultiple(instructions: Instruction[]): DecodedInstruction[] {
    return instructions.map(inst => this.decode(inst));
  }

  /**
   * Validate instruction
   */
  public validate(instruction: Instruction): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    const opcode = instruction.opcode as Opcode;
    const opcodeInfo = OpcodeTable.getInfo(opcode);

    if (!opcodeInfo) {
      errors.push(`Unknown opcode: ${opcode}`);
      return { valid: false, errors };
    }

    const encoding = InstructionTable.getEncoding(opcode);
    if (!encoding) {
      errors.push(`No encoding for opcode: ${opcode}`);
      return { valid: false, errors };
    }

    if (instruction.operands.length !== encoding.operandTypes.length) {
      errors.push(
        `Operand count mismatch: expected ${encoding.operandTypes.length}, got ${instruction.operands.length}`
      );
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Get instruction size
   */
  public getSize(instruction: Instruction): number {
    return InstructionTable.getSize(instruction.opcode as Opcode);
  }

  /**
   * Get operand types
   */
  public getOperandTypes(instruction: Instruction): string[] {
    const encoding = InstructionTable.getEncoding(instruction.opcode as Opcode);
    return encoding ? encoding.operandTypes.map(t => String(t)) : [];
  }

  /**
   * Format instruction for debugging
   */
  public format(instruction: Instruction): string {
    const opcode = instruction.opcode as Opcode;
    const opcodeInfo = OpcodeTable.getInfo(opcode);

    if (!opcodeInfo) {
      return `UNKNOWN(${opcode})`;
    }

    let result = opcodeInfo.name;

    if (instruction.operands.length > 0) {
      const operands = instruction.operands.map(op => String(op)).join(', ');
      result += ` ${operands}`;
    }

    return result;
  }

  /**
   * Format multiple instructions
   */
  public formatMultiple(instructions: Instruction[]): string[] {
    return instructions.map(inst => this.format(inst));
  }
}
