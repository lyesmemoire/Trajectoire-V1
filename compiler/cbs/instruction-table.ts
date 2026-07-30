/**
 * Blueprint DSL CBS Instruction Table
 * 
 * Defines instruction encoding and decoding.
 */

import { Opcode } from './opcode-table';

export interface Instruction {
  opcode: Opcode;
  operands: number[];
  size: number;
}

export interface InstructionEncoding {
  opcode: number;
  operandTypes: OperandType[];
  size: number;
}

export enum OperandType {
  NONE = 'NONE',
  IMMEDIATE_8 = 'IMMEDIATE_8',
  IMMEDIATE_16 = 'IMMEDIATE_16',
  IMMEDIATE_32 = 'IMMEDIATE_32',
  IMMEDIATE_64 = 'IMMEDIATE_64',
  REGISTER = 'REGISTER',
  ADDRESS = 'ADDRESS',
  OFFSET = 'OFFSET',
}

export class InstructionTable {
  private static encodings: Map<Opcode, InstructionEncoding> = new Map();

  static {
    // Arithmetic operations (no operands, stack-based)
    this.encodings.set(Opcode.ADD, {
      opcode: Opcode.ADD,
      operandTypes: [OperandType.NONE],
      size: 1,
    });

    this.encodings.set(Opcode.SUB, {
      opcode: Opcode.SUB,
      operandTypes: [OperandType.NONE],
      size: 1,
    });

    this.encodings.set(Opcode.MUL, {
      opcode: Opcode.MUL,
      operandTypes: [OperandType.NONE],
      size: 1,
    });

    this.encodings.set(Opcode.DIV, {
      opcode: Opcode.DIV,
      operandTypes: [OperandType.NONE],
      size: 1,
    });

    this.encodings.set(Opcode.MOD, {
      opcode: Opcode.MOD,
      operandTypes: [OperandType.NONE],
      size: 1,
    });

    this.encodings.set(Opcode.NEG, {
      opcode: Opcode.NEG,
      operandTypes: [OperandType.NONE],
      size: 1,
    });

    // Control flow (with immediate operand for jump target)
    this.encodings.set(Opcode.JMP, {
      opcode: Opcode.JMP,
      operandTypes: [OperandType.IMMEDIATE_32],
      size: 5,
    });

    this.encodings.set(Opcode.JZ, {
      opcode: Opcode.JZ,
      operandTypes: [OperandType.IMMEDIATE_32],
      size: 5,
    });

    this.encodings.set(Opcode.JNZ, {
      opcode: Opcode.JNZ,
      operandTypes: [OperandType.IMMEDIATE_32],
      size: 5,
    });

    this.encodings.set(Opcode.CALL, {
      opcode: Opcode.CALL,
      operandTypes: [OperandType.IMMEDIATE_32],
      size: 5,
    });

    this.encodings.set(Opcode.RET, {
      opcode: Opcode.RET,
      operandTypes: [OperandType.NONE],
      size: 1,
    });

    this.encodings.set(Opcode.TAILCALL, {
      opcode: Opcode.TAILCALL,
      operandTypes: [OperandType.IMMEDIATE_32],
      size: 5,
    });

    // Stack operations
    this.encodings.set(Opcode.PUSH, {
      opcode: Opcode.PUSH,
      operandTypes: [OperandType.IMMEDIATE_64],
      size: 9,
    });

    this.encodings.set(Opcode.POP, {
      opcode: Opcode.POP,
      operandTypes: [OperandType.NONE],
      size: 1,
    });

    this.encodings.set(Opcode.DUP, {
      opcode: Opcode.DUP,
      operandTypes: [OperandType.NONE],
      size: 1,
    });

    this.encodings.set(Opcode.SWAP, {
      opcode: Opcode.SWAP,
      operandTypes: [OperandType.NONE],
      size: 1,
    });

    this.encodings.set(Opcode.PICK, {
      opcode: Opcode.PICK,
      operandTypes: [OperandType.IMMEDIATE_8],
      size: 2,
    });

    this.encodings.set(Opcode.ROLL, {
      opcode: Opcode.ROLL,
      operandTypes: [OperandType.IMMEDIATE_8],
      size: 2,
    });

    // Memory operations
    this.encodings.set(Opcode.LOAD, {
      opcode: Opcode.LOAD,
      operandTypes: [OperandType.ADDRESS],
      size: 5,
    });

    this.encodings.set(Opcode.STORE, {
      opcode: Opcode.STORE,
      operandTypes: [OperandType.ADDRESS],
      size: 5,
    });

    this.encodings.set(Opcode.LOAD_CONST, {
      opcode: Opcode.LOAD_CONST,
      operandTypes: [OperandType.IMMEDIATE_32],
      size: 5,
    });

    this.encodings.set(Opcode.LOAD_GLOBAL, {
      opcode: Opcode.LOAD_GLOBAL,
      operandTypes: [OperandType.IMMEDIATE_32],
      size: 5,
    });

    this.encodings.set(Opcode.STORE_GLOBAL, {
      opcode: Opcode.STORE_GLOBAL,
      operandTypes: [OperandType.IMMEDIATE_32],
      size: 5,
    });

    // Register operations
    this.encodings.set(Opcode.MOV, {
      opcode: Opcode.MOV,
      operandTypes: [OperandType.REGISTER, OperandType.REGISTER],
      size: 3,
    });

    this.encodings.set(Opcode.MOV_REG, {
      opcode: Opcode.MOV_REG,
      operandTypes: [OperandType.REGISTER, OperandType.IMMEDIATE_64],
      size: 11,
    });

    this.encodings.set(Opcode.MOV_MEM, {
      opcode: Opcode.MOV_MEM,
      operandTypes: [OperandType.REGISTER, OperandType.ADDRESS],
      size: 7,
    });

    this.encodings.set(Opcode.MOV_REG_MEM, {
      opcode: Opcode.MOV_REG_MEM,
      operandTypes: [OperandType.ADDRESS, OperandType.REGISTER],
      size: 7,
    });

    // Cognitive operations
    this.encodings.set(Opcode.COGNITIVE_REASONING, {
      opcode: Opcode.COGNITIVE_REASONING,
      operandTypes: [OperandType.IMMEDIATE_32],
      size: 5,
    });

    this.encodings.set(Opcode.COGNITIVE_INFERENCE, {
      opcode: Opcode.COGNITIVE_INFERENCE,
      operandTypes: [OperandType.IMMEDIATE_32],
      size: 5,
    });

    this.encodings.set(Opcode.COGNITIVE_HYPOTHESIS, {
      opcode: Opcode.COGNITIVE_HYPOTHESIS,
      operandTypes: [OperandType.IMMEDIATE_32],
      size: 5,
    });

    this.encodings.set(Opcode.COGNITIVE_KNOWLEDGE, {
      opcode: Opcode.COGNITIVE_KNOWLEDGE,
      operandTypes: [OperandType.IMMEDIATE_32],
      size: 5,
    });

    this.encodings.set(Opcode.COGNITIVE_MEMORY, {
      opcode: Opcode.COGNITIVE_MEMORY,
      operandTypes: [OperandType.IMMEDIATE_32],
      size: 5,
    });

    // Provider operations
    this.encodings.set(Opcode.PROVIDER_CALL, {
      opcode: Opcode.PROVIDER_CALL,
      operandTypes: [OperandType.IMMEDIATE_32],
      size: 5,
    });

    this.encodings.set(Opcode.PROVIDER_ASYNC, {
      opcode: Opcode.PROVIDER_ASYNC,
      operandTypes: [OperandType.IMMEDIATE_32],
      size: 5,
    });

    this.encodings.set(Opcode.PROVIDER_STREAM, {
      opcode: Opcode.PROVIDER_STREAM,
      operandTypes: [OperandType.IMMEDIATE_32],
      size: 5,
    });

    // Type operations
    this.encodings.set(Opcode.CAST, {
      opcode: Opcode.CAST,
      operandTypes: [OperandType.IMMEDIATE_8],
      size: 2,
    });

    this.encodings.set(Opcode.TYPEOF, {
      opcode: Opcode.TYPEOF,
      operandTypes: [OperandType.NONE],
      size: 1,
    });

    this.encodings.set(Opcode.INSTANCEOF, {
      opcode: Opcode.INSTANCEOF,
      operandTypes: [OperandType.IMMEDIATE_32],
      size: 5,
    });

    // Array operations
    this.encodings.set(Opcode.NEW_ARRAY, {
      opcode: Opcode.NEW_ARRAY,
      operandTypes: [OperandType.IMMEDIATE_32],
      size: 5,
    });

    this.encodings.set(Opcode.GET_ARRAY, {
      opcode: Opcode.GET_ARRAY,
      operandTypes: [OperandType.NONE],
      size: 1,
    });

    this.encodings.set(Opcode.SET_ARRAY, {
      opcode: Opcode.SET_ARRAY,
      operandTypes: [OperandType.NONE],
      size: 1,
    });

    this.encodings.set(Opcode.ARRAY_LENGTH, {
      opcode: Opcode.ARRAY_LENGTH,
      operandTypes: [OperandType.NONE],
      size: 1,
    });

    // Object operations
    this.encodings.set(Opcode.NEW_OBJECT, {
      opcode: Opcode.NEW_OBJECT,
      operandTypes: [OperandType.IMMEDIATE_32],
      size: 5,
    });

    this.encodings.set(Opcode.GET_PROPERTY, {
      opcode: Opcode.GET_PROPERTY,
      operandTypes: [OperandType.IMMEDIATE_32],
      size: 5,
    });

    this.encodings.set(Opcode.SET_PROPERTY, {
      opcode: Opcode.SET_PROPERTY,
      operandTypes: [OperandType.IMMEDIATE_32],
      size: 5,
    });

    this.encodings.set(Opcode.DELETE_PROPERTY, {
      opcode: Opcode.DELETE_PROPERTY,
      operandTypes: [OperandType.IMMEDIATE_32],
      size: 5,
    });

    // String operations
    this.encodings.set(Opcode.CONCAT, {
      opcode: Opcode.CONCAT,
      operandTypes: [OperandType.NONE],
      size: 1,
    });

    this.encodings.set(Opcode.SUBSTRING, {
      opcode: Opcode.SUBSTRING,
      operandTypes: [OperandType.NONE],
      size: 1,
    });

    this.encodings.set(Opcode.STRING_LENGTH, {
      opcode: Opcode.STRING_LENGTH,
      operandTypes: [OperandType.NONE],
      size: 1,
    });

    // Exception operations
    this.encodings.set(Opcode.THROW, {
      opcode: Opcode.THROW,
      operandTypes: [OperandType.NONE],
      size: 1,
    });

    this.encodings.set(Opcode.CATCH, {
      opcode: Opcode.CATCH,
      operandTypes: [OperandType.IMMEDIATE_32],
      size: 5,
    });

    this.encodings.set(Opcode.FINALLY, {
      opcode: Opcode.FINALLY,
      operandTypes: [OperandType.IMMEDIATE_32],
      size: 5,
    });

    // Debug operations
    this.encodings.set(Opcode.DEBUG_BREAK, {
      opcode: Opcode.DEBUG_BREAK,
      operandTypes: [OperandType.NONE],
      size: 1,
    });

    this.encodings.set(Opcode.DEBUG_PRINT, {
      opcode: Opcode.DEBUG_PRINT,
      operandTypes: [OperandType.NONE],
      size: 1,
    });

    this.encodings.set(Opcode.DEBUG_TRACE, {
      opcode: Opcode.DEBUG_TRACE,
      operandTypes: [OperandType.NONE],
      size: 1,
    });

    // Meta operations
    this.encodings.set(Opcode.NOP, {
      opcode: Opcode.NOP,
      operandTypes: [OperandType.NONE],
      size: 1,
    });

    this.encodings.set(Opcode.HALT, {
      opcode: Opcode.HALT,
      operandTypes: [OperandType.NONE],
      size: 1,
    });
  }

  /**
   * Get instruction encoding
   */
  public static getEncoding(opcode: Opcode): InstructionEncoding | undefined {
    return this.encodings.get(opcode);
  }

  /**
   * Get instruction size
   */
  public static getSize(opcode: Opcode): number {
    const encoding = this.encodings.get(opcode);
    return encoding ? encoding.size : 1;
  }

  /**
   * Get operand types
   */
  public static getOperandTypes(opcode: Opcode): OperandType[] {
    const encoding = this.encodings.get(opcode);
    return encoding ? encoding.operandTypes : [OperandType.NONE];
  }

  /**
   * Encode instruction to bytes
   */
  public static encode(instruction: Instruction): Uint8Array {
    const encoding = this.encodings.get(instruction.opcode);
    if (!encoding) {
      throw new Error(`Unknown opcode: ${instruction.opcode}`);
    }

    const buffer: number[] = [];
    buffer.push(instruction.opcode);

    for (let i = 0; i < instruction.operands.length; i++) {
      const operand = instruction.operands[i];
      const operandType = encoding.operandTypes[i];

      switch (operandType) {
        case OperandType.IMMEDIATE_8:
          buffer.push(operand & 0xFF);
          break;
        case OperandType.IMMEDIATE_16:
          buffer.push((operand >> 8) & 0xFF);
          buffer.push(operand & 0xFF);
          break;
        case OperandType.IMMEDIATE_32:
          buffer.push((operand >> 24) & 0xFF);
          buffer.push((operand >> 16) & 0xFF);
          buffer.push((operand >> 8) & 0xFF);
          buffer.push(operand & 0xFF);
          break;
        case OperandType.IMMEDIATE_64:
          buffer.push((operand >> 56) & 0xFF);
          buffer.push((operand >> 48) & 0xFF);
          buffer.push((operand >> 40) & 0xFF);
          buffer.push((operand >> 32) & 0xFF);
          buffer.push((operand >> 24) & 0xFF);
          buffer.push((operand >> 16) & 0xFF);
          buffer.push((operand >> 8) & 0xFF);
          buffer.push(operand & 0xFF);
          break;
        case OperandType.REGISTER:
          buffer.push(operand & 0xFF);
          break;
        case OperandType.ADDRESS:
          buffer.push((operand >> 24) & 0xFF);
          buffer.push((operand >> 16) & 0xFF);
          buffer.push((operand >> 8) & 0xFF);
          buffer.push(operand & 0xFF);
          break;
        case OperandType.OFFSET:
          buffer.push((operand >> 24) & 0xFF);
          buffer.push((operand >> 16) & 0xFF);
          buffer.push((operand >> 8) & 0xFF);
          buffer.push(operand & 0xFF);
          break;
        default:
          break;
      }
    }

    return new Uint8Array(buffer);
  }

  /**
   * Decode instruction from bytes
   */
  public static decode(bytes: Uint8Array, offset: number): { instruction: Instruction; nextOffset: number } {
    const opcode = bytes[offset] as Opcode;
    const encoding = this.encodings.get(opcode);

    if (!encoding) {
      throw new Error(`Unknown opcode: ${opcode}`);
    }

    const operands: number[] = [];
    let currentOffset = offset + 1;

    for (const operandType of encoding.operandTypes) {
      switch (operandType) {
        case OperandType.IMMEDIATE_8:
          operands.push(bytes[currentOffset]);
          currentOffset += 1;
          break;
        case OperandType.IMMEDIATE_16:
          operands.push((bytes[currentOffset] << 8) | bytes[currentOffset + 1]);
          currentOffset += 2;
          break;
        case OperandType.IMMEDIATE_32:
          operands.push(
            (bytes[currentOffset] << 24) |
            (bytes[currentOffset + 1] << 16) |
            (bytes[currentOffset + 2] << 8) |
            bytes[currentOffset + 3]
          );
          currentOffset += 4;
          break;
        case OperandType.IMMEDIATE_64:
          operands.push(
            (bytes[currentOffset] << 56) |
            (bytes[currentOffset + 1] << 48) |
            (bytes[currentOffset + 2] << 40) |
            (bytes[currentOffset + 3] << 32) |
            (bytes[currentOffset + 4] << 24) |
            (bytes[currentOffset + 5] << 16) |
            (bytes[currentOffset + 6] << 8) |
            bytes[currentOffset + 7]
          );
          currentOffset += 8;
          break;
        case OperandType.REGISTER:
          operands.push(bytes[currentOffset]);
          currentOffset += 1;
          break;
        case OperandType.ADDRESS:
          operands.push(
            (bytes[currentOffset] << 24) |
            (bytes[currentOffset + 1] << 16) |
            (bytes[currentOffset + 2] << 8) |
            bytes[currentOffset + 3]
          );
          currentOffset += 4;
          break;
        case OperandType.OFFSET:
          operands.push(
            (bytes[currentOffset] << 24) |
            (bytes[currentOffset + 1] << 16) |
            (bytes[currentOffset + 2] << 8) |
            bytes[currentOffset + 3]
          );
          currentOffset += 4;
          break;
        default:
          break;
      }
    }

    const instruction: Instruction = {
      opcode,
      operands,
      size: encoding.size,
    };

    return { instruction, nextOffset: currentOffset };
  }

  /**
   * Get all encodings
   */
  public static getAllEncodings(): Map<Opcode, InstructionEncoding> {
    return new Map(this.encodings);
  }
}
