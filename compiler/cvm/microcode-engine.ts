/**
 * Blueprint DSL CVM Microcode Engine
 *
 * Implements microcode-level instruction execution.
 */

import { ExecutionContext } from './execution-context';
import { Opcode } from '../cbs/opcode-table';

export interface MicrocodeInstruction {
  operation: MicrocodeOperation;
  operands: number[];
}

export enum MicrocodeOperation {
  // Register operations
  LOAD_REG = 'LOAD_REG',
  STORE_REG = 'STORE_REG',
  MOVE_REG = 'MOVE_REG',

  // ALU operations
  ALU_ADD = 'ALU_ADD',
  ALU_SUB = 'ALU_SUB',
  ALU_MUL = 'ALU_MUL',
  ALU_DIV = 'ALU_DIV',
  ALU_AND = 'ALU_AND',
  ALU_OR = 'ALU_OR',
  ALU_XOR = 'ALU_XOR',
  ALU_NOT = 'ALU_NOT',
  ALU_SHL = 'ALU_SHL',
  ALU_SHR = 'ALU_SHR',

  // Memory operations
  MEM_READ = 'MEM_READ',
  MEM_WRITE = 'MEM_WRITE',

  // Stack operations
  STACK_PUSH = 'STACK_PUSH',
  STACK_POP = 'STACK_POP',

  // Control operations
  BRANCH = 'BRANCH',
  CALL = 'CALL',
  RETURN = 'RETURN',

  // Special operations
  NOP = 'NOP',
  HALT = 'HALT',
}

export class MicrocodeEngine {
  private context: ExecutionContext;
  private microcodeSequences: Map<Opcode, MicrocodeInstruction[]>;

  constructor(context: ExecutionContext) {
    this.context = context;
    this.microcodeSequences = this.initializeMicrocodeSequences();
  }

  /**
   * Initialize microcode sequences for each opcode.
   */
  private initializeMicrocodeSequences(): Map<
    Opcode,
    MicrocodeInstruction[]
  > {
    const sequences = new Map<Opcode, MicrocodeInstruction[]>();

    // Binary arithmetic:
    // temp[0] = rhs
    // temp[1] = lhs
    // temp[2] = result
    // push temp[2]
    sequences.set(Opcode.ADD, [
      { operation: MicrocodeOperation.STACK_POP, operands: [0] },
      { operation: MicrocodeOperation.STACK_POP, operands: [1] },
      { operation: MicrocodeOperation.ALU_ADD, operands: [1, 0, 2] },
      { operation: MicrocodeOperation.STACK_PUSH, operands: [2] },
    ]);

    sequences.set(Opcode.SUB, [
      { operation: MicrocodeOperation.STACK_POP, operands: [0] },
      { operation: MicrocodeOperation.STACK_POP, operands: [1] },
      { operation: MicrocodeOperation.ALU_SUB, operands: [1, 0, 2] },
      { operation: MicrocodeOperation.STACK_PUSH, operands: [2] },
    ]);

    sequences.set(Opcode.MUL, [
      { operation: MicrocodeOperation.STACK_POP, operands: [0] },
      { operation: MicrocodeOperation.STACK_POP, operands: [1] },
      { operation: MicrocodeOperation.ALU_MUL, operands: [1, 0, 2] },
      { operation: MicrocodeOperation.STACK_PUSH, operands: [2] },
    ]);

    sequences.set(Opcode.DIV, [
      { operation: MicrocodeOperation.STACK_POP, operands: [0] },
      { operation: MicrocodeOperation.STACK_POP, operands: [1] },
      { operation: MicrocodeOperation.ALU_DIV, operands: [1, 0, 2] },
      { operation: MicrocodeOperation.STACK_PUSH, operands: [2] },
    ]);

    // PUSH keeps the historical immediate-operand behavior.
    sequences.set(Opcode.PUSH, [
      { operation: MicrocodeOperation.STACK_PUSH, operands: [0] },
    ]);

    // POP discards the top stack value.
    sequences.set(Opcode.POP, [
      { operation: MicrocodeOperation.STACK_POP, operands: [] },
    ]);

    // JMP branches to instruction operand 0.
    sequences.set(Opcode.JMP, [
      { operation: MicrocodeOperation.BRANCH, operands: [0] },
    ]);

    // JZ:
    // temp[0] = condition
    // branch to instruction operand 1 when condition === 0.
    sequences.set(Opcode.JZ, [
      { operation: MicrocodeOperation.STACK_POP, operands: [0] },
      { operation: MicrocodeOperation.BRANCH, operands: [0, 1] },
    ]);

    /*
     * Preserve the established CALL compatibility contract:
     *
     * STACK_PUSH -> CALL
     *
     * execute(Opcode.CALL, [0, target])
     * therefore CALL operand 1 remains the target.
     */
    sequences.set(Opcode.CALL, [
      { operation: MicrocodeOperation.STACK_PUSH, operands: [0] },
      { operation: MicrocodeOperation.CALL, operands: [1] },
    ]);

    /*
     * Preserve the established RET compatibility contract:
     *
     * STACK_POP -> RETURN
     */
    sequences.set(Opcode.RET, [
      { operation: MicrocodeOperation.STACK_POP, operands: [0] },
      { operation: MicrocodeOperation.RETURN, operands: [0] },
    ]);

    // LOAD:
    // temp[0] = memory[instruction operand 0]
    // push temp[0]
    sequences.set(Opcode.LOAD, [
      { operation: MicrocodeOperation.MEM_READ, operands: [0, 0] },
      { operation: MicrocodeOperation.STACK_PUSH, operands: [0] },
    ]);

    // STORE:
    // temp[0] = pop()
    // memory[instruction operand 0] = temp[0]
    sequences.set(Opcode.STORE, [
      { operation: MicrocodeOperation.STACK_POP, operands: [0] },
      { operation: MicrocodeOperation.MEM_WRITE, operands: [0, 0] },
    ]);

    sequences.set(Opcode.NOP, [
      { operation: MicrocodeOperation.NOP, operands: [] },
    ]);

    sequences.set(Opcode.HALT, [
      { operation: MicrocodeOperation.HALT, operands: [] },
    ]);

    return sequences;
  }

  /**
   * Execute microcode sequence for opcode.
   */
  public execute(opcode: Opcode, operands: number[]): void {
    const sequence = this.microcodeSequences.get(opcode);

    if (!sequence) {
      throw new Error(`No microcode sequence for opcode: ${opcode}`);
    }

    const temporaries: number[] = [];

    for (const microcode of sequence) {
      this.executeMicrocode(
        microcode,
        operands,
        temporaries,
        opcode,
      );
    }
  }

  /**
   * Execute single microcode instruction.
   */
  private executeMicrocode(
    microcode: MicrocodeInstruction,
    operands: number[],
    temporaries: number[],
    opcode: Opcode,
  ): void {
    const stack = this.context.getStack();
    const heap = this.context.getHeap();

    switch (microcode.operation) {
      case MicrocodeOperation.STACK_POP: {
        const value = stack.pop();

        const destination = microcode.operands[0];

        if (destination !== undefined) {
          temporaries[destination] = value;
        }

        break;
      }

      case MicrocodeOperation.STACK_PUSH: {
        const source = microcode.operands[0];

        let value: number;

        /*
         * PUSH and CALL historically refer directly to instruction
         * operands. Generated value-flow sequences refer to temporaries.
         */
        if (opcode === Opcode.PUSH || opcode === Opcode.CALL) {
          value = operands[source] ?? 0;
        } else {
          value = temporaries[source] ?? 0;
        }

        stack.push(value);
        break;
      }

      case MicrocodeOperation.ALU_ADD: {
        const lhs = temporaries[microcode.operands[0]] ?? 0;
        const rhs = temporaries[microcode.operands[1]] ?? 0;
        const destination = microcode.operands[2];

        temporaries[destination] = lhs + rhs;
        break;
      }

      case MicrocodeOperation.ALU_SUB: {
        const lhs = temporaries[microcode.operands[0]] ?? 0;
        const rhs = temporaries[microcode.operands[1]] ?? 0;
        const destination = microcode.operands[2];

        temporaries[destination] = lhs - rhs;
        break;
      }

      case MicrocodeOperation.ALU_MUL: {
        const lhs = temporaries[microcode.operands[0]] ?? 0;
        const rhs = temporaries[microcode.operands[1]] ?? 0;
        const destination = microcode.operands[2];

        temporaries[destination] = lhs * rhs;
        break;
      }

      case MicrocodeOperation.ALU_DIV: {
        const lhs = temporaries[microcode.operands[0]] ?? 0;
        const rhs = temporaries[microcode.operands[1]] ?? 0;
        const destination = microcode.operands[2];

        temporaries[destination] =
          rhs !== 0
            ? Math.floor(lhs / rhs)
            : 0;

        break;
      }

      case MicrocodeOperation.ALU_AND: {
        const lhs = this.resolveMicrocodeValue(
          microcode.operands[0],
          temporaries,
        );
        const rhs = this.resolveMicrocodeValue(
          microcode.operands[1],
          temporaries,
        );
        const destination = microcode.operands[2];

        if (destination !== undefined) {
          temporaries[destination] = lhs & rhs;
        }

        break;
      }

      case MicrocodeOperation.ALU_OR: {
        const lhs = this.resolveMicrocodeValue(
          microcode.operands[0],
          temporaries,
        );
        const rhs = this.resolveMicrocodeValue(
          microcode.operands[1],
          temporaries,
        );
        const destination = microcode.operands[2];

        if (destination !== undefined) {
          temporaries[destination] = lhs | rhs;
        }

        break;
      }

      case MicrocodeOperation.ALU_XOR: {
        const lhs = this.resolveMicrocodeValue(
          microcode.operands[0],
          temporaries,
        );
        const rhs = this.resolveMicrocodeValue(
          microcode.operands[1],
          temporaries,
        );
        const destination = microcode.operands[2];

        if (destination !== undefined) {
          temporaries[destination] = lhs ^ rhs;
        }

        break;
      }

      case MicrocodeOperation.ALU_NOT: {
        const value = this.resolveMicrocodeValue(
          microcode.operands[0],
          temporaries,
        );
        const destination = microcode.operands[1];

        if (destination !== undefined) {
          temporaries[destination] = ~value;
        }

        break;
      }

      case MicrocodeOperation.ALU_SHL: {
        const lhs = this.resolveMicrocodeValue(
          microcode.operands[0],
          temporaries,
        );
        const rhs = this.resolveMicrocodeValue(
          microcode.operands[1],
          temporaries,
        );
        const destination = microcode.operands[2];

        if (destination !== undefined) {
          temporaries[destination] = lhs << rhs;
        }

        break;
      }

      case MicrocodeOperation.ALU_SHR: {
        const lhs = this.resolveMicrocodeValue(
          microcode.operands[0],
          temporaries,
        );
        const rhs = this.resolveMicrocodeValue(
          microcode.operands[1],
          temporaries,
        );
        const destination = microcode.operands[2];

        if (destination !== undefined) {
          temporaries[destination] = lhs >> rhs;
        }

        break;
      }

      case MicrocodeOperation.MEM_READ: {
        const addressOperandIndex = microcode.operands[0];
        const destination = microcode.operands[1];
        const address = operands[addressOperandIndex];

        if (address === undefined) {
          throw new Error(
            'MEM_READ requires a valid address operand',
          );
        }

        const data = heap.read(address, 4);

        temporaries[destination] = this.bytesToInt(data);
        break;
      }

      case MicrocodeOperation.MEM_WRITE: {
        const addressOperandIndex = microcode.operands[0];
        const valueTemporary = microcode.operands[1];
        const address = operands[addressOperandIndex];

        if (address === undefined) {
          throw new Error(
            'MEM_WRITE requires a valid address operand',
          );
        }

        const value = temporaries[valueTemporary] ?? 0;

        heap.write(
          address,
          this.intToBytes(value),
        );

        break;
      }

      case MicrocodeOperation.BRANCH: {
        if (
          opcode === Opcode.JZ &&
          microcode.operands.length > 1
        ) {
          const condition =
            temporaries[microcode.operands[0]] ?? 0;

          const target =
            operands[microcode.operands[1]];

          if (condition === 0 && target !== undefined) {
            this.context.setProgramCounter(target);
          }

          break;
        }

        const target =
          operands[microcode.operands[0]];

        if (target === undefined) {
          throw new Error(
            'BRANCH requires a valid target operand',
          );
        }

        this.context.setProgramCounter(target);
        break;
      }

      case MicrocodeOperation.CALL: {
        const target =
          operands[microcode.operands[0]];

        if (target === undefined) {
          throw new Error(
            'CALL requires a valid target operand',
          );
        }

        const returnAddress =
          this.context.getProgramCounter();

        this.context
          .getCallFrames()
          .createFrame(
            returnAddress,
            0,
            0,
          );

        this.context.setProgramCounter(target);
        break;
      }

      case MicrocodeOperation.RETURN: {
        const frame =
          this.context
            .getCallFrames()
            .popFrame();

        if (frame) {
          this.context.setProgramCounter(
            frame.returnAddress,
          );
        }

        break;
      }

      case MicrocodeOperation.NOP:
        break;

      case MicrocodeOperation.HALT:
        this.context.halt();
        break;

      default:
        throw new Error(
          `Unknown microcode operation: ${microcode.operation}`,
        );
    }
  }

  /**
   * Resolve a custom microcode ALU operand.
   *
   * Prefer a temporary value when the referenced slot exists.
   * Otherwise preserve the historical literal-operand behavior.
   */
  private resolveMicrocodeValue(
    operand: number,
    temporaries: number[],
  ): number {
    return temporaries[operand] ?? operand;
  }

  /**
   * Convert int to four big-endian bytes.
   */
  private intToBytes(value: number): Uint8Array {
    return new Uint8Array([
      (value >> 24) & 0xff,
      (value >> 16) & 0xff,
      (value >> 8) & 0xff,
      value & 0xff,
    ]);
  }

  /**
   * Convert four big-endian bytes to an unsigned 32-bit integer.
   */
  private bytesToInt(value: Uint8Array): number {
    if (value.length < 4) {
      throw new Error(
        'Expected at least 4 bytes',
      );
    }

    return (
      (
        (
          (value[0] << 24) |
          (value[1] << 16) |
          (value[2] << 8) |
          value[3]
        ) >>> 0
      )
    );
  }

  /**
   * Get microcode sequence for opcode.
   */
  public getMicrocodeSequence(
    opcode: Opcode,
  ): MicrocodeInstruction[] | null {
    const sequence =
      this.microcodeSequences.get(opcode);

    return sequence
      ? [...sequence]
      : null;
  }

  /**
   * Add custom microcode sequence.
   */
  public addMicrocodeSequence(
    opcode: Opcode,
    sequence: MicrocodeInstruction[],
  ): void {
    this.microcodeSequences.set(
      opcode,
      [...sequence],
    );
  }

  /**
   * Remove microcode sequence.
   */
  public removeMicrocodeSequence(
    opcode: Opcode,
  ): void {
    this.microcodeSequences.delete(opcode);
  }

  /**
   * Get all microcode sequences.
   */
  public getAllSequences(): Map<
    Opcode,
    MicrocodeInstruction[]
  > {
    return new Map(
      this.microcodeSequences,
    );
  }

  /**
   * Set execution context.
   */
  public setContext(
    context: ExecutionContext,
  ): void {
    this.context = context;
  }

  /**
   * Get execution context.
   */
  public getContext(): ExecutionContext {
    return this.context;
  }
}