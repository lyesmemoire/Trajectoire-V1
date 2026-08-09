import { describe, it, expect, beforeEach } from 'vitest';
import { InstructionExecute } from '../../../compiler/cvm/instruction-execute';
import { ExecutionContext } from '../../../compiler/cvm/execution-context';
import { DecodedInstruction } from '../../../compiler/cvm/instruction-decode';
import { Opcode } from '../../../compiler/cbs/opcode-table';

describe('InstructionExecute', () => {
  let executor: InstructionExecute;
  let context: ExecutionContext;

  beforeEach(() => {
    context = new ExecutionContext();
    executor = new InstructionExecute(context);
  });

  const createDecoded = (opcode: Opcode, operands: number[] = [], size: number = 1): DecodedInstruction => ({
    instruction: { opcode, operands, size },
    opcode,
    operands,
    isBranch: false,
    isCall: false,
    isReturn: false,
    isTerminator: false,
    stackEffect: 0,
  });

  describe('arithmetic operations', () => {
    describe('ADD', () => {
      it('should add two values', () => {
        context.getStack().push(5);
        context.getStack().push(3);
        const decoded = createDecoded(Opcode.ADD, [], 1);
        const result = executor.execute(decoded);
        expect(result.success).toBe(true);
        expect(context.getStack().peek()).toBe(8);
      });

      it('should add negative values', () => {
        context.getStack().push(-5);
        context.getStack().push(-3);
        const decoded = createDecoded(Opcode.ADD, [], 1);
        const result = executor.execute(decoded);
        expect(result.success).toBe(true);
        expect(context.getStack().peek()).toBe(-8);
      });

      it('should add zero', () => {
        context.getStack().push(5);
        context.getStack().push(0);
        const decoded = createDecoded(Opcode.ADD, [], 1);
        const result = executor.execute(decoded);
        expect(result.success).toBe(true);
        expect(context.getStack().peek()).toBe(5);
      });
    });

    describe('SUB', () => {
      it('should subtract two values', () => {
        context.getStack().push(10);
        context.getStack().push(3);
        const decoded = createDecoded(Opcode.SUB, [], 1);
        const result = executor.execute(decoded);
        expect(result.success).toBe(true);
        expect(context.getStack().peek()).toBe(7);
      });

      it('should subtract to negative', () => {
        context.getStack().push(3);
        context.getStack().push(10);
        const decoded = createDecoded(Opcode.SUB, [], 1);
        const result = executor.execute(decoded);
        expect(result.success).toBe(true);
        expect(context.getStack().peek()).toBe(-7);
      });
    });

    describe('MUL', () => {
      it('should multiply two values', () => {
        context.getStack().push(5);
        context.getStack().push(3);
        const decoded = createDecoded(Opcode.MUL, [], 1);
        const result = executor.execute(decoded);
        expect(result.success).toBe(true);
        expect(context.getStack().peek()).toBe(15);
      });

      it('should multiply by zero', () => {
        context.getStack().push(5);
        context.getStack().push(0);
        const decoded = createDecoded(Opcode.MUL, [], 1);
        const result = executor.execute(decoded);
        expect(result.success).toBe(true);
        expect(context.getStack().peek()).toBe(0);
      });

      it('should multiply negative values', () => {
        context.getStack().push(-5);
        context.getStack().push(-3);
        const decoded = createDecoded(Opcode.MUL, [], 1);
        const result = executor.execute(decoded);
        expect(result.success).toBe(true);
        expect(context.getStack().peek()).toBe(15);
      });
    });

    describe('DIV', () => {
      it('should divide two values', () => {
        context.getStack().push(10);
        context.getStack().push(2);
        const decoded = createDecoded(Opcode.DIV, [], 1);
        const result = executor.execute(decoded);
        expect(result.success).toBe(true);
        expect(context.getStack().peek()).toBe(5);
      });

      it('should floor division result', () => {
        context.getStack().push(10);
        context.getStack().push(3);
        const decoded = createDecoded(Opcode.DIV, [], 1);
        const result = executor.execute(decoded);
        expect(result.success).toBe(true);
        expect(context.getStack().peek()).toBe(3);
      });

      it('should return error on division by zero', () => {
        context.getStack().push(10);
        context.getStack().push(0);
        const decoded = createDecoded(Opcode.DIV, [], 1);
        const result = executor.execute(decoded);
        expect(result.success).toBe(false);
        expect(result.error).toBe('Division by zero');
      });

      it('should handle negative division', () => {
        context.getStack().push(-10);
        context.getStack().push(3);
        const decoded = createDecoded(Opcode.DIV, [], 1);
        const result = executor.execute(decoded);
        expect(result.success).toBe(true);
        // Math.floor(-10/3) = Math.floor(-3.33) = -4
        expect(context.getStack().peek()).toBe(-4);
      });
    });

    describe('MOD', () => {
      it('should modulo two values', () => {
        context.getStack().push(10);
        context.getStack().push(3);
        const decoded = createDecoded(Opcode.MOD, [], 1);
        const result = executor.execute(decoded);
        expect(result.success).toBe(true);
        expect(context.getStack().peek()).toBe(1);
      });

      it('should return error on modulo by zero', () => {
        context.getStack().push(10);
        context.getStack().push(0);
        const decoded = createDecoded(Opcode.MOD, [], 1);
        const result = executor.execute(decoded);
        expect(result.success).toBe(false);
        expect(result.error).toBe('Modulo by zero');
      });

      it('should handle negative modulo', () => {
        context.getStack().push(-10);
        context.getStack().push(3);
        const decoded = createDecoded(Opcode.MOD, [], 1);
        const result = executor.execute(decoded);
        expect(result.success).toBe(true);
      });
    });

    describe('NEG', () => {
      it('should negate value', () => {
        context.getStack().push(5);
        const decoded = createDecoded(Opcode.NEG, [], 1);
        const result = executor.execute(decoded);
        expect(result.success).toBe(true);
        expect(context.getStack().peek()).toBe(-5);
      });

      it('should negate negative value', () => {
        context.getStack().push(-5);
        const decoded = createDecoded(Opcode.NEG, [], 1);
        const result = executor.execute(decoded);
        expect(result.success).toBe(true);
        expect(context.getStack().peek()).toBe(5);
      });

      it('should negate zero', () => {
        context.getStack().push(0);
        const decoded = createDecoded(Opcode.NEG, [], 1);
        const result = executor.execute(decoded);
        expect(result.success).toBe(true);
        // Negating zero gives -0 in JavaScript
        const value = context.getStack().peek();
        expect(Object.is(value, -0)).toBe(true);
      });
    });
  });

  describe('bitwise operations', () => {
    describe('AND', () => {
      it('should AND two values', () => {
        context.getStack().push(0b1100);
        context.getStack().push(0b1010);
        const decoded = createDecoded(Opcode.AND, [], 1);
        const result = executor.execute(decoded);
        expect(result.success).toBe(true);
        expect(context.getStack().peek()).toBe(0b1000);
      });
    });

    describe('OR', () => {
      it('should OR two values', () => {
        context.getStack().push(0b1100);
        context.getStack().push(0b1010);
        const decoded = createDecoded(Opcode.OR, [], 1);
        const result = executor.execute(decoded);
        expect(result.success).toBe(true);
        expect(context.getStack().peek()).toBe(0b1110);
      });
    });

    describe('XOR', () => {
      it('should XOR two values', () => {
        context.getStack().push(0b1100);
        context.getStack().push(0b1010);
        const decoded = createDecoded(Opcode.XOR, [], 1);
        const result = executor.execute(decoded);
        expect(result.success).toBe(true);
        expect(context.getStack().peek()).toBe(0b0110);
      });
    });

    describe('NOT', () => {
      it('should NOT value', () => {
        context.getStack().push(0b1010);
        const decoded = createDecoded(Opcode.NOT, [], 1);
        const result = executor.execute(decoded);
        expect(result.success).toBe(true);
        expect(context.getStack().peek()).toBe(~0b1010);
      });
    });

    describe('SHL', () => {
      it('should shift left', () => {
        context.getStack().push(0b1010);
        context.getStack().push(2);
        const decoded = createDecoded(Opcode.SHL, [], 1);
        const result = executor.execute(decoded);
        expect(result.success).toBe(true);
        expect(context.getStack().peek()).toBe(0b101000);
      });
    });

    describe('SHR', () => {
      it('should shift right', () => {
        context.getStack().push(0b101000);
        context.getStack().push(2);
        const decoded = createDecoded(Opcode.SHR, [], 1);
        const result = executor.execute(decoded);
        expect(result.success).toBe(true);
        expect(context.getStack().peek()).toBe(0b1010);
      });
    });
  });

  describe('stack operations', () => {
    describe('PUSH', () => {
      it('should push value', () => {
        const decoded = createDecoded(Opcode.PUSH, [42], 2);
        const result = executor.execute(decoded);
        expect(result.success).toBe(true);
        expect(context.getStack().peek()).toBe(42);
      });

      it('should push negative value', () => {
        const decoded = createDecoded(Opcode.PUSH, [-42], 2);
        const result = executor.execute(decoded);
        expect(result.success).toBe(true);
        expect(context.getStack().peek()).toBe(-42);
      });

      it('should push zero', () => {
        const decoded = createDecoded(Opcode.PUSH, [0], 2);
        const result = executor.execute(decoded);
        expect(result.success).toBe(true);
        expect(context.getStack().peek()).toBe(0);
      });
    });

    describe('POP', () => {
      it('should pop value', () => {
        context.getStack().push(42);
        const decoded = createDecoded(Opcode.POP, [], 1);
        const result = executor.execute(decoded);
        expect(result.success).toBe(true);
        expect(context.getStack().isEmpty()).toBe(true);
      });
    });

    describe('DUP', () => {
      it('should duplicate top value', () => {
        context.getStack().push(42);
        const decoded = createDecoded(Opcode.DUP, [], 1);
        const result = executor.execute(decoded);
        expect(result.success).toBe(true);
        expect(context.getStack().getSize()).toBe(2);
        expect(context.getStack().peek()).toBe(42);
      });
    });

    describe('SWAP', () => {
      it('should swap top two values', () => {
        context.getStack().push(1);
        context.getStack().push(2);
        const decoded = createDecoded(Opcode.SWAP, [], 1);
        const result = executor.execute(decoded);
        expect(result.success).toBe(true);
        expect(context.getStack().pop()).toBe(1);
        expect(context.getStack().pop()).toBe(2);
      });
    });
  });

  describe('control flow', () => {
    describe('JMP', () => {
      it('should jump to target', () => {
        const decoded = createDecoded(Opcode.JMP, [100], 2);
        const result = executor.execute(decoded);
        expect(result.success).toBe(true);
        expect(result.branchTaken).toBe(true);
        expect(context.getProgramCounter()).toBe(100);
      });

      it('should jump to zero', () => {
        const decoded = createDecoded(Opcode.JMP, [0], 2);
        const result = executor.execute(decoded);
        expect(result.success).toBe(true);
        expect(context.getProgramCounter()).toBe(0);
      });

      it('should jump to negative address', () => {
        const decoded = createDecoded(Opcode.JMP, [-10], 2);
        const result = executor.execute(decoded);
        expect(result.success).toBe(true);
        expect(context.getProgramCounter()).toBe(-10);
      });
    });

    describe('JZ', () => {
      it('should jump when zero', () => {
        context.getStack().push(0);
        const decoded = createDecoded(Opcode.JZ, [100], 2);
        const result = executor.execute(decoded);
        expect(result.success).toBe(true);
        expect(result.branchTaken).toBe(true);
        expect(context.getProgramCounter()).toBe(100);
      });

      it('should not jump when non-zero', () => {
        context.getStack().push(1);
        const decoded = createDecoded(Opcode.JZ, [100], 2);
        const result = executor.execute(decoded);
        expect(result.success).toBe(true);
        expect(result.branchTaken).toBe(false);
      });

      it('should not jump when negative', () => {
        context.getStack().push(-1);
        const decoded = createDecoded(Opcode.JZ, [100], 2);
        const result = executor.execute(decoded);
        expect(result.success).toBe(true);
        expect(result.branchTaken).toBe(false);
      });
    });

    describe('JNZ', () => {
      it('should jump when non-zero', () => {
        context.getStack().push(1);
        const decoded = createDecoded(Opcode.JNZ, [100], 2);
        const result = executor.execute(decoded);
        expect(result.success).toBe(true);
        expect(result.branchTaken).toBe(true);
        expect(context.getProgramCounter()).toBe(100);
      });

      it('should not jump when zero', () => {
        context.getStack().push(0);
        const decoded = createDecoded(Opcode.JNZ, [100], 2);
        const result = executor.execute(decoded);
        expect(result.success).toBe(true);
        expect(result.branchTaken).toBe(false);
      });

      it('should jump when negative', () => {
        context.getStack().push(-1);
        const decoded = createDecoded(Opcode.JNZ, [100], 2);
        const result = executor.execute(decoded);
        expect(result.success).toBe(true);
        expect(result.branchTaken).toBe(true);
      });
    });

    describe('CALL', () => {
      it('should call function', () => {
        context.setProgramCounter(10);
        const decoded = createDecoded(Opcode.CALL, [100], 2);
        const result = executor.execute(decoded);
        expect(result.success).toBe(true);
        expect(context.getProgramCounter()).toBe(100);
        expect(context.getCallFrames().getFrameCount()).toBe(1);
      });

      it('should save return address', () => {
        context.setProgramCounter(10);
        const decoded = createDecoded(Opcode.CALL, [100], 2);
        executor.execute(decoded);
        const frame = context.getCallFrames().getCurrentFrame();
        expect(frame?.returnAddress).toBe(12);
      });
    });

    describe('RET', () => {
      it('should return from function', () => {
        context.getStack().push(42);
        context.getCallFrames().createFrame(100, 0, 0);
        const decoded = createDecoded(Opcode.RET, [], 1);
        const result = executor.execute(decoded);
        expect(result.success).toBe(true);
        expect(result.returnValue).toBe(42);
        expect(context.getProgramCounter()).toBe(100);
      });

      it('should return error when no frame', () => {
        context.getStack().push(42);
        const decoded = createDecoded(Opcode.RET, [], 1);
        const result = executor.execute(decoded);
        expect(result.success).toBe(false);
        expect(result.error).toBe('No frame to return from');
      });

      it('should push return value', () => {
        context.getStack().push(42);
        context.getCallFrames().createFrame(100, 0, 0);
        const decoded = createDecoded(Opcode.RET, [], 1);
        executor.execute(decoded);
        expect(context.getStack().peek()).toBe(42);
      });
    });
  });

  describe('memory operations', () => {
    describe('LOAD', () => {
      it('should load from heap', () => {
        const alloc = context.getHeap().allocate(100);
        const data = new Uint8Array([0, 0, 0, 42]);
        context.getHeap().write(alloc.address, data);
        const decoded = createDecoded(Opcode.LOAD, [alloc.address], 2);
        const result = executor.execute(decoded);
        expect(result.success).toBe(true);
        expect(context.getStack().peek()).toBe(42);
      });

      it('should handle invalid address', () => {
        const decoded = createDecoded(Opcode.LOAD, [999999], 2);
        const result = executor.execute(decoded);
        expect(result.success).toBe(false);
      });
    });

    describe('STORE', () => {
      it('should store to heap', () => {
        const alloc = context.getHeap().allocate(100);
        context.getStack().push(42);
        const decoded = createDecoded(Opcode.STORE, [alloc.address], 2);
        const result = executor.execute(decoded);
        expect(result.success).toBe(true);
        const data = context.getHeap().read(alloc.address, 4);
        expect(data[3]).toBe(42);
      });

      it('should handle invalid address', () => {
        context.getStack().push(42);
        const decoded = createDecoded(Opcode.STORE, [999999], 2);
        const result = executor.execute(decoded);
        expect(result.success).toBe(false);
      });
    });
  });

  describe('meta operations', () => {
    describe('NOP', () => {
      it('should do nothing', () => {
        const decoded = createDecoded(Opcode.NOP, [], 1);
        const result = executor.execute(decoded);
        expect(result.success).toBe(true);
      });
    });

    describe('HALT', () => {
      it('should halt execution', () => {
        const decoded = createDecoded(Opcode.HALT, [], 1);
        const result = executor.execute(decoded);
        expect(result.success).toBe(true);
        expect(context.isHalted()).toBe(true);
      });
    });
  });

  describe('unknown opcode', () => {
    it('should return error for unknown opcode', () => {
      const decoded = createDecoded(9999 as Opcode, [], 1);
      const result = executor.execute(decoded);
      expect(result.success).toBe(false);
      expect(result.error).toContain('Unknown opcode');
    });
  });

  describe('error handling', () => {
    it('should catch stack underflow errors', () => {
      const decoded = createDecoded(Opcode.ADD, [], 1);
      const result = executor.execute(decoded);
      expect(result.success).toBe(false);
      expect(result.error).toContain('Execution error');
    });

    it('should catch stack overflow errors', () => {
      const smallContext = new ExecutionContext({ stackSize: 2 });
      const smallExecutor = new InstructionExecute(smallContext);
      smallContext.getStack().push(1);
      smallContext.getStack().push(2);
      const decoded = createDecoded(Opcode.PUSH, [3], 2);
      const result = smallExecutor.execute(decoded);
      expect(result.success).toBe(false);
      expect(result.error).toContain('Execution error');
    });
  });

  describe('context management', () => {
    it('should set context', () => {
      const newContext = new ExecutionContext();
      executor.setContext(newContext);
      expect(executor.getContext()).toBe(newContext);
    });

    it('should get context', () => {
      const retrieved = executor.getContext();
      expect(retrieved).toBe(context);
    });
  });

  describe('cleanup', () => {
    it('should clean up after operations', () => {
      context.getStack().push(1);
      context.getStack().push(2);
      const decoded = createDecoded(Opcode.ADD, [], 1);
      executor.execute(decoded);
      context.reset();
      expect(context.getStack().isEmpty()).toBe(true);
      expect(context.getProgramCounter()).toBe(0);
    });
  });
});
