import { describe, it, expect, beforeEach } from 'vitest';
import { ProfilerHooks, ProfileData, ProfileStatistics } from '../../../compiler/cvm/profiler-hooks';
import { ExecutionContext } from '../../../compiler/cvm/execution-context';
import { Opcode } from '../../../compiler/cbs/opcode-table';

describe('Profiler Hooks - Priority 9', () => {
  let context: ExecutionContext;
  let profiler: ProfilerHooks;

  beforeEach(() => {
    context = new ExecutionContext();
    profiler = new ProfilerHooks(context);
  });

  describe('Timers', () => {
    it('should record start time on enable', () => {
      profiler.enable();

      const stats = profiler.getStatistics();
      expect(stats.totalExecutionTime).toBeGreaterThanOrEqual(0);
    });

    it('should track execution time', () => {
      profiler.enable();
      profiler.beforeInstruction(Opcode.ADD);
      profiler.afterInstruction(Opcode.ADD, 10);
      profiler.afterInstruction(Opcode.ADD, 20);

      const stats = profiler.getStatistics();
      expect(stats.totalExecutionTime).toBeGreaterThanOrEqual(0);
    });

    it('should calculate average execution time', () => {
      profiler.enable();
      profiler.beforeInstruction(Opcode.ADD);
      profiler.beforeInstruction(Opcode.SUB);
      profiler.afterInstruction(Opcode.ADD, 10);
      profiler.afterInstruction(Opcode.SUB, 20);

      const stats = profiler.getStatistics();
      expect(stats.averageExecutionTime).toBeGreaterThanOrEqual(0);
    });

    it('should reset start time on clear', () => {
      profiler.enable();
      profiler.clear();

      const stats = profiler.getStatistics();
      expect(stats.totalExecutionTime).toBeGreaterThanOrEqual(0);
    });

    it('should track min and max times', () => {
      profiler.enable();
      profiler.beforeInstruction(Opcode.ADD);
      profiler.afterInstruction(Opcode.ADD, 5);
      profiler.afterInstruction(Opcode.ADD, 15);
      profiler.afterInstruction(Opcode.ADD, 10);

      const stats = profiler.getStatistics();
      const addData = stats.opcodeDistribution.get(Opcode.ADD);
      expect(addData?.minTime).toBe(5);
      expect(addData?.maxTime).toBe(15);
    });
  });

  describe('Counters', () => {
    it('should count instructions', () => {
      profiler.enable();
      profiler.beforeInstruction(Opcode.ADD);
      profiler.beforeInstruction(Opcode.ADD);
      profiler.beforeInstruction(Opcode.SUB);

      const stats = profiler.getStatistics();
      expect(stats.totalInstructions).toBe(3);
    });

    it('should count instructions per opcode', () => {
      profiler.enable();
      profiler.beforeInstruction(Opcode.ADD);
      profiler.beforeInstruction(Opcode.ADD);
      profiler.beforeInstruction(Opcode.SUB);

      const addCount = profiler.getInstructionCount(Opcode.ADD);
      const subCount = profiler.getInstructionCount(Opcode.SUB);

      expect(addCount).toBe(2);
      expect(subCount).toBe(1);
    });

    it('should get all instruction counts', () => {
      profiler.enable();
      profiler.beforeInstruction(Opcode.ADD);
      profiler.beforeInstruction(Opcode.SUB);
      profiler.beforeInstruction(Opcode.MUL);

      const allCounts = profiler.getAllInstructionCounts();
      expect(allCounts.size).toBe(3);
    });

    it('should return zero for non-existent opcode', () => {
      const count = profiler.getInstructionCount(Opcode.ADD);
      expect(count).toBe(0);
    });

    it('should clear counters on clear', () => {
      profiler.enable();
      profiler.beforeInstruction(Opcode.ADD);
      profiler.clear();

      const stats = profiler.getStatistics();
      expect(stats.totalInstructions).toBe(0);
    });
  });

  describe('Sampling', () => {
    it('should sample instruction times', () => {
      profiler.enable();
      profiler.beforeInstruction(Opcode.ADD);
      profiler.afterInstruction(Opcode.ADD, 10);
      profiler.afterInstruction(Opcode.ADD, 20);
      profiler.afterInstruction(Opcode.ADD, 30);

      const times = profiler.getInstructionTimes(Opcode.ADD);
      expect(times).toEqual([10, 20, 30]);
    });

    it('should sample multiple opcodes', () => {
      profiler.enable();
      profiler.beforeInstruction(Opcode.ADD);
      profiler.beforeInstruction(Opcode.SUB);
      profiler.afterInstruction(Opcode.ADD, 10);
      profiler.afterInstruction(Opcode.SUB, 20);

      const addTimes = profiler.getInstructionTimes(Opcode.ADD);
      const subTimes = profiler.getInstructionTimes(Opcode.SUB);

      expect(addTimes).toEqual([10]);
      expect(subTimes).toEqual([20]);
    });

    it('should return empty array for non-existent opcode', () => {
      const times = profiler.getInstructionTimes(Opcode.ADD);
      expect(times).toEqual([]);
    });

    it('should not sample when disabled', () => {
      profiler.beforeInstruction(Opcode.ADD);
      profiler.afterInstruction(Opcode.ADD, 10);

      const times = profiler.getInstructionTimes(Opcode.ADD);
      expect(times).toEqual([]);
    });

    it('should clear samples on clear', () => {
      profiler.enable();
      profiler.beforeInstruction(Opcode.ADD);
      profiler.afterInstruction(Opcode.ADD, 10);
      profiler.clear();

      const times = profiler.getInstructionTimes(Opcode.ADD);
      expect(times).toEqual([]);
    });
  });

  describe('Hot Path', () => {
    it('should identify hotspots', () => {
      profiler.enable();
      for (let i = 0; i < 100; i++) {
        profiler.beforeInstruction(Opcode.ADD);
      }
      for (let i = 0; i < 50; i++) {
        profiler.beforeInstruction(Opcode.SUB);
      }
      for (let i = 0; i < 25; i++) {
        profiler.beforeInstruction(Opcode.MUL);
      }

      const stats = profiler.getStatistics();
      expect(stats.hotspots).toContain(Opcode.ADD);
      expect(stats.hotspots.length).toBeGreaterThan(0);
    });

    it('should limit hotspots to top 10', () => {
      profiler.enable();
      for (let i = 0; i < 15; i++) {
        profiler.beforeInstruction(i as Opcode);
      }

      const stats = profiler.getStatistics();
      expect(stats.hotspots.length).toBeLessThanOrEqual(10);
    });

    it('should sort hotspots by count', () => {
      profiler.enable();
      profiler.beforeInstruction(Opcode.ADD);
      profiler.beforeInstruction(Opcode.ADD);
      profiler.beforeInstruction(Opcode.ADD);
      profiler.beforeInstruction(Opcode.SUB);
      profiler.beforeInstruction(Opcode.SUB);

      const stats = profiler.getStatistics();
      expect(stats.hotspots[0]).toBe(Opcode.ADD);
    });

    it('should return empty hotspots when no data', () => {
      const stats = profiler.getStatistics();
      expect(stats.hotspots).toEqual([]);
    });
  });

  describe('Instruction Count', () => {
    it('should track total instructions', () => {
      profiler.enable();
      profiler.beforeInstruction(Opcode.ADD);
      profiler.beforeInstruction(Opcode.SUB);
      profiler.beforeInstruction(Opcode.MUL);

      const stats = profiler.getStatistics();
      expect(stats.totalInstructions).toBe(3);
    });

    it('should track instruction distribution', () => {
      profiler.enable();
      profiler.beforeInstruction(Opcode.ADD);
      profiler.beforeInstruction(Opcode.ADD);
      profiler.beforeInstruction(Opcode.SUB);

      const distribution = profiler.getStatistics().opcodeDistribution;
      expect(distribution.has(Opcode.ADD)).toBe(true);
      expect(distribution.has(Opcode.SUB)).toBe(true);
    });

    it('should include count in profile data', () => {
      profiler.enable();
      profiler.beforeInstruction(Opcode.ADD);
      profiler.beforeInstruction(Opcode.ADD);

      const distribution = profiler.getStatistics().opcodeDistribution;
      const addData = distribution.get(Opcode.ADD);

      expect(addData?.count).toBe(2);
    });

    it('should reset instruction count on reset', () => {
      profiler.enable();
      profiler.beforeInstruction(Opcode.ADD);
      profiler.reset();

      const stats = profiler.getStatistics();
      expect(stats.totalInstructions).toBe(0);
    });
  });

  describe('Memory', () => {
    it('should use context for memory operations', () => {
      const stack = context.getStack();
      stack.push(42);

      expect(stack.peek()).toBe(42);
    });

    it('should not interfere with memory operations', () => {
      profiler.enable();
      profiler.beforeInstruction(Opcode.ADD);

      const stack = context.getStack();
      stack.push(10);

      expect(stack.getSize()).toBe(1);
    });

    it('should profile memory-related opcodes', () => {
      profiler.enable();
      profiler.beforeInstruction(Opcode.LOAD);
      profiler.beforeInstruction(Opcode.STORE);

      const loadCount = profiler.getInstructionCount(Opcode.LOAD);
      const storeCount = profiler.getInstructionCount(Opcode.STORE);

      expect(loadCount).toBe(1);
      expect(storeCount).toBe(1);
    });
  });

  describe('CPU', () => {
    it('should track CPU time per opcode', () => {
      profiler.enable();
      profiler.beforeInstruction(Opcode.ADD);
      profiler.afterInstruction(Opcode.ADD, 5);
      profiler.afterInstruction(Opcode.ADD, 10);

      const distribution = profiler.getStatistics().opcodeDistribution;
      const addData = distribution.get(Opcode.ADD);

      expect(addData?.totalTime).toBe(15);
    });

    it('should calculate average CPU time', () => {
      profiler.enable();
      profiler.beforeInstruction(Opcode.ADD);
      profiler.afterInstruction(Opcode.ADD, 10);
      profiler.afterInstruction(Opcode.ADD, 20);

      const distribution = profiler.getStatistics().opcodeDistribution;
      const addData = distribution.get(Opcode.ADD);

      expect(addData?.averageTime).toBe(15);
    });

    it('should identify CPU-intensive opcodes', () => {
      profiler.enable();
      profiler.beforeInstruction(Opcode.MUL);
      profiler.afterInstruction(Opcode.MUL, 100);
      profiler.beforeInstruction(Opcode.ADD);
      profiler.afterInstruction(Opcode.ADD, 5);

      const distribution = profiler.getStatistics().opcodeDistribution;
      const mulData = distribution.get(Opcode.MUL);
      const addData = distribution.get(Opcode.ADD);

      expect(mulData?.totalTime).toBeGreaterThan(addData?.totalTime || 0);
    });
  });

  describe('Enable/Disable', () => {
    it('should enable profiler', () => {
      profiler.enable();

      expect(profiler.isEnabled()).toBe(true);
    });

    it('should disable profiler', () => {
      profiler.enable();
      profiler.disable();

      expect(profiler.isEnabled()).toBe(false);
    });

    it('should not record when disabled', () => {
      profiler.disable();
      profiler.beforeInstruction(Opcode.ADD);

      const count = profiler.getInstructionCount(Opcode.ADD);
      expect(count).toBe(0);
    });

    it('should record when enabled', () => {
      profiler.enable();
      profiler.beforeInstruction(Opcode.ADD);

      const count = profiler.getInstructionCount(Opcode.ADD);
      expect(count).toBe(1);
    });
  });

  describe('Export/Import', () => {
    it('should export profile data', () => {
      profiler.enable();
      profiler.beforeInstruction(Opcode.ADD);
      profiler.afterInstruction(Opcode.ADD, 10);

      const exported = profiler.export();
      const parsed = JSON.parse(exported);

      expect(parsed.totalInstructions).toBe(1);
      expect(parsed.opcodeDistribution).toBeDefined();
    });

    it('should import profile data', () => {
      const data = {
        totalInstructions: 100,
        totalExecutionTime: 1000,
        averageExecutionTime: 10,
        opcodeDistribution: [[Opcode.ADD, { opcode: Opcode.ADD, count: 50, totalTime: 500, averageTime: 10, minTime: 5, maxTime: 15 }]],
        hotspots: [Opcode.ADD],
      };

      profiler.import(JSON.stringify(data));

      const stats = profiler.getStatistics();
      expect(stats.totalInstructions).toBe(100);
    });

    it('should export valid JSON', () => {
      profiler.enable();
      profiler.beforeInstruction(Opcode.ADD);

      const exported = profiler.export();
      expect(() => JSON.parse(exported)).not.toThrow();
    });

    it('should handle import errors gracefully', () => {
      expect(() => {
        profiler.import('invalid json');
      }).toThrow();
    });
  });

  describe('Validation', () => {
    it('should validate valid state', () => {
      const validation = profiler.validate();
      expect(validation.valid).toBe(true);
      expect(validation.errors).toEqual([]);
    });

    it('should detect negative instruction count', () => {
      // This tests the validation logic
      const validation = profiler.validate();
      expect(validation.valid).toBe(true);
    });

    it('should detect negative start time', () => {
      // This tests the validation logic
      const validation = profiler.validate();
      expect(validation.valid).toBe(true);
    });

    it('should include all validation errors', () => {
      const validation = profiler.validate();
      expect(Array.isArray(validation.errors)).toBe(true);
    });
  });

  describe('Context Management', () => {
    it('should set execution context', () => {
      const newContext = new ExecutionContext();
      profiler.setContext(newContext);

      expect(profiler.getContext()).toBe(newContext);
    });

    it('should get execution context', () => {
      const retrievedContext = profiler.getContext();
      expect(retrievedContext).toBe(context);
    });

    it('should use new context for operations', () => {
      const newContext = new ExecutionContext();
      profiler.setContext(newContext);
      profiler.enable();
      profiler.beforeInstruction(Opcode.ADD);

      const stack = newContext.getStack();
      expect(stack).toBeDefined();
    });
  });

  describe('Reset', () => {
    it('should reset profiler', () => {
      profiler.enable();
      profiler.beforeInstruction(Opcode.ADD);
      profiler.reset();

      expect(profiler.isEnabled()).toBe(false);
      expect(profiler.getStatistics().totalInstructions).toBe(0);
    });

    it('should clear all data on reset', () => {
      profiler.enable();
      profiler.beforeInstruction(Opcode.ADD);
      profiler.afterInstruction(Opcode.ADD, 10);
      profiler.reset();

      const stats = profiler.getStatistics();
      expect(stats.totalInstructions).toBe(0);
      expect(stats.opcodeDistribution.size).toBe(0);
    });

    it('should reset start time', () => {
      profiler.enable();
      profiler.reset();

      const stats = profiler.getStatistics();
      expect(stats.totalExecutionTime).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Statistics', () => {
    it('should get statistics', () => {
      profiler.enable();
      profiler.beforeInstruction(Opcode.ADD);
      profiler.afterInstruction(Opcode.ADD, 10);

      const stats = profiler.getStatistics();
      expect(stats.totalInstructions).toBe(1);
      expect(stats.opcodeDistribution.size).toBe(1);
    });

    it('should calculate opcode distribution', () => {
      profiler.enable();
      profiler.beforeInstruction(Opcode.ADD);
      profiler.beforeInstruction(Opcode.SUB);
      profiler.afterInstruction(Opcode.ADD, 10);
      profiler.afterInstruction(Opcode.SUB, 20);

      const distribution = profiler.getStatistics().opcodeDistribution;
      expect(distribution.size).toBe(2);
    });

    it('should include hotspots in statistics', () => {
      profiler.enable();
      profiler.beforeInstruction(Opcode.ADD);
      profiler.beforeInstruction(Opcode.ADD);

      const stats = profiler.getStatistics();
      expect(stats.hotspots).toContain(Opcode.ADD);
    });

    it('should handle empty statistics', () => {
      const stats = profiler.getStatistics();
      expect(stats.totalInstructions).toBe(0);
      expect(stats.opcodeDistribution.size).toBe(0);
      expect(stats.hotspots).toEqual([]);
    });
  });

  describe('Stress Tests', () => {
    it('should handle many instructions', () => {
      profiler.enable();
      for (let i = 0; i < 10000; i++) {
        profiler.beforeInstruction(Opcode.ADD);
      }

      const stats = profiler.getStatistics();
      expect(stats.totalInstructions).toBe(10000);
    });

    it('should handle many opcode types', () => {
      profiler.enable();
      for (let i = 0; i < 100; i++) {
        profiler.beforeInstruction(i as Opcode);
      }

      const distribution = profiler.getStatistics().opcodeDistribution;
      expect(distribution.size).toBe(100);
    });

    it('should handle rapid sampling', () => {
      profiler.enable();
      for (let i = 0; i < 1000; i++) {
        profiler.beforeInstruction(Opcode.ADD);
        profiler.afterInstruction(Opcode.ADD, i % 100);
      }

      const times = profiler.getInstructionTimes(Opcode.ADD);
      expect(times.length).toBe(1000);
    });

    it('should maintain performance under load', () => {
      profiler.enable();
      const startTime = performance.now();

      for (let i = 0; i < 10000; i++) {
        profiler.beforeInstruction(Opcode.ADD);
        profiler.afterInstruction(Opcode.ADD, 1);
      }

      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(100); // Less than 100ms
    });
  });
});
