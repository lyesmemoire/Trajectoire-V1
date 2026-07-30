/**
 * Blueprint DSL CVM Instruction Execute
 * 
 * Executes decoded instructions.
 */

import { ExecutionContext } from './execution-context';
import { DecodedInstruction } from './instruction-decode';
import { Opcode } from '../cbs/opcode-table';

export interface ExecutionResult {
  success: boolean;
  error?: string;
  branchTaken?: boolean;
  returnValue?: unknown;
}

export class InstructionExecute {
  private context: ExecutionContext;

  constructor(context: ExecutionContext) {
    this.context = context;
  }

  /**
   * Execute instruction
   */
  public execute(decoded: DecodedInstruction): ExecutionResult {
    try {
      switch (decoded.opcode) {
        // Arithmetic operations
        case Opcode.ADD:
          return this.executeAdd(decoded);
        case Opcode.SUB:
          return this.executeSub(decoded);
        case Opcode.MUL:
          return this.executeMul(decoded);
        case Opcode.DIV:
          return this.executeDiv(decoded);
        case Opcode.MOD:
          return this.executeMod(decoded);
        case Opcode.NEG:
          return this.executeNeg(decoded);

        // Bitwise operations
        case Opcode.AND:
          return this.executeAnd(decoded);
        case Opcode.OR:
          return this.executeOr(decoded);
        case Opcode.XOR:
          return this.executeXor(decoded);
        case Opcode.NOT:
          return this.executeNot(decoded);
        case Opcode.SHL:
          return this.executeShl(decoded);
        case Opcode.SHR:
          return this.executeShr(decoded);

        // Stack operations
        case Opcode.PUSH:
          return this.executePush(decoded);
        case Opcode.POP:
          return this.executePop(decoded);
        case Opcode.DUP:
          return this.executeDup(decoded);
        case Opcode.SWAP:
          return this.executeSwap(decoded);

        // Control flow
        case Opcode.JMP:
          return this.executeJmp(decoded);
        case Opcode.JZ:
          return this.executeJz(decoded);
        case Opcode.JNZ:
          return this.executeJnz(decoded);
        case Opcode.CALL:
          return this.executeCall(decoded);
        case Opcode.RET:
          return this.executeRet(decoded);

        // Memory operations
        case Opcode.LOAD:
          return this.executeLoad(decoded);
        case Opcode.STORE:
          return this.executeStore(decoded);

        // Meta operations
        case Opcode.NOP:
          return { success: true };
        case Opcode.HALT:
          this.context.halt();
          return { success: true };

        default:
          return { success: false, error: `Unknown opcode: ${decoded.opcode}` };
      }
    } catch (error) {
      return {
        success: false,
        error: `Execution error: ${error}`,
      };
    }
  }

  /**
   * Execute ADD
   */
  private executeAdd(decoded: DecodedInstruction): ExecutionResult {
    const stack = this.context.getStack();
    const b = stack.pop();
    const a = stack.pop();
    stack.push(a + b);
    return { success: true };
  }

  /**
   * Execute SUB
   */
  private executeSub(decoded: DecodedInstruction): ExecutionResult {
    const stack = this.context.getStack();
    const b = stack.pop();
    const a = stack.pop();
    stack.push(a - b);
    return { success: true };
  }

  /**
   * Execute MUL
   */
  private executeMul(decoded: DecodedInstruction): ExecutionResult {
    const stack = this.context.getStack();
    const b = stack.pop();
    const a = stack.pop();
    stack.push(a * b);
    return { success: true };
  }

  /**
   * Execute DIV
   */
  private executeDiv(decoded: DecodedInstruction): ExecutionResult {
    const stack = this.context.getStack();
    const b = stack.pop();
    const a = stack.pop();

    if (b === 0) {
      return { success: false, error: 'Division by zero' };
    }

    stack.push(Math.floor(a / b));
    return { success: true };
  }

  /**
   * Execute MOD
   */
  private executeMod(decoded: DecodedInstruction): ExecutionResult {
    const stack = this.context.getStack();
    const b = stack.pop();
    const a = stack.pop();

    if (b === 0) {
      return { success: false, error: 'Modulo by zero' };
    }

    stack.push(a % b);
    return { success: true };
  }

  /**
   * Execute NEG
   */
  private executeNeg(decoded: DecodedInstruction): ExecutionResult {
    const stack = this.context.getStack();
    const a = stack.pop();
    stack.push(-a);
    return { success: true };
  }

  /**
   * Execute AND
   */
  private executeAnd(decoded: DecodedInstruction): ExecutionResult {
    const stack = this.context.getStack();
    const b = stack.pop();
    const a = stack.pop();
    stack.push(a & b);
    return { success: true };
  }

  /**
   * Execute OR
   */
  private executeOr(decoded: DecodedInstruction): ExecutionResult {
    const stack = this.context.getStack();
    const b = stack.pop();
    const a = stack.pop();
    stack.push(a | b);
    return { success: true };
  }

  /**
   * Execute XOR
   */
  private executeXor(decoded: DecodedInstruction): ExecutionResult {
    const stack = this.context.getStack();
    const b = stack.pop();
    const a = stack.pop();
    stack.push(a ^ b);
    return { success: true };
  }

  /**
   * Execute NOT
   */
  private executeNot(decoded: DecodedInstruction): ExecutionResult {
    const stack = this.context.getStack();
    const a = stack.pop();
    stack.push(~a);
    return { success: true };
  }

  /**
   * Execute SHL
   */
  private executeShl(decoded: DecodedInstruction): ExecutionResult {
    const stack = this.context.getStack();
    const b = stack.pop();
    const a = stack.pop();
    stack.push(a << b);
    return { success: true };
  }

  /**
   * Execute SHR
   */
  private executeShr(decoded: DecodedInstruction): ExecutionResult {
    const stack = this.context.getStack();
    const b = stack.pop();
    const a = stack.pop();
    stack.push(a >> b);
    return { success: true };
  }

  /**
   * Execute PUSH
   */
  private executePush(decoded: DecodedInstruction): ExecutionResult {
    const stack = this.context.getStack();
    const value = decoded.operands[0];
    stack.push(value);
    return { success: true };
  }

  /**
   * Execute POP
   */
  private executePop(decoded: DecodedInstruction): ExecutionResult {
    const stack = this.context.getStack();
    stack.pop();
    return { success: true };
  }

  /**
   * Execute DUP
   */
  private executeDup(decoded: DecodedInstruction): ExecutionResult {
    const stack = this.context.getStack();
    stack.dup();
    return { success: true };
  }

  /**
   * Execute SWAP
   */
  private executeSwap(decoded: DecodedInstruction): ExecutionResult {
    const stack = this.context.getStack();
    stack.swap();
    return { success: true };
  }

  /**
   * Execute JMP
   */
  private executeJmp(decoded: DecodedInstruction): ExecutionResult {
    const target = decoded.operands[0];
    this.context.setProgramCounter(target);
    return { success: true, branchTaken: true };
  }

  /**
   * Execute JZ
   */
  private executeJz(decoded: DecodedInstruction): ExecutionResult {
    const stack = this.context.getStack();
    const value = stack.pop();
    const target = decoded.operands[0];

    if (value === 0) {
      this.context.setProgramCounter(target);
      return { success: true, branchTaken: true };
    }

    return { success: true, branchTaken: false };
  }

  /**
   * Execute JNZ
   */
  private executeJnz(decoded: DecodedInstruction): ExecutionResult {
    const stack = this.context.getStack();
    const value = stack.pop();
    const target = decoded.operands[0];

    if (value !== 0) {
      this.context.setProgramCounter(target);
      return { success: true, branchTaken: true };
    }

    return { success: true, branchTaken: false };
  }

  /**
   * Execute CALL
   */
  private executeCall(decoded: DecodedInstruction): ExecutionResult {
    const target = decoded.operands[0];
    const returnAddress = this.context.getProgramCounter() + decoded.instruction.size;

    const callFrames = this.context.getCallFrames();
    const frame = callFrames.createFrame(returnAddress, 0, 0);

    this.context.setProgramCounter(target);
    return { success: true };
  }

  /**
   * Execute RET
   */
  private executeRet(decoded: DecodedInstruction): ExecutionResult {
    const stack = this.context.getStack();
    const returnValue = stack.pop();

    const callFrames = this.context.getCallFrames();
    const frame = callFrames.popFrame();

    if (!frame) {
      return { success: false, error: 'No frame to return from' };
    }

    this.context.setProgramCounter(frame.returnAddress);
    stack.push(returnValue);

    return { success: true, returnValue };
  }

  /**
   * Execute LOAD
   */
  private executeLoad(decoded: DecodedInstruction): ExecutionResult {
    const address = decoded.operands[0];
    const heap = this.context.getHeap();
    const data = heap.read(address, 4);
    
    const stack = this.context.getStack();
    const value = this.bytesToInt(data);
    stack.push(value);

    return { success: true };
  }

  /**
   * Execute STORE
   */
  private executeStore(decoded: DecodedInstruction): ExecutionResult {
    const stack = this.context.getStack();
    const value = stack.pop();
    const address = decoded.operands[0];

    const heap = this.context.getHeap();
    const data = this.intToBytes(value);
    heap.write(address, data);

    return { success: true };
  }

  /**
   * Convert bytes to int
   */
  private bytesToInt(bytes: Uint8Array): number {
    return (bytes[0] << 24) | (bytes[1] << 16) | (bytes[2] << 8) | bytes[3];
  }

  /**
   * Convert int to bytes
   */
  private intToBytes(value: number): Uint8Array {
    return new Uint8Array([
      (value >> 24) & 0xFF,
      (value >> 16) & 0xFF,
      (value >> 8) & 0xFF,
      value & 0xFF,
    ]);
  }

  /**
   * Set execution context
   */
  public setContext(context: ExecutionContext): void {
    this.context = context;
  }

  /**
   * Get execution context
   */
  public getContext(): ExecutionContext {
    return this.context;
  }
}
