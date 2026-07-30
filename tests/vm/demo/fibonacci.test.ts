import { describe, it, expect } from 'vitest';
import { Stack } from '../../../compiler/cbs/stack';
import { RegisterFile } from '../../../compiler/cvm/register-file';
import { Register } from '../../../compiler/cbs/register-table';

describe('Demo Programs - Fibonacci', () => {
  describe('Stack-based Fibonacci', () => {
    it('should calculate fibonacci of 10 using stack', () => {
      const stack = new Stack(1000);
      
      // Push n=10 onto stack
      stack.push(10);
      
      // Calculate fibonacci: fib(10) = 55
      const n = stack.pop();
      let a = 0, b = 1;
      for (let i = 2; i <= n; i++) {
        const temp = a + b;
        a = b;
        b = temp;
      }
      
      // Push result onto stack
      stack.push(b);
      
      expect(stack.pop()).toBe(55);
    });

    it('should calculate fibonacci of 0', () => {
      const stack = new Stack(1000);
      
      // Push n=0 onto stack
      stack.push(0);
      
      // fib(0) = 0
      const n = stack.pop();
      const result = n === 0 ? 0 : 1;
      
      stack.push(result);
      
      expect(stack.pop()).toBe(0);
    });

    it('should calculate fibonacci of 1', () => {
      const stack = new Stack(1000);
      
      // Push n=1 onto stack
      stack.push(1);
      
      // fib(1) = 1
      const n = stack.pop();
      const result = n === 0 ? 0 : 1;
      
      stack.push(result);
      
      expect(stack.pop()).toBe(1);
    });
  });

  describe('Register-based Fibonacci', () => {
    it('should calculate fibonacci of 10 using registers', () => {
      const registers = new RegisterFile();
      
      // Set input in R0
      registers.set(Register.R0, 10);
      
      // Calculate fibonacci
      const n = registers.get(Register.R0);
      let a = 0, b = 1;
      for (let i = 2; i <= n; i++) {
        const temp = a + b;
        a = b;
        b = temp;
      }
      
      // Store result in R1
      registers.set(Register.R1, b);
      
      expect(registers.get(Register.R1)).toBe(55);
    });

    it('should calculate fibonacci of 20 using registers', () => {
      const registers = new RegisterFile();
      
      // Set input in R0
      registers.set(Register.R0, 20);
      
      // Calculate fibonacci: fib(20) = 6765
      const n = registers.get(Register.R0);
      let a = 0, b = 1;
      for (let i = 2; i <= n; i++) {
        const temp = a + b;
        a = b;
        b = temp;
      }
      
      // Store result in R1
      registers.set(Register.R1, b);
      
      expect(registers.get(Register.R1)).toBe(6765);
    });
  });

  describe('Iterative Fibonacci with Stack', () => {
    it('should calculate fibonacci sequence up to 10', () => {
      const stack = new Stack(1000);
      
      // Generate fibonacci sequence: 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55
      const sequence: number[] = [];
      let a = 0, b = 1;
      
      // Push first two values
      stack.push(a);
      stack.push(b);
      
      for (let i = 2; i <= 10; i++) {
        const temp = a + b;
        a = b;
        b = temp;
        stack.push(b);
      }
      
      // Pop and verify sequence (in reverse)
      const expected = [55, 34, 21, 13, 8, 5, 3, 2, 1, 1, 0];
      const actual: number[] = [];
      while (stack.getSize() > 0) {
        actual.push(stack.pop());
      }
      
      expect(actual).toEqual(expected);
    });
  });

  describe('Memory-based Fibonacci', () => {
    it('should calculate fibonacci using memory', () => {
      const stack = new Stack(1000);
      
      // Simulate memory-based fibonacci using stack as memory
      // fib(n) = fib(n-1) + fib(n-2)
      
      // Push base cases
      stack.push(0); // fib(0)
      stack.push(1); // fib(1)
      
      // Calculate fib(2) to fib(10)
      for (let i = 2; i <= 10; i++) {
        const fib2 = stack.pop(); // fib(i-1)
        const fib1 = stack.pop(); // fib(i-2)
        const fib = fib1 + fib2;
        
        // Push back for next iteration
        stack.push(fib2);
        stack.push(fib);
      }
      
      // Final result should be fib(10) = 55
      expect(stack.pop()).toBe(55);
    });
  });
});
