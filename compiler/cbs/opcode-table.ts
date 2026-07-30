/**
 * Blueprint DSL CBS Opcode Table
 * 
 * Defines all opcodes for the bytecode instruction set.
 */

export enum Opcode {
  // Arithmetic operations
  ADD = 0x01,
  SUB = 0x02,
  MUL = 0x03,
  DIV = 0x04,
  MOD = 0x05,
  NEG = 0x06,

  // Bitwise operations
  AND = 0x10,
  OR = 0x11,
  XOR = 0x12,
  NOT = 0x13,
  SHL = 0x14,
  SHR = 0x15,

  // Comparison operations
  EQ = 0x20,
  NE = 0x21,
  LT = 0x22,
  GT = 0x23,
  LE = 0x24,
  GE = 0x25,

  // Control flow
  JMP = 0x30,
  JZ = 0x31,
  JNZ = 0x32,
  CALL = 0x33,
  RET = 0x34,
  TAILCALL = 0x35,

  // Stack operations
  PUSH = 0x40,
  POP = 0x41,
  DUP = 0x42,
  SWAP = 0x43,
  PICK = 0x44,
  ROLL = 0x45,

  // Memory operations
  LOAD = 0x50,
  STORE = 0x51,
  LOAD_CONST = 0x52,
  LOAD_GLOBAL = 0x53,
  STORE_GLOBAL = 0x54,

  // Register operations
  MOV = 0x60,
  MOV_REG = 0x61,
  MOV_MEM = 0x62,
  MOV_REG_MEM = 0x63,

  // Cognitive operations
  COGNITIVE_REASONING = 0x70,
  COGNITIVE_INFERENCE = 0x71,
  COGNITIVE_HYPOTHESIS = 0x72,
  COGNITIVE_KNOWLEDGE = 0x73,
  COGNITIVE_MEMORY = 0x74,

  // Provider operations
  PROVIDER_CALL = 0x80,
  PROVIDER_ASYNC = 0x81,
  PROVIDER_STREAM = 0x82,

  // Type operations
  CAST = 0x90,
  TYPEOF = 0x91,
  INSTANCEOF = 0x92,

  // Array operations
  NEW_ARRAY = 0xA0,
  GET_ARRAY = 0xA1,
  SET_ARRAY = 0xA2,
  ARRAY_LENGTH = 0xA3,

  // Object operations
  NEW_OBJECT = 0xB0,
  GET_PROPERTY = 0xB1,
  SET_PROPERTY = 0xB2,
  DELETE_PROPERTY = 0xB3,

  // String operations
  CONCAT = 0xC0,
  SUBSTRING = 0xC1,
  STRING_LENGTH = 0xC2,

  // Exception operations
  THROW = 0xD0,
  CATCH = 0xD1,
  FINALLY = 0xD2,

  // Debug operations
  DEBUG_BREAK = 0xE0,
  DEBUG_PRINT = 0xE1,
  DEBUG_TRACE = 0xE2,

  // Meta operations
  NOP = 0xF0,
  HALT = 0xFF,
}

export interface OpcodeInfo {
  opcode: Opcode;
  name: string;
  description: string;
  operands: number;
  stackEffect: number;
  isBranch: boolean;
  isCall: boolean;
  isReturn: boolean;
  isTerminator: boolean;
}

export class OpcodeTable {
  private static table: Map<Opcode, OpcodeInfo> = new Map();

  static {
    // Arithmetic operations
    this.table.set(Opcode.ADD, {
      opcode: Opcode.ADD,
      name: 'ADD',
      description: 'Add two values',
      operands: 0,
      stackEffect: -1,
      isBranch: false,
      isCall: false,
      isReturn: false,
      isTerminator: false,
    });

    this.table.set(Opcode.SUB, {
      opcode: Opcode.SUB,
      name: 'SUB',
      description: 'Subtract two values',
      operands: 0,
      stackEffect: -1,
      isBranch: false,
      isCall: false,
      isReturn: false,
      isTerminator: false,
    });

    this.table.set(Opcode.MUL, {
      opcode: Opcode.MUL,
      name: 'MUL',
      description: 'Multiply two values',
      operands: 0,
      stackEffect: -1,
      isBranch: false,
      isCall: false,
      isReturn: false,
      isTerminator: false,
    });

    this.table.set(Opcode.DIV, {
      opcode: Opcode.DIV,
      name: 'DIV',
      description: 'Divide two values',
      operands: 0,
      stackEffect: -1,
      isBranch: false,
      isCall: false,
      isReturn: false,
      isTerminator: false,
    });

    this.table.set(Opcode.MOD, {
      opcode: Opcode.MOD,
      name: 'MOD',
      description: 'Modulo operation',
      operands: 0,
      stackEffect: -1,
      isBranch: false,
      isCall: false,
      isReturn: false,
      isTerminator: false,
    });

    this.table.set(Opcode.NEG, {
      opcode: Opcode.NEG,
      name: 'NEG',
      description: 'Negate value',
      operands: 0,
      stackEffect: 0,
      isBranch: false,
      isCall: false,
      isReturn: false,
      isTerminator: false,
    });

    // Control flow
    this.table.set(Opcode.JMP, {
      opcode: Opcode.JMP,
      name: 'JMP',
      description: 'Unconditional jump',
      operands: 1,
      stackEffect: 0,
      isBranch: true,
      isCall: false,
      isReturn: false,
      isTerminator: true,
    });

    this.table.set(Opcode.JZ, {
      opcode: Opcode.JZ,
      name: 'JZ',
      description: 'Jump if zero',
      operands: 1,
      stackEffect: -1,
      isBranch: true,
      isCall: false,
      isReturn: false,
      isTerminator: true,
    });

    this.table.set(Opcode.JNZ, {
      opcode: Opcode.JNZ,
      name: 'JNZ',
      description: 'Jump if not zero',
      operands: 1,
      stackEffect: -1,
      isBranch: true,
      isCall: false,
      isReturn: false,
      isTerminator: true,
    });

    this.table.set(Opcode.CALL, {
      opcode: Opcode.CALL,
      name: 'CALL',
      description: 'Call function',
      operands: 1,
      stackEffect: -1,
      isBranch: true,
      isCall: true,
      isReturn: false,
      isTerminator: true,
    });

    this.table.set(Opcode.RET, {
      opcode: Opcode.RET,
      name: 'RET',
      description: 'Return from function',
      operands: 0,
      stackEffect: 1,
      isBranch: false,
      isCall: false,
      isReturn: true,
      isTerminator: true,
    });

    // Stack operations
    this.table.set(Opcode.PUSH, {
      opcode: Opcode.PUSH,
      name: 'PUSH',
      description: 'Push value onto stack',
      operands: 1,
      stackEffect: 1,
      isBranch: false,
      isCall: false,
      isReturn: false,
      isTerminator: false,
    });

    this.table.set(Opcode.POP, {
      opcode: Opcode.POP,
      name: 'POP',
      description: 'Pop value from stack',
      operands: 0,
      stackEffect: -1,
      isBranch: false,
      isCall: false,
      isReturn: false,
      isTerminator: false,
    });

    this.table.set(Opcode.DUP, {
      opcode: Opcode.DUP,
      name: 'DUP',
      description: 'Duplicate top of stack',
      operands: 0,
      stackEffect: 1,
      isBranch: false,
      isCall: false,
      isReturn: false,
      isTerminator: false,
    });

    this.table.set(Opcode.SWAP, {
      opcode: Opcode.SWAP,
      name: 'SWAP',
      description: 'Swap top two stack values',
      operands: 0,
      stackEffect: 0,
      isBranch: false,
      isCall: false,
      isReturn: false,
      isTerminator: false,
    });

    // Memory operations
    this.table.set(Opcode.LOAD, {
      opcode: Opcode.LOAD,
      name: 'LOAD',
      description: 'Load from memory',
      operands: 1,
      stackEffect: 1,
      isBranch: false,
      isCall: false,
      isReturn: false,
      isTerminator: false,
    });

    this.table.set(Opcode.STORE, {
      opcode: Opcode.STORE,
      name: 'STORE',
      description: 'Store to memory',
      operands: 1,
      stackEffect: -2,
      isBranch: false,
      isCall: false,
      isReturn: false,
      isTerminator: false,
    });

    this.table.set(Opcode.LOAD_CONST, {
      opcode: Opcode.LOAD_CONST,
      name: 'LOAD_CONST',
      description: 'Load constant',
      operands: 1,
      stackEffect: 1,
      isBranch: false,
      isCall: false,
      isReturn: false,
      isTerminator: false,
    });

    // Meta operations
    this.table.set(Opcode.NOP, {
      opcode: Opcode.NOP,
      name: 'NOP',
      description: 'No operation',
      operands: 0,
      stackEffect: 0,
      isBranch: false,
      isCall: false,
      isReturn: false,
      isTerminator: false,
    });

    this.table.set(Opcode.HALT, {
      opcode: Opcode.HALT,
      name: 'HALT',
      description: 'Halt execution',
      operands: 0,
      stackEffect: 0,
      isBranch: false,
      isCall: false,
      isReturn: false,
      isTerminator: true,
    });
  }

  /**
   * Get opcode info
   */
  public static getInfo(opcode: Opcode): OpcodeInfo | undefined {
    return this.table.get(opcode);
  }

  /**
   * Get opcode by name
   */
  public static getByName(name: string): Opcode | undefined {
    for (const [opcode, info] of this.table) {
      if (info.name === name) {
        return opcode;
      }
    }
    return undefined;
  }

  /**
   * Check if opcode is a branch
   */
  public static isBranch(opcode: Opcode): boolean {
    const info = this.table.get(opcode);
    return info ? info.isBranch : false;
  }

  /**
   * Check if opcode is a call
   */
  public static isCall(opcode: Opcode): boolean {
    const info = this.table.get(opcode);
    return info ? info.isCall : false;
  }

  /**
   * Check if opcode is a return
   */
  public static isReturn(opcode: Opcode): boolean {
    const info = this.table.get(opcode);
    return info ? info.isReturn : false;
  }

  /**
   * Check if opcode is a terminator
   */
  public static isTerminator(opcode: Opcode): boolean {
    const info = this.table.get(opcode);
    return info ? info.isTerminator : false;
  }

  /**
   * Get stack effect
   */
  public static getStackEffect(opcode: Opcode): number {
    const info = this.table.get(opcode);
    return info ? info.stackEffect : 0;
  }

  /**
   * Get all opcodes
   */
  public static getAllOpcodes(): Opcode[] {
    return Array.from(this.table.keys());
  }

  /**
   * Get all opcode names
   */
  public static getAllNames(): string[] {
    return Array.from(this.table.values()).map(info => info.name);
  }
}
