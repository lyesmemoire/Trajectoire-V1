import { describe, it, expect, beforeEach } from 'vitest';
import { ExecutionContext } from '../../../compiler/cvm/execution-context';
import { Stack } from '../../../compiler/cbs/stack';
import { Heap } from '../../../compiler/cbs/heap';
import { RegisterFile } from '../../../compiler/cvm/register-file';
import { Opcode } from '../../../compiler/cbs/opcode-table';
import { Register } from '../../../compiler/cbs/register-table';

describe('Demo Programs - Hello World', () => {
  describe('Stack-based Hello World', () => {
    it('should demonstrate stack operations for Hello World', () => {
      const stack = new Stack(1000);
      
      // Push characters of "Hello" onto stack
      stack.push(72);   // 'H'
      stack.push(101);  // 'e'
      stack.push(108);  // 'l'
      stack.push(108);  // 'l'
      stack.push(111);  // 'o'
      
      // Pop and verify (LIFO order)
      expect(stack.pop()).toBe(111);
      expect(stack.pop()).toBe(108);
      expect(stack.pop()).toBe(108);
      expect(stack.pop()).toBe(101);
      expect(stack.pop()).toBe(72);
      
      expect(stack.getSize()).toBe(0);
    });
  });

  describe('Memory-based Hello World', () => {
    it('should demonstrate memory operations for Hello World', () => {
      const heap = new Heap();
      heap.setMaxBlocks(1000);
      
      // Allocate memory for "Hello"
      const allocation = heap.allocate(5);
      const address = allocation.address;
      
      // Write characters to memory
      const data = new Uint8Array([72, 101, 108, 108, 111]);
      heap.write(address, data);
      
      // Read back and verify
      const readData = heap.read(address, 5);
      expect(readData[0]).toBe(72);
      expect(readData[1]).toBe(101);
      expect(readData[2]).toBe(108);
      expect(readData[3]).toBe(108);
      expect(readData[4]).toBe(111);
      
      // Clean up
      heap.free(address);
    });
  });

  describe('Register-based Hello World', () => {
    it('should demonstrate register operations for Hello World', () => {
      const registers = new RegisterFile();
      
      // Store characters in registers
      registers.set(Register.R0, 72);   // 'H'
      registers.set(Register.R1, 101);  // 'e'
      registers.set(Register.R2, 108);  // 'l'
      registers.set(Register.R3, 108);  // 'l'
      registers.set(Register.R4, 111);  // 'o'
      
      // Verify
      expect(registers.get(Register.R0)).toBe(72);
      expect(registers.get(Register.R1)).toBe(101);
      expect(registers.get(Register.R2)).toBe(108);
      expect(registers.get(Register.R3)).toBe(108);
      expect(registers.get(Register.R4)).toBe(111);
    });
  });

  describe('Integrated VM Hello World', () => {
    it('should demonstrate VM context for Hello World', () => {
      const context = new ExecutionContext();
      
      // Use stack to push characters
      const stack = context.getStack();
      stack.push(72);
      stack.push(101);
      stack.push(108);
      stack.push(108);
      stack.push(111);
      
      // Use registers to store count
      context.setRegister(Register.R0, 5); // 5 characters
      
      // Verify
      expect(context.getRegister(Register.R0)).toBe(5);
      expect(stack.getSize()).toBe(5);
      
      // Clean up
      stack.clear();
      expect(stack.getSize()).toBe(0);
    });
  });
});
