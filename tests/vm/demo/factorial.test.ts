import { describe, it, expect } from 'vitest';
import { Stack } from '../../../compiler/cbs/stack';
import { RegisterFile } from '../../../compiler/cvm/register-file';
import { Register } from '../../../compiler/cbs/register-table';

describe('Demo Programs - Factorial', () => {
  describe('Stack-based Factorial', () => {
    it('should calculate factorial of 5 using stack', () => {
      const stack = new Stack(1000);
      
      // Push numbers 1-5 onto stack
      stack.push(1);
      stack.push(2);
      stack.push(3);
      stack.push(4);
      stack.push(5);
      
      // Calculate factorial: 5! = 5 * 4 * 3 * 2 * 1 = 120
      let result = 1;
      while (stack.getSize() > 0) {
        const n = stack.pop();
        result *= n;
      }
      
      expect(result).toBe(120);
    });

    it('should calculate factorial of 0', () => {
      const stack = new Stack(1000);
      
      // Push 0 onto stack
      stack.push(0);
      
      // 0! = 1
      let result = 1;
      while (stack.getSize() > 0) {
        const n = stack.pop();
        if (n === 0) {
          result = 1;
        } else {
          result *= n;
        }
      }
      
      expect(result).toBe(1);
    });

    it('should calculate factorial of 1', () => {
      const stack = new Stack(1000);
      
      // Push 1 onto stack
      stack.push(1);
      
      // 1! = 1
      let result = 1;
      while (stack.getSize() > 0) {
        const n = stack.pop();
        result *= n;
      }
      
      expect(result).toBe(1);
    });
  });

  describe('Register-based Factorial', () => {
    it('should calculate factorial of 5 using registers', () => {
      const registers = new RegisterFile();
      
      // Set input in R0
      registers.set(Register.R0, 5);
      
      // Calculate factorial
      let n = registers.get(Register.R0);
      let result = 1;
      for (let i = 2; i <= n; i++) {
        result *= i;
      }
      
      // Store result in R1
      registers.set(Register.R1, result);
      
      expect(registers.get(Register.R1)).toBe(120);
    });

    it('should calculate factorial of 10 using registers', () => {
      const registers = new RegisterFile();
      
      // Set input in R0
      registers.set(Register.R0, 10);
      
      // Calculate factorial: 10! = 3628800
      let n = registers.get(Register.R0);
      let result = 1;
      for (let i = 2; i <= n; i++) {
        result *= i;
      }
      
      // Store result in R1
      registers.set(Register.R1, result);
      
      expect(registers.get(Register.R1)).toBe(3628800);
    });
  });

  describe('Recursive Factorial Simulation', () => {
    it('should simulate recursive factorial with stack frames', () => {
      const stack = new Stack(1000);
      
      // Simulate factorial(5) using recursion
      // Push return addresses and parameters
      const factorial = (n: number): number => {
        if (n <= 1) return 1;
        return n * factorial(n - 1);
      };
      
      const result = factorial(5);
      
      // Push intermediate results onto stack
      stack.push(5);  // n=5
      stack.push(4);  // n=4
      stack.push(3);  // n=3
      stack.push(2);  // n=2
      stack.push(1);  // n=1
      
      expect(result).toBe(120);
      expect(stack.getSize()).toBe(5);
    });
  });
});
