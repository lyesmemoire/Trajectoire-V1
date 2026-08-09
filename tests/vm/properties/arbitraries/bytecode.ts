import fc from 'fast-check';
import { Opcode } from '../../../../compiler/cbs/opcode-table';
import { InstructionTable, OperandType, Instruction } from '../../../../compiler/cbs/instruction-table';

// Helper to get encodings by opcode prefix or explicit list
const getEncodings = (opcodes: Opcode[]) => {
  return opcodes.map(op => InstructionTable.getEncoding(op)).filter(Boolean) as ReturnType<typeof InstructionTable.getEncoding>[];
};

const arithmeticOpcodes = [
  Opcode.ADD, Opcode.SUB, Opcode.MUL, Opcode.DIV, Opcode.MOD, Opcode.NEG,
  Opcode.AND, Opcode.OR, Opcode.XOR, Opcode.NOT, Opcode.SHL, Opcode.SHR,
  Opcode.EQ, Opcode.NE, Opcode.LT, Opcode.GT, Opcode.LE, Opcode.GE,
];

const branchOpcodes = [
  Opcode.JMP, Opcode.JZ, Opcode.JNZ, Opcode.CALL, Opcode.RET, Opcode.TAILCALL
];

const stackOpcodes = [
  Opcode.PUSH, Opcode.POP, Opcode.DUP, Opcode.SWAP, Opcode.PICK, Opcode.ROLL
];

const memoryOpcodes = [
  Opcode.LOAD, Opcode.STORE, Opcode.LOAD_CONST, Opcode.LOAD_GLOBAL, Opcode.STORE_GLOBAL,
  Opcode.NEW_ARRAY, Opcode.GET_ARRAY, Opcode.SET_ARRAY, Opcode.ARRAY_LENGTH,
  Opcode.NEW_OBJECT, Opcode.GET_PROPERTY, Opcode.SET_PROPERTY, Opcode.DELETE_PROPERTY,
  Opcode.MOV, Opcode.MOV_REG, Opcode.MOV_MEM, Opcode.MOV_REG_MEM
];

const systemOpcodes = [
  Opcode.HALT, Opcode.NOP, Opcode.THROW, Opcode.CATCH, Opcode.FINALLY,
  Opcode.DEBUG_BREAK, Opcode.DEBUG_PRINT, Opcode.DEBUG_TRACE,
  Opcode.PROVIDER_CALL, Opcode.PROVIDER_ASYNC, Opcode.PROVIDER_STREAM
];

const createInstructionArb = (encodings: any[]) => {
  if (encodings.length === 0) return fc.constant(null);
  
  return fc.constantFrom(...encodings).chain(encoding => {
    const operandArbs = encoding.operandTypes.map((type: OperandType) => {
      switch (type) {
        case OperandType.NONE:
          return fc.constant(0);
        case OperandType.IMMEDIATE_8:
          return fc.integer({ min: 0, max: 255 });
        case OperandType.IMMEDIATE_16:
          return fc.integer({ min: 0, max: 65535 });
        case OperandType.IMMEDIATE_32:
          return fc.integer({ min: 0, max: 0xFFFFFFFF });
        case OperandType.IMMEDIATE_64:
          return fc.maxSafeInteger();
        case OperandType.REGISTER:
          return fc.integer({ min: 0, max: 31 });
        case OperandType.ADDRESS:
        case OperandType.OFFSET:
          return fc.integer({ min: 0, max: 0xFFFFFFFF });
        default:
          return fc.constant(0);
      }
    });

    if (operandArbs.length === 0) {
      return fc.constant({
        opcode: encoding.opcode as Opcode,
        operands: [],
        size: encoding.size,
      });
    }

    return (fc.tuple(...operandArbs) as any).map(operands => ({
      opcode: encoding.opcode as Opcode,
      operands: operands.filter((_, i) => encoding.operandTypes[i] !== OperandType.NONE),
      size: encoding.size,
    }));
  }).filter(inst => inst !== null);
};

export const arithmeticArb = createInstructionArb(getEncodings(arithmeticOpcodes));
export const branchArb = createInstructionArb(getEncodings(branchOpcodes));
export const stackArb = createInstructionArb(getEncodings(stackOpcodes));
export const memoryArb = createInstructionArb(getEncodings(memoryOpcodes));
export const systemArb = createInstructionArb(getEncodings(systemOpcodes));

// Weighted valid instruction arbitrary
export const instructionArb = fc.oneof(
  { arbitrary: arithmeticArb, weight: 30 },
  { arbitrary: branchArb, weight: 15 },
  { arbitrary: stackArb, weight: 20 },
  { arbitrary: memoryArb, weight: 25 },
  { arbitrary: systemArb, weight: 10 }
);

// Sequence of valid instructions
export const validBytecodeArb = fc.array(instructionArb, { minLength: 1, maxLength: 100 })
  .map(instructions => {
    let totalSize = 0;
    instructions.forEach(inst => totalSize += (inst as Instruction).size);
    const buffer = new Uint8Array(totalSize);
    let offset = 0;
    for (const inst of instructions) {
      const bytes = InstructionTable.encode(inst as any);
      buffer.set(bytes, offset);
      offset += (inst as Instruction).size;
    }
    return buffer;
  });

// Arbitrary for completely random bytes (for robustness testing, 10-20% invalid rate)
export const randomBytecodeArb = fc.uint8Array({ minLength: 1, maxLength: 512 });

// Final bytecode Arbitrary ensuring 85% valid / 15% invalid bytes
export const bytecodeArb = fc.oneof(
  { arbitrary: validBytecodeArb, weight: 85 },
  { arbitrary: randomBytecodeArb, weight: 15 }
);
