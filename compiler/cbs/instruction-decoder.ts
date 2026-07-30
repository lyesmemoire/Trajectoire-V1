/**
 * Blueprint DSL CBS Instruction Decoder
 * 
 * Decodes bytecode to IR instructions.
 */

import { IRInstruction, IRInstructionType } from '../cir/ir-generator';
import { Opcode } from './opcode-table';
import { Instruction, InstructionTable } from './instruction-table';
import { Register, RegisterTable } from './register-table';

export interface DecodingContext {
  constantPool: Map<number, any>;
  functionTable: Map<number, string>;
  labelTable: Map<number, string>;
}

export class InstructionDecoder {
  private context: DecodingContext;

  constructor() {
    this.context = {
      constantPool: new Map(),
      functionTable: new Map(),
      labelTable: new Map(),
    };
  }

  /**
   * Decode bytecode to IR instruction
   */
  public decode(bytes: Uint8Array, offset: number): { instruction: IRInstruction; nextOffset: number } {
    const { instruction: bytecodeInstruction, nextOffset } = InstructionTable.decode(bytes, offset);
    const irInstruction = this.mapOpcodeToIR(bytecodeInstruction);

    return { instruction: irInstruction, nextOffset };
  }

  /**
   * Map opcode to IR instruction type
   */
  private mapOpcodeToIR(bytecodeInstruction: Instruction): IRInstruction {
    const irType = this.mapOpcodeToIRType(bytecodeInstruction.opcode);
    const operands = this.decodeOperands(bytecodeInstruction);

    return {
      id: this.generateInstructionId(),
      type: 'INSTRUCTION' as unknown,
      instructionType: irType,
      operands,
      result: this.hasResult(irType) ? this.generateResultName() : undefined,
      line: 0,
      column: 0,
    };
  }

  /**
   * Map opcode to IR instruction type
   */
  private mapOpcodeToIRType(opcode: Opcode): IRInstructionType {
    const mapping: Map<Opcode, IRInstructionType> = new Map([
      [Opcode.ADD, IRInstructionType.ADD],
      [Opcode.SUB, IRInstructionType.SUB],
      [Opcode.MUL, IRInstructionType.MUL],
      [Opcode.DIV, IRInstructionType.DIV],
      [Opcode.MOD, IRInstructionType.MOD],
      [Opcode.AND, IRInstructionType.AND],
      [Opcode.OR, IRInstructionType.OR],
      [Opcode.XOR, IRInstructionType.XOR],
      [Opcode.NOT, IRInstructionType.NOT],
      [Opcode.SHL, IRInstructionType.SHL],
      [Opcode.SHR, IRInstructionType.SHR],
      [Opcode.LOAD, IRInstructionType.LOAD],
      [Opcode.STORE, IRInstructionType.STORE],
      [Opcode.CALL, IRInstructionType.CALL],
      [Opcode.RET, IRInstructionType.RET],
      [Opcode.JMP, IRInstructionType.BR],
      [Opcode.JZ, IRInstructionType.BR_COND],
      [Opcode.JNZ, IRInstructionType.BR_COND],
      [Opcode.TAILCALL, IRInstructionType.CALL],
      [Opcode.COGNITIVE_REASONING, IRInstructionType.COGNITIVE_REASONING],
      [Opcode.COGNITIVE_INFERENCE, IRInstructionType.COGNITIVE_INFERENCE],
      [Opcode.COGNITIVE_HYPOTHESIS, IRInstructionType.COGNITIVE_HYPOTHESIS],
      [Opcode.COGNITIVE_KNOWLEDGE, IRInstructionType.COGNITIVE_KNOWLEDGE],
      [Opcode.COGNITIVE_MEMORY, IRInstructionType.COGNITIVE_MEMORY],
      [Opcode.PROVIDER_CALL, IRInstructionType.PROVIDER_CALL],
      [Opcode.PROVIDER_ASYNC, IRInstructionType.PROVIDER_CALL],
      [Opcode.PROVIDER_STREAM, IRInstructionType.PROVIDER_CALL],
    ]);

    return mapping.get(opcode) || IRInstructionType.ADD;
  }

  /**
   * Decode operands
   */
  private decodeOperands(bytecodeInstruction: Instruction): unknown[] {
    const operands: unknown[] = [];
    const operandTypes = InstructionTable.getOperandTypes(bytecodeInstruction.opcode);

    for (let i = 0; i < bytecodeInstruction.operands.length && i < operandTypes.length; i++) {
      const operand = bytecodeInstruction.operands[i];
      const operandType = operandTypes[i];

      const decoded = this.decodeOperand(operand, operandType);
      operands.push(decoded);
    }

    return operands;
  }

  /**
   * Decode a single operand
   */
  private decodeOperand(operand: number, operandType: unknown): unknown {
    switch (operandType) {
      case 'REGISTER': {
        const register = operand as Register;
        const registerInfo = RegisterTable.getInfo(register);
        return registerInfo ? registerInfo.name : `R${operand}`;
      }

      case 'IMMEDIATE_8':
      case 'IMMEDIATE_16':
      case 'IMMEDIATE_32':
      case 'IMMEDIATE_64':
        {
          // Check if it's a constant pool index
          if (this.context.constantPool.has(operand)) {
          return this.context.constantPool.get(operand);
      }}
        // Check if it's a function table index
        if (this.context.functionTable.has(operand)) {
          return this.context.functionTable.get(operand);
        }
        // Check if it's a label table index
        if (this.context.labelTable.has(operand)) {
          return this.context.labelTable.get(operand);
        }
        // Return as immediate value
        return operand;

      case 'ADDRESS':
        // Check if it's a constant pool index
        if (this.context.constantPool.has(operand)) {
          return this.context.constantPool.get(operand);
        }
        // Return as address
        return operand;

      case 'OFFSET':
        // Return as offset
        return operand;

      default:
        return operand;
    }
  }

  /**
   * Check if instruction type produces a result
   */
  private hasResult(irType: IRInstructionType): boolean {
    const resultProducers = [
      IRInstructionType.ADD,
      IRInstructionType.SUB,
      IRInstructionType.MUL,
      IRInstructionType.DIV,
      IRInstructionType.MOD,
      IRInstructionType.AND,
      IRInstructionType.OR,
      IRInstructionType.XOR,
      IRInstructionType.NOT,
      IRInstructionType.SHL,
      IRInstructionType.SHR,
      IRInstructionType.LOAD,
      IRInstructionType.CALL,
      IRInstructionType.COGNITIVE_REASONING,
      IRInstructionType.COGNITIVE_INFERENCE,
      IRInstructionType.COGNITIVE_HYPOTHESIS,
      IRInstructionType.COGNITIVE_KNOWLEDGE,
      IRInstructionType.COGNITIVE_MEMORY,
      IRInstructionType.PROVIDER_CALL,
    ];

    return resultProducers.includes(irType);
  }

  /**
   * Generate instruction ID
   */
  private generateInstructionId(): string {
    return `inst_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate result name
   */
  private generateResultName(): string {
    return `result_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Set constant pool
   */
  public setConstantPool(pool: Map<number, any>): void {
    this.context.constantPool = new Map(pool);
  }

  /**
   * Set function table
   */
  public setFunctionTable(table: Map<number, string>): void {
    this.context.functionTable = new Map(table);
  }

  /**
   * Set label table
   */
  public setLabelTable(table: Map<number, string>): void {
    this.context.labelTable = new Map(table);
  }

  /**
   * Get constant pool
   */
  public getConstantPool(): Map<number, any> {
    return new Map(this.context.constantPool);
  }

  /**
   * Get function table
   */
  public getFunctionTable(): Map<number, string> {
    return new Map(this.context.functionTable);
  }

  /**
   * Get label table
   */
  public getLabelTable(): Map<number, string> {
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
    };
  }
}
