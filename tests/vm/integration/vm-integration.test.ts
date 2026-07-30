import { describe, it, expect, beforeEach } from 'vitest';
import { ExecutionContext } from '../../../compiler/cvm/execution-context';
import { InstructionFetch } from '../../../compiler/cvm/instruction-fetch';
import { InstructionDecode } from '../../../compiler/cvm/instruction-decode';
import { InstructionExecute } from '../../../compiler/cvm/instruction-execute';
import { Opcode } from '../../../compiler/cbs/opcode-table';
import { Instruction } from '../../../compiler/cbs/instruction-table';

describe('VM Integration Tests', () => {
  let context: ExecutionContext;
  let decode: InstructionDecode;
  let execute: InstructionExecute;

  beforeEach(() => {
    context = new ExecutionContext();
    decode = new InstructionDecode(context);
    execute = new InstructionExecute(context);
  });

  describe('Decode-Execute Integration', () => {
    it('should integrate decode and execute for simple arithmetic', () => {
      // Create instruction: ADD (stack-based)
      const instruction: Instruction = { opcode: Opcode.ADD, operands: [], size: 1 };
      
      // Push operands onto stack
      const stack = context.getStack();
      stack.push(5);
      stack.push(3);
      
      // Decode
      const decoded = decode.decode(instruction);
      
      // Execute
      const result = execute.execute(decoded);
      expect(result.success).toBe(true);
      
      // Verify result: 5 + 3 = 8
      const stackResult = stack.pop();
      expect(stackResult).toBe(8);
    });

    it('should integrate decode and execute for multiplication', () => {
      // Create instruction: MUL
      const instruction: Instruction = { opcode: Opcode.MUL, operands: [], size: 1 };
      
      // Push operands onto stack
      const stack = context.getStack();
      stack.push(4);
      stack.push(7);
      
      // Decode and execute
      const decoded = decode.decode(instruction);
      const result = execute.execute(decoded);
      expect(result.success).toBe(true);
      
      // Verify result: 4 * 7 = 28
      const stackResult = stack.pop();
      expect(stackResult).toBe(28);
    });
  });

  describe('Context Integration', () => {
    it('should maintain context state across operations', () => {
      const stack = context.getStack();
      
      // Execute sequence: 1 + 2 + 3 = 6
      stack.push(1);
      stack.push(2);
      
      const add1: Instruction = { opcode: Opcode.ADD, operands: [], size: 1 };
      execute.execute(decode.decode(add1));
      
      stack.push(3);
      
      const add2: Instruction = { opcode: Opcode.ADD, operands: [], size: 1 };
      execute.execute(decode.decode(add2));
      
      // Verify context is valid
      const validation = context.validate();
      expect(validation.valid).toBe(true);
      
      // Verify result
      const result = stack.pop();
      expect(result).toBe(6);
    });

    it('should handle register operations in context', () => {
      // Use registers to store intermediate values
      context.setRegister('R0', 10);
      context.setRegister('R1', 20);
      
      // Verify registers are accessible
      expect(context.getRegister('R0')).toBe(10);
      expect(context.getRegister('R1')).toBe(20);
      
      // Verify context is valid
      const validation = context.validate();
      expect(validation.valid).toBe(true);
    });
  });

  describe('Error Handling Integration', () => {
    it('should handle division by zero gracefully', () => {
      const stack = context.getStack();
      stack.push(10);
      stack.push(0);
      
      const div: Instruction = { opcode: Opcode.DIV, operands: [], size: 1 };
      const decoded = decode.decode(div);
      const result = execute.execute(decoded);
      
      // Error expected for division by zero
      expect(result.success).toBe(false);
      expect(result.error).toContain('Division by zero');
    });
  });

  describe('Multiple Instruction Sequences', () => {
    it('should execute complex instruction sequence', () => {
      // Calculate: (5 + 3) * 2 = 16
      const stack = context.getStack();
      
      stack.push(5);
      stack.push(3);
      
      const add: Instruction = { opcode: Opcode.ADD, operands: [], size: 1 };
      execute.execute(decode.decode(add));
      
      stack.push(2);
      
      const mul: Instruction = { opcode: Opcode.MUL, operands: [], size: 1 };
      execute.execute(decode.decode(mul));
      
      const result = stack.pop();
      expect(result).toBe(16);
    });
  });

  describe('Stack and Register Integration', () => {
    it('should use both stack and registers in sequence', () => {
      const stack = context.getStack();
      
      // Store value in register
      context.setRegister('R0', 100);
      
      // Use stack for computation
      stack.push(context.getRegister('R0'));
      stack.push(50);
      
      const sub: Instruction = { opcode: Opcode.SUB, operands: [], size: 1 };
      execute.execute(decode.decode(sub));
      
      const result = stack.pop();
      expect(result).toBe(50);
    });
  });
});
