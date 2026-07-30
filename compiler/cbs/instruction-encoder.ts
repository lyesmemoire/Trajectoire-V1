/**
 * Blueprint DSL CBS Instruction Encoder
 * 
 * Encodes IR instructions to bytecode.
 */

import { IRInstruction, IRInstructionType } from '../cir/ir-generator';
import { Opcode } from './opcode-table';
import { Instruction, InstructionTable } from './instruction-table';
import { RegisterTable } from './register-table';

export interface EncodingContext {
  constantPool: Map<string, number>;
  functionTable: Map<string, number>;
  labelTable: Map<string, number>;
  currentOffset: number;
}

export class InstructionEncoder {
  private context: EncodingContext;

  constructor() {
    this.context = {
      constantPool: new Map(),
      functionTable: new Map(),
      labelTable: new Map(),
      currentOffset: 0,
    };
  }

  /**
   * Encode an IR instruction to bytecode
   */
  public encode(irInstruction: IRInstruction): Uint8Array {
    const opcode = this.mapIRToOpcode(irInstruction.instructionType);
    if (!opcode) {
      throw new Error(`Unknown IR instruction type: ${irInstruction.instructionType}`);
    }

    const operands = this.encodeOperands(irInstruction, opcode);
    const instruction: Instruction = {
      opcode,
      operands,
      size: InstructionTable.getSize(opcode),
    };

    const bytes = InstructionTable.encode(instruction);
    this.context.currentOffset += bytes.length;

    return bytes;
  }

  /**
   * Map IR instruction type to opcode
   */
  private mapIRToOpcode(irType: IRInstructionType): Opcode | null {
    const mapping: Map<IRInstructionType, Opcode> = new Map([
      [IRInstructionType.ADD, Opcode.ADD],
      [IRInstructionType.SUB, Opcode.SUB],
      [IRInstructionType.MUL, Opcode.MUL],
      [IRInstructionType.DIV, Opcode.DIV],
      [IRInstructionType.MOD, Opcode.MOD],
      [IRInstructionType.AND, Opcode.AND],
      [IRInstructionType.OR, Opcode.OR],
      [IRInstructionType.XOR, Opcode.XOR],
      [IRInstructionType.NOT, Opcode.NOT],
      [IRInstructionType.SHL, Opcode.SHL],
      [IRInstructionType.SHR, Opcode.SHR],
      [IRInstructionType.LOAD, Opcode.LOAD],
      [IRInstructionType.STORE, Opcode.STORE],
      [IRInstructionType.CALL, Opcode.CALL],
      [IRInstructionType.RET, Opcode.RET],
      [IRInstructionType.BR, Opcode.JMP],
      [IRInstructionType.BR_COND, Opcode.JZ],
      [IRInstructionType.PHI, Opcode.NOP], // PHI nodes are eliminated during SSA
      [IRInstructionType.COGNITIVE_REASONING, Opcode.COGNITIVE_REASONING],
      [IRInstructionType.COGNITIVE_INFERENCE, Opcode.COGNITIVE_INFERENCE],
      [IRInstructionType.COGNITIVE_HYPOTHESIS, Opcode.COGNITIVE_HYPOTHESIS],
      [IRInstructionType.COGNITIVE_KNOWLEDGE, Opcode.COGNITIVE_KNOWLEDGE],
      [IRInstructionType.COGNITIVE_MEMORY, Opcode.COGNITIVE_MEMORY],
      [IRInstructionType.PROVIDER_CALL, Opcode.PROVIDER_CALL],
    ]);

    return mapping.get(irType) || null;
  }

  /**
   * Encode operands
   */
  private encodeOperands(irInstruction: IRInstruction, opcode: Opcode): number[] {
    const operands: number[] = [];
    const operandTypes = InstructionTable.getOperandTypes(opcode);

    for (let i = 0; i < irInstruction.operands.length && i < operandTypes.length; i++) {
      const operand = irInstruction.operands[i];
      const operandType = operandTypes[i];

      const encoded = this.encodeOperand(operand, operandType);
      operands.push(encoded);
    }

    return operands;
  }

  /**
   * Encode a single operand
   */
  private encodeOperand(operand: unknown, operandType: unknown): number {
    if (typeof operand === 'string') {
      // Check if it's a register
      const register = RegisterTable.getByName(operand);
      if (register !== undefined) {
        return register;
      }

      // Check if it's a constant
      const constantIndex = this.context.constantPool.get(operand);
      if (constantIndex !== undefined) {
        return constantIndex;
      }

      // Check if it's a function
      const functionIndex = this.context.functionTable.get(operand);
      if (functionIndex !== undefined) {
        return functionIndex;
      }

      // Check if it's a label
      const labelOffset = this.context.labelTable.get(operand);
      if (labelOffset !== undefined) {
        return labelOffset;
      }

      // Treat as string constant
      const index = this.context.constantPool.size;
      this.context.constantPool.set(operand, index);
      return index;
    } else if (typeof operand === 'number') {
      return operand;
    } else if (typeof operand === 'boolean') {
      return operand ? 1 : 0;
    } else if (typeof operand === 'object' && operand !== null) {
      // Handle constant objects
      const key = JSON.stringify(operand);
      const index = this.context.constantPool.size;
      this.context.constantPool.set(key, index);
      return index;
    }

    return 0;
  }

  /**
   * Set constant pool
   */
  public setConstantPool(pool: Map<string, number>): void {
    this.context.constantPool = new Map(pool);
  }

  /**
   * Set function table
   */
  public setFunctionTable(table: Map<string, number>): void {
    this.context.functionTable = new Map(table);
  }

  /**
   * Set label table
   */
  public setLabelTable(table: Map<string, number>): void {
    this.context.labelTable = new Map(table);
  }

  /**
   * Get constant pool
   */
  public getConstantPool(): Map<string, number> {
    return new Map(this.context.constantPool);
  }

  /**
   * Get function table
   */
  public getFunctionTable(): Map<string, number> {
    return new Map(this.context.functionTable);
  }

  /**
   * Get label table
   */
  public getLabelTable(): Map<string, number> {
    return new Map(this.context.labelTable);
  }

  /**
   * Reset context
   */
  public reset(): void {
    this.context = {
      constantPool: new Map(),
      functionTable: new Map(),
      labelTable: new Map(),
      currentOffset: 0,
    };
  }

  /**
   * Get current offset
   */
  public getCurrentOffset(): number {
    return this.context.currentOffset;
  }
}
