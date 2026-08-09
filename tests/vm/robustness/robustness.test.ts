import { describe, it, expect } from 'vitest';
import { ExecutionContext } from '../../../compiler/cvm/execution-context';
import { Stack } from '../../../compiler/cbs/stack';
import { Heap } from '../../../compiler/cbs/heap';
import { RegisterFile } from '../../../compiler/cvm/register-file';
import { Register } from '../../../compiler/cbs/register-table';

describe('VM Robustness Tests', () => {
  describe('Large Instruction Execution', () => {
    it('should handle 1000 stack operations', () => {
      const stack = new Stack(10000);
      
      // Push 1000 values
      for (let i = 0; i < 1000; i++) {
        stack.push(i);
      }
      
      expect(stack.getSize()).toBe(1000);
      
      // Pop all values
      let sum = 0;
      for (let i = 0; i < 1000; i++) {
        sum += stack.pop();
      }
      
      expect(stack.getSize()).toBe(0);
      // Sum of 0-999 = 999*1000/2 = 499500
      expect(sum).toBe(499500);
    });

    it('should handle 10000 stack operations', () => {
      const stack = new Stack(20000);
      
      // Push 10000 values
      for (let i = 0; i < 10000; i++) {
        stack.push(i);
      }
      
      expect(stack.getSize()).toBe(10000);
      
      // Pop all values
      let sum = 0;
      for (let i = 0; i < 10000; i++) {
        sum += stack.pop();
      }
      
      expect(stack.getSize()).toBe(0);
      // Sum of 0-9999 = 9999*10000/2 = 49995000
      expect(sum).toBe(49995000);
    });

    it('should handle 1000 register operations', () => {
      const registers = new RegisterFile();
      
      // Perform 1000 register operations
      for (let i = 0; i < 1000; i++) {
        registers.set(Register.R0, i);
        const value = registers.get(Register.R0);
        expect(value).toBe(i);
      }
    });

    it('should handle 10000 register operations', () => {
      const registers = new RegisterFile();
      
      // Perform 10000 register operations
      for (let i = 0; i < 10000; i++) {
        registers.set(Register.R0, i);
        const value = registers.get(Register.R0);
        expect(value).toBe(i);
      }
    });
  });

  describe('Memory Saturation', () => {
    it('should handle many small allocations', () => {
      const heap = new Heap();
      heap.setMaxBlocks(1000);
      
      const addresses: number[] = [];
      
      // Allocate 100 small blocks
      for (let i = 0; i < 100; i++) {
        const allocation = heap.allocate(10);
        addresses.push(allocation.address);
      }
      
      // Free all blocks
      for (const address of addresses) {
        heap.free(address);
      }
      
      // Verify heap is clean
      const validation = heap.validate();
      expect(validation.valid).toBe(true);
    });

    it('should handle memory near capacity', () => {
      const heap = new Heap();
      heap.setMaxBlocks(200);
      
      const addresses: number[] = [];
      
      // Allocate many blocks near capacity
      for (let i = 0; i < 150; i++) {
        const allocation = heap.allocate(10);
        addresses.push(allocation.address);
      }
      
      // Verify all allocations succeeded
      expect(addresses.length).toBe(150);
      
      // Free all blocks
      for (const address of addresses) {
        heap.free(address);
      }
    });

    it('should handle allocation and deallocation cycles', () => {
      const heap = new Heap();
      heap.setMaxBlocks(500);
      
      // Perform allocation/deallocation cycles
      for (let cycle = 0; cycle < 10; cycle++) {
        const addresses: number[] = [];
        
        // Allocate 10 blocks
        for (let i = 0; i < 10; i++) {
          const allocation = heap.allocate(5);
          addresses.push(allocation.address);
        }
        
        // Free half of them
        for (let i = 0; i < 5; i++) {
          heap.free(addresses[i]);
        }
        
        // Allocate 5 more
        for (let i = 0; i < 5; i++) {
          const allocation = heap.allocate(5);
          addresses.push(allocation.address);
        }
        
        // Free remaining (only those still allocated)
        for (let i = 5; i < addresses.length; i++) {
          heap.free(addresses[i]);
        }
      }
      
      // Test completed successfully if no errors were thrown
      expect(true).toBe(true);
    });
  });

  describe('Stack Overflow/Underflow Protection', () => {
    it('should detect stack overflow', () => {
      const stack = new Stack(100);
      
      // Try to push more than capacity
      expect(() => {
        for (let i = 0; i < 200; i++) {
          stack.push(i);
        }
      }).toThrow('Stack overflow');
    });

    it('should detect stack underflow', () => {
      const stack = new Stack(100);
      
      stack.push(1);
      stack.pop();
      
      // Try to pop from empty stack
      expect(() => {
        stack.pop();
      }).toThrow('Stack underflow');
    });

    it('should recover from near overflow', () => {
      const stack = new Stack(100);
      
      // Fill stack to near capacity
      for (let i = 0; i < 95; i++) {
        stack.push(i);
      }
      
      expect(stack.getSize()).toBe(95);
      
      // Pop some values
      for (let i = 0; i < 50; i++) {
        stack.pop();
      }
      
      expect(stack.getSize()).toBe(45);
      
      // Push more values
      for (let i = 0; i < 40; i++) {
        stack.push(i);
      }
      
      expect(stack.getSize()).toBe(85);
    });
  });

  describe('Long-Running Execution', () => {
    it('should handle sustained operations', () => {
      const stack = new Stack(10000);
      const registers = new RegisterFile();
      
      // Perform mixed operations for extended period
      for (let i = 0; i < 5000; i++) {
        stack.push(i);
        registers.set(Register.R0, i);
        
        if (i % 100 === 0) {
          // Periodically pop
          stack.pop();
        }
      }
      
      expect(stack.getSize()).toBeGreaterThan(0);
      expect(registers.get(Register.R0)).toBe(4999);
    });

    it('should maintain consistency after many operations', () => {
      const context = new ExecutionContext();
      const stack = context.getStack();
      
      // Perform many operations
      for (let i = 0; i < 1000; i++) {
        stack.push(i);
        context.setRegister(Register.R0, i);
        
        if (i % 10 === 0) {
          stack.pop();
        }
      }
      
      // Verify context is still valid
      const validation = context.validate();
      expect(validation.valid).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle alternating push/pop', () => {
      const stack = new Stack(1000);
      
      // Alternate push and pop
      for (let i = 0; i < 1000; i++) {
        stack.push(i);
        stack.pop();
      }
      
      expect(stack.getSize()).toBe(0);
    });

    it('should handle rapid allocation/deallocation', () => {
      const heap = new Heap();
      heap.setMaxBlocks(1000);
      
      // Rapid allocation and deallocation
      for (let i = 0; i < 50; i++) {
        const allocation = heap.allocate(1);
        heap.free(allocation.address);
      }
      
      // Test completed successfully if no errors were thrown
      expect(true).toBe(true);
    });

    it('should handle zero-size operations', () => {
      const stack = new Stack(1000);
      
      // Push and pop immediately
      stack.push(0);
      stack.pop();
      
      expect(stack.getSize()).toBe(0);
    });
  });
});
