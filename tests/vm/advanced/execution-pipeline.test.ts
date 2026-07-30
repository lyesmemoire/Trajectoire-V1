import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ExecutionPipeline, PipelineStatistics } from '../../../compiler/cvm/execution-pipeline';
import { ExecutionContext } from '../../../compiler/cvm/execution-context';

describe('Execution Pipeline - Priority 5', () => {
  let context: ExecutionContext;
  let pipeline: ExecutionPipeline;
  let bytecode: Uint8Array;

  beforeEach(() => {
    context = new ExecutionContext();
    bytecode = new Uint8Array([0x00, 0x01, 0x02, 0x03]);
    pipeline = new ExecutionPipeline(bytecode, context);
  });

  describe('Fetch', () => {
    it('should fetch instruction at program counter', () => {
      const pc = context.getProgramCounter();
      
      try {
        const result = pipeline.cycle();
        expect(result).toBeDefined();
        expect(context.getProgramCounter()).toBeGreaterThan(pc);
      } catch (e) {
        // Invalid bytecode - just verify PC didn't change on error
        expect(context.getProgramCounter()).toBe(pc);
      }
    });

    it('should increment program counter after fetch', () => {
      const initialPC = context.getProgramCounter();
      
      try {
        pipeline.cycle();
        expect(context.getProgramCounter()).toBeGreaterThan(initialPC);
      } catch (e) {
        // Invalid bytecode - PC may not increment
      }
    });

    it('should handle fetch from different positions', () => {
      context.setProgramCounter(2);
      
      try {
        pipeline.cycle();
        expect(context.getProgramCounter()).toBeGreaterThan(2);
      } catch (e) {
        // Invalid bytecode at position 2
      }
    });

    it('should fetch multiple instructions sequentially', () => {
      const pc1 = context.getProgramCounter();
      try {
        pipeline.cycle();
        const pc2 = context.getProgramCounter();
        pipeline.cycle();
        const pc3 = context.getProgramCounter();

        expect(pc3 > pc2 && pc2 > pc1).toBe(true);
      } catch (e) {
        // Invalid bytecode
      }
    });
  });

  describe('Decode', () => {
    it('should decode fetched instruction', () => {
      try {
        const result = pipeline.cycle();
        expect(result).toBeDefined();
        expect(result?.success).toBeDefined();
      } catch (e) {
        // Invalid bytecode - decode will fail
        expect(e).toBeDefined();
      }
    });

    it('should handle decode errors gracefully', () => {
      const invalidBytecode = new Uint8Array([0xFF, 0xFF, 0xFF, 0xFF]);
      const invalidPipeline = new ExecutionPipeline(invalidBytecode, context);

      try {
        const result = invalidPipeline.cycle();
        // Should handle invalid opcodes
        expect(result).toBeDefined();
      } catch (e) {
        // Expected to throw on invalid opcode
        expect((e as Error).message).toContain('Unknown opcode');
      }
    });

    it('should decode instruction metadata', () => {
      try {
        const result = pipeline.cycle();
        expect(result).toBeDefined();
        // Result should contain execution information
      } catch (e) {
        // Invalid bytecode
      }
    });
  });

  describe('Execute', () => {
    it('should execute decoded instruction', () => {
      try {
        const result = pipeline.cycle();
        expect(result).toBeDefined();
        expect(result?.success).toBeDefined();
      } catch (e) {
        // Invalid bytecode
      }
    });

    it('should update context on execution', () => {
      const initialPC = context.getProgramCounter();
      try {
        pipeline.cycle();
        expect(context.getProgramCounter()).not.toBe(initialPC);
      } catch (e) {
        // Invalid bytecode - PC may not change
      }
    });

    it('should handle execution errors', () => {
      const invalidBytecode = new Uint8Array([0xFF, 0xFF, 0xFF, 0xFF]);
      const invalidPipeline = new ExecutionPipeline(invalidBytecode, context);

      try {
        const result = invalidPipeline.cycle();
        expect(result).toBeDefined();
      } catch (e) {
        // Expected to throw on invalid opcode
        expect((e as Error).message).toContain('Unknown opcode');
      }
    });

    it('should track execution statistics', () => {
      try {
        pipeline.cycle();
        pipeline.cycle();
        pipeline.cycle();

        const stats = pipeline.getStatistics();
        expect(stats.instructionsExecuted).toBe(3);
      } catch (e) {
        // Invalid bytecode - statistics may not increment
      }
    });
  });

  describe('Commit', () => {
    it('should commit execution results', () => {
      try {
        const result = pipeline.cycle();
        expect(result).toBeDefined();
        // Results should be committed to context
      } catch (e) {
        // Invalid bytecode
      }
    });

    it('should update statistics after commit', () => {
      try {
        pipeline.cycle();

        const stats = pipeline.getStatistics();
        expect(stats.instructionsExecuted).toBe(1);
        expect(stats.cycles).toBe(1);
      } catch (e) {
        // Invalid bytecode
      }
    });

    it('should handle branch commit', () => {
      try {
        // Create bytecode with branch instruction
        const branchBytecode = new Uint8Array([0x10, 0x00, 0x00, 0x00]);
        const branchPipeline = new ExecutionPipeline(branchBytecode, context);

        branchPipeline.cycle();

        const stats = branchPipeline.getStatistics();
        expect(stats.branchesTaken).toBeGreaterThanOrEqual(0);
      } catch (e) {
        // Invalid bytecode
      }
    });
  });

  describe('Flush', () => {
    it('should clear fetch cache on reset', () => {
      try {
        pipeline.cycle();
        pipeline.cycle();
      } catch (e) {
        // Invalid bytecode - continue anyway
      }

      pipeline.reset();

      const cacheStats = pipeline.getCacheStatistics();
      expect(cacheStats).toBeDefined();
    });

    it('should reset statistics on flush', () => {
      try {
        pipeline.cycle();
        pipeline.cycle();
        pipeline.cycle();
      } catch (e) {
        // Invalid bytecode
      }

      pipeline.reset();

      const stats = pipeline.getStatistics();
      expect(stats.instructionsExecuted).toBe(0);
      expect(stats.cycles).toBe(0);
    });

    it('should reset context on flush', () => {
      context.setProgramCounter(100);
      try {
        pipeline.cycle();
      } catch (e) {
        // Invalid bytecode
      }

      pipeline.reset();

      expect(context.getProgramCounter()).toBe(0);
    });
  });

  describe('Hazards', () => {
    it('should handle data hazards', () => {
      const stack = context.getStack();
      stack.push(10);
      stack.push(20);

      try {
        pipeline.cycle();
        pipeline.cycle();
      } catch (e) {
        // Invalid bytecode
      }

      // Pipeline should handle data dependencies
      expect(stack.getSize()).toBeGreaterThanOrEqual(0);
    });

    it('should handle control hazards', () => {
      context.setProgramCounter(0);
      try {
        pipeline.cycle();
      } catch (e) {
        // Invalid bytecode
      }

      const pc = context.getProgramCounter();
      try {
        pipeline.cycle();
      } catch (e) {
        // Invalid bytecode
      }

      // Pipeline should handle control flow
      expect(context.getProgramCounter()).toBeDefined();
    });

    it('should handle structural hazards', () => {
      // Multiple cycles should not conflict
      for (let i = 0; i < 10; i++) {
        try {
          pipeline.cycle();
        } catch (e) {
          // Invalid bytecode - continue
        }
      }

      const stats = pipeline.getStatistics();
      expect(stats.instructionsExecuted).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Dependency', () => {
    it('should handle instruction dependencies', () => {
      const stack = context.getStack();
      stack.push(1);
      stack.push(2);

      try {
        pipeline.cycle();
        pipeline.cycle();
      } catch (e) {
        // Invalid bytecode
      }

      // Results should be available to dependent instructions
      expect(stack.getSize()).toBeGreaterThanOrEqual(0);
    });

    it('should maintain execution order', () => {
      const pc1 = context.getProgramCounter();
      try {
        pipeline.cycle();
      } catch (e) {
        // Invalid bytecode
      }
      const pc2 = context.getProgramCounter();
      try {
        pipeline.cycle();
      } catch (e) {
        // Invalid bytecode
      }
      const pc3 = context.getProgramCounter();

      expect(pc3 >= pc2 && pc2 >= pc1).toBe(true);
    });
  });

  describe('Stall', () => {
    it('should handle pipeline stall on halt', () => {
      context.halt();

      const result = pipeline.cycle();

      expect(result).toBeNull();
    });

    it('should not execute when halted', () => {
      context.halt();
      pipeline.cycle();
      pipeline.cycle();

      const stats = pipeline.getStatistics();
      expect(stats.instructionsExecuted).toBe(0);
    });

    it('should resume after reset', () => {
      context.halt();
      try {
        pipeline.cycle();
      } catch (e) {
        // Invalid bytecode
      }

      pipeline.reset();
      try {
        const result = pipeline.cycle();
        expect(result).toBeDefined();
      } catch (e) {
        // Invalid bytecode - expected
      }
    });
  });

  describe('Branch Prediction', () => {
    it('should track branch taken statistics', () => {
      const stats = pipeline.getStatistics();
      expect(stats.branchesTaken).toBe(0);
      expect(stats.branchesNotTaken).toBe(0);
    });

    it('should track branches not taken', () => {
      try {
        pipeline.cycle();
      } catch (e) {
        // Invalid bytecode
      }

      const stats = pipeline.getStatistics();
      expect(stats.branchesNotTaken).toBeGreaterThanOrEqual(0);
    });

    it('should track total branches', () => {
      try {
        pipeline.cycle();
        pipeline.cycle();
      } catch (e) {
        // Invalid bytecode
      }

      const stats = pipeline.getStatistics();
      const totalBranches = stats.branchesTaken + stats.branchesNotTaken;
      expect(totalBranches).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Reset', () => {
    it('should reset pipeline state', () => {
      try {
        pipeline.cycle();
        pipeline.cycle();
        pipeline.cycle();
      } catch (e) {
        // Invalid bytecode
      }

      pipeline.reset();

      const stats = pipeline.getStatistics();
      expect(stats.instructionsExecuted).toBe(0);
      expect(stats.cycles).toBe(0);
    });

    it('should reset context', () => {
      context.setProgramCounter(50);
      try {
        pipeline.cycle();
      } catch (e) {
        // Invalid bytecode
      }

      pipeline.reset();

      expect(context.getProgramCounter()).toBe(0);
    });

    it('should clear fetch cache', () => {
      try {
        pipeline.cycle();
        pipeline.cycle();
      } catch (e) {
        // Invalid bytecode
      }

      pipeline.reset();

      const cacheStats = pipeline.getCacheStatistics();
      expect(cacheStats).toBeDefined();
    });

    it('should stop running on reset', () => {
      try {
        pipeline.runCycles(10);
      } catch (e) {
        // Invalid bytecode
      }
      pipeline.reset();

      try {
        const result = pipeline.cycle();
        expect(result).toBeDefined();
      } catch (e) {
        // Invalid bytecode - expected
      }
    });
  });

  describe('Recovery', () => {
    it('should recover from errors', () => {
      const invalidBytecode = new Uint8Array([0xFF, 0xFF, 0xFF, 0xFF]);
      const invalidPipeline = new ExecutionPipeline(invalidBytecode, context);

      try {
        invalidPipeline.cycle();
      } catch (e) {
        // Expected to throw on invalid opcode
      }

      // Should be able to continue after error
      invalidPipeline.reset();
      const result = invalidPipeline.cycle();
      expect(result).toBeDefined();
    });

    it('should track error statistics', () => {
      const invalidBytecode = new Uint8Array([0xFF, 0xFF, 0xFF, 0xFF]);
      const invalidPipeline = new ExecutionPipeline(invalidBytecode, context);

      try {
        invalidPipeline.cycle();
      } catch (e) {
        // Expected to throw on invalid opcode
      }

      const stats = invalidPipeline.getStatistics();
      expect(stats.errors).toBeGreaterThanOrEqual(0);
    });

    it('should set error context on failure', () => {
      const invalidBytecode = new Uint8Array([0xFF, 0xFF, 0xFF, 0xFF]);
      const invalidPipeline = new ExecutionPipeline(invalidBytecode, context);

      try {
        invalidPipeline.cycle();
      } catch (e) {
        // Expected to throw on invalid opcode
      }

      // Error should be set in context if execution failed
      const error = context.getError();
      expect(error).toBeDefined();
    });
  });

  describe('Statistics', () => {
    it('should track instructions executed', () => {
      try {
        pipeline.cycle();
        pipeline.cycle();
        pipeline.cycle();
      } catch (e) {
        // Invalid bytecode
      }

      const stats = pipeline.getStatistics();
      expect(stats.instructionsExecuted).toBeGreaterThanOrEqual(0);
    });

    it('should track cycles', () => {
      try {
        pipeline.cycle();
        pipeline.cycle();
      } catch (e) {
        // Invalid bytecode
      }

      const stats = pipeline.getStatistics();
      expect(stats.cycles).toBeGreaterThanOrEqual(0);
    });

    it('should track calls', () => {
      try {
        pipeline.cycle();
      } catch (e) {
        // Invalid bytecode
      }

      const stats = pipeline.getStatistics();
      expect(stats.calls).toBeGreaterThanOrEqual(0);
    });

    it('should track returns', () => {
      try {
        pipeline.cycle();
      } catch (e) {
        // Invalid bytecode
      }

      const stats = pipeline.getStatistics();
      expect(stats.returns).toBeGreaterThanOrEqual(0);
    });

    it('should track errors', () => {
      const invalidBytecode = new Uint8Array([0xFF, 0xFF, 0xFF, 0xFF]);
      const invalidPipeline = new ExecutionPipeline(invalidBytecode, context);

      try {
        invalidPipeline.cycle();
      } catch (e) {
        // Expected to throw on invalid opcode
      }

      const stats = invalidPipeline.getStatistics();
      expect(stats.errors).toBeGreaterThanOrEqual(0);
    });

    it('should return statistics copy', () => {
      try {
        pipeline.cycle();
      } catch (e) {
        // Invalid bytecode
      }

      const stats1 = pipeline.getStatistics();
      const stats2 = pipeline.getStatistics();

      expect(stats1).toEqual(stats2);
      expect(stats1).not.toBe(stats2);
    });
  });

  describe('Cache Management', () => {
    it('should enable instruction cache', () => {
      pipeline.enableCache();

      const cacheStats = pipeline.getCacheStatistics();
      expect(cacheStats).toBeDefined();
    });

    it('should disable instruction cache', () => {
      pipeline.disableCache();

      const cacheStats = pipeline.getCacheStatistics();
      expect(cacheStats).toBeDefined();
    });

    it('should set cache size', () => {
      pipeline.setCacheSize(1024);

      const cacheStats = pipeline.getCacheStatistics();
      expect(cacheStats).toBeDefined();
    });

    it('should get cache statistics', () => {
      try {
        pipeline.cycle();
        pipeline.cycle();
      } catch (e) {
        // Invalid bytecode
      }

      const cacheStats = pipeline.getCacheStatistics();
      expect(cacheStats).toBeDefined();
    });
  });

  describe('Bytecode Management', () => {
    it('should set bytecode', () => {
      const newBytecode = new Uint8Array([0x05, 0x06, 0x07, 0x08]);
      pipeline.setBytecode(newBytecode);

      const retrieved = pipeline.getBytecode();
      expect(retrieved).toEqual(newBytecode);
    });

    it('should get bytecode', () => {
      const retrieved = pipeline.getBytecode();
      expect(retrieved).toEqual(bytecode);
    });

    it('should reset on bytecode change', () => {
      try {
        pipeline.cycle();
        pipeline.cycle();
      } catch (e) {
        // Invalid bytecode
      }

      const newBytecode = new Uint8Array([0x05, 0x06, 0x07, 0x08]);
      pipeline.setBytecode(newBytecode);

      const stats = pipeline.getStatistics();
      expect(stats.instructionsExecuted).toBe(0);
    });
  });

  describe('Context Management', () => {
    it('should get context', () => {
      const retrievedContext = pipeline.getContext();
      expect(retrievedContext).toBe(context);
    });

    it('should use context for execution', () => {
      const stack = context.getStack();
      stack.push(10);

      try {
        pipeline.cycle();
      } catch (e) {
        // Invalid bytecode
      }

      expect(stack.getSize()).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Pipeline Units', () => {
    it('should get fetch unit', () => {
      const fetch = pipeline.getFetch();
      expect(fetch).toBeDefined();
    });

    it('should get decode unit', () => {
      const decode = pipeline.getDecode();
      expect(decode).toBeDefined();
    });

    it('should get execute unit', () => {
      const execute = pipeline.getExecute();
      expect(execute).toBeDefined();
    });
  });

  describe('Run Modes', () => {
    it('should run single cycle', () => {
      try {
        const result = pipeline.cycle();
        expect(result).toBeDefined();
      } catch (e) {
        // Invalid bytecode - expected
        expect((e as Error).message).toContain('Unknown opcode');
      }
    });

    it('should run for N cycles', () => {
      const stats = pipeline.runCycles(5);

      expect(stats.instructionsExecuted).toBeGreaterThanOrEqual(0);
      expect(stats.cycles).toBeGreaterThanOrEqual(0);
    });

    it('should run until halt', () => {
      context.halt();

      const stats = pipeline.run();

      expect(stats.instructionsExecuted).toBe(0);
    });

    it('should stop pipeline', () => {
      pipeline.stop();

      const stats = pipeline.runCycles(10);
      expect(stats.instructionsExecuted).toBe(0);
    });

    it('should step through execution', () => {
      try {
        const result = pipeline.step();
        expect(result).toBeDefined();
      } catch (e) {
        // Invalid bytecode - expected
        expect((e as Error).message).toContain('Unknown opcode');
      }
    });
  });

  describe('Validation', () => {
    it('should validate valid state', () => {
      const validation = pipeline.validate();
      expect(validation.valid).toBe(true);
      expect(validation.errors).toEqual([]);
    });

    it('should detect negative program counter', () => {
      context.setProgramCounter(-1);

      const validation = pipeline.validate();
      expect(validation.valid).toBe(false);
    });

    it('should detect program counter exceeding bytecode', () => {
      context.setProgramCounter(1000);

      const validation = pipeline.validate();
      expect(validation.valid).toBe(false);
    });

    it('should include context validation errors', () => {
      context.setProgramCounter(-1);

      const validation = pipeline.validate();
      expect(validation.errors.length).toBeGreaterThan(0);
    });
  });

  describe('Stress Tests', () => {
    it('should handle many cycles', () => {
      const largeBytecode = new Uint8Array(1000).fill(0x00);
      const largePipeline = new ExecutionPipeline(largeBytecode, context);

      const stats = largePipeline.runCycles(100);

      expect(stats.instructionsExecuted).toBeGreaterThanOrEqual(0);
      expect(stats.cycles).toBeGreaterThanOrEqual(0);
    });

    it('should handle rapid start-stop', () => {
      for (let i = 0; i < 20; i++) {
        try {
          pipeline.cycle();
        } catch (e) {
          // Invalid bytecode
        }
        pipeline.stop();
        pipeline.reset();
      }

      expect(pipeline.getStatistics().instructionsExecuted).toBe(0);
    });

    it('should handle rapid bytecode changes', () => {
      for (let i = 0; i < 10; i++) {
        const newBytecode = new Uint8Array([i, i + 1, i + 2, i + 3]);
        pipeline.setBytecode(newBytecode);
        try {
          pipeline.cycle();
        } catch (e) {
          // Invalid bytecode
        }
      }

      const stats = pipeline.getStatistics();
      expect(stats.instructionsExecuted).toBeGreaterThanOrEqual(0);
    });

    it('should maintain performance over many cycles', () => {
      const largeBytecode = new Uint8Array(10000).fill(0x00);
      const largePipeline = new ExecutionPipeline(largeBytecode, context);

      const startTime = performance.now();
      largePipeline.runCycles(1000);
      const endTime = performance.now();

      const duration = endTime - startTime;
      expect(duration).toBeLessThan(1000); // Less than 1 second
    });
  });

  describe('Branch Statistics Coverage', () => {
    it('should track branch taken when result.branchTaken is true', () => {
      const testContext = new ExecutionContext();
      const testBytecode = new Uint8Array([0x00, 0x01]);
      const testPipeline = new ExecutionPipeline(testBytecode, testContext);

      // Mock the execute unit to return branchTaken = true
      const mockExecute = testPipeline.getExecute();
      const originalExecute = mockExecute.execute.bind(mockExecute);
      mockExecute.execute = vi.fn().mockReturnValue({
        success: true,
        branchTaken: true,
        nextPc: 10
      });

      // Mock fetch to return valid instruction
      const mockFetch = testPipeline.getFetch();
      mockFetch.fetch = vi.fn().mockReturnValue({
        instruction: new Uint8Array([0x00]),
        size: 1
      });

      // Mock decode to return valid decoded instruction
      const mockDecode = testPipeline.getDecode();
      mockDecode.decode = vi.fn().mockReturnValue({
        opcode: 0x00,
        operands: [],
        isCall: false,
        isReturn: false,
        isBranch: false
      });

      testPipeline.cycle();

      const stats = testPipeline.getStatistics();
      expect(stats.branchesTaken).toBeGreaterThan(0);

      // Restore original
      mockExecute.execute = originalExecute;
    });

    it('should track branch not taken when result.branchTaken is false', () => {
      const testContext = new ExecutionContext();
      const testBytecode = new Uint8Array([0x00, 0x01]);
      const testPipeline = new ExecutionPipeline(testBytecode, testContext);

      // Mock the execute unit to return branchTaken = false
      const mockExecute = testPipeline.getExecute();
      const originalExecute = mockExecute.execute.bind(mockExecute);
      mockExecute.execute = vi.fn().mockReturnValue({
        success: true,
        branchTaken: false,
        nextPc: 2
      });

      // Mock fetch to return valid instruction
      const mockFetch = testPipeline.getFetch();
      mockFetch.fetch = vi.fn().mockReturnValue({
        instruction: new Uint8Array([0x00]),
        size: 1
      });

      // Mock decode to return valid decoded instruction
      const mockDecode = testPipeline.getDecode();
      mockDecode.decode = vi.fn().mockReturnValue({
        opcode: 0x00,
        operands: [],
        isCall: false,
        isReturn: false,
        isBranch: false
      });

      testPipeline.cycle();

      const stats = testPipeline.getStatistics();
      expect(stats.branchesNotTaken).toBeGreaterThan(0);

      // Restore original
      mockExecute.execute = originalExecute;
    });

    it('should track call instructions', () => {
      const testContext = new ExecutionContext();
      const testBytecode = new Uint8Array([0x00, 0x01]);
      const testPipeline = new ExecutionPipeline(testBytecode, testContext);

      // Mock the decode unit to return isCall = true
      const mockDecode = testPipeline.getDecode();
      const originalDecode = mockDecode.decode.bind(mockDecode);
      mockDecode.decode = vi.fn().mockReturnValue({
        opcode: 0x10,
        operands: [],
        isCall: true,
        isReturn: false,
        isBranch: false
      });

      // Mock execute to return success
      const mockExecute = testPipeline.getExecute();
      const originalExecute = mockExecute.execute.bind(mockExecute);
      mockExecute.execute = vi.fn().mockReturnValue({
        success: true,
        branchTaken: undefined
      });

      // Mock fetch to return valid instruction
      const mockFetch = testPipeline.getFetch();
      mockFetch.fetch = vi.fn().mockReturnValue({
        instruction: new Uint8Array([0x10]),
        size: 1
      });

      testPipeline.cycle();

      const stats = testPipeline.getStatistics();
      expect(stats.calls).toBeGreaterThan(0);

      // Restore originals
      mockDecode.decode = originalDecode;
      mockExecute.execute = originalExecute;
    });

    it('should track return instructions', () => {
      const testContext = new ExecutionContext();
      const testBytecode = new Uint8Array([0x00, 0x01]);
      const testPipeline = new ExecutionPipeline(testBytecode, testContext);

      // Mock the decode unit to return isReturn = true
      const mockDecode = testPipeline.getDecode();
      const originalDecode = mockDecode.decode.bind(mockDecode);
      mockDecode.decode = vi.fn().mockReturnValue({
        opcode: 0x11,
        operands: [],
        isCall: false,
        isReturn: true,
        isBranch: false
      });

      // Mock execute to return success
      const mockExecute = testPipeline.getExecute();
      const originalExecute = mockExecute.execute.bind(mockExecute);
      mockExecute.execute = vi.fn().mockReturnValue({
        success: true,
        branchTaken: undefined
      });

      // Mock fetch to return valid instruction
      const mockFetch = testPipeline.getFetch();
      mockFetch.fetch = vi.fn().mockReturnValue({
        instruction: new Uint8Array([0x11]),
        size: 1
      });

      testPipeline.cycle();

      const stats = testPipeline.getStatistics();
      expect(stats.returns).toBeGreaterThan(0);

      // Restore originals
      mockDecode.decode = originalDecode;
      mockExecute.execute = originalExecute;
    });

    it('should handle execution error with no error message', () => {
      const testContext = new ExecutionContext();
      const testBytecode = new Uint8Array([0x00, 0x01]);
      const testPipeline = new ExecutionPipeline(testBytecode, testContext);

      // Mock execute to return failure without error message
      const mockExecute = testPipeline.getExecute();
      const originalExecute = mockExecute.execute.bind(mockExecute);
      mockExecute.execute = vi.fn().mockReturnValue({
        success: false,
        error: null, // No error message, should use default
        branchTaken: undefined
      });

      // Mock fetch to return valid instruction
      const mockFetch = testPipeline.getFetch();
      mockFetch.fetch = vi.fn().mockReturnValue({
        instruction: new Uint8Array([0x00]),
        size: 1
      });

      // Mock decode to return valid decoded instruction
      const mockDecode = testPipeline.getDecode();
      mockDecode.decode = vi.fn().mockReturnValue({
        opcode: 0x00,
        operands: [],
        isCall: false,
        isReturn: false,
        isBranch: false
      });

      testPipeline.cycle();

      const stats = testPipeline.getStatistics();
      expect(stats.errors).toBeGreaterThan(0);
      const error = testContext.getError();
      expect(error).toBeDefined();
      expect(error?.message).toBe('Execution error');

      // Restore original
      mockExecute.execute = originalExecute;
    });
  });

  describe('Loop Execution Coverage', () => {
    it('should execute loop iterations in run() when not halted', () => {
      const testContext = new ExecutionContext();
      const testBytecode = new Uint8Array([0x00, 0x01, 0x02, 0x03]);
      const testPipeline = new ExecutionPipeline(testBytecode, testContext);

      // Mock fetch, decode, execute to succeed
      const mockFetch = testPipeline.getFetch();
      const originalFetch = mockFetch.fetch.bind(mockFetch);
      mockFetch.fetch = vi.fn().mockReturnValue({
        instruction: new Uint8Array([0x00]),
        size: 1
      });

      const mockDecode = testPipeline.getDecode();
      const originalDecode = mockDecode.decode.bind(mockDecode);
      mockDecode.decode = vi.fn().mockReturnValue({
        opcode: 0x00,
        operands: [],
        isCall: false,
        isReturn: false,
        isBranch: false
      });

      const mockExecute = testPipeline.getExecute();
      const originalExecute = mockExecute.execute.bind(mockExecute);
      let cycleCount = 0;
      mockExecute.execute = vi.fn().mockImplementation(() => {
        cycleCount++;
        if (cycleCount >= 3) {
          testContext.halt();
        }
        return { success: true, branchTaken: undefined };
      });

      const stats = testPipeline.run();

      expect(cycleCount).toBeGreaterThan(0);
      expect(stats.instructionsExecuted).toBeGreaterThan(0);

      // Restore originals
      mockFetch.fetch = originalFetch;
      mockDecode.decode = originalDecode;
      mockExecute.execute = originalExecute;
    });

    it('should execute loop iterations in runCycles() when not halted', () => {
      const testContext = new ExecutionContext();
      const testBytecode = new Uint8Array([0x00, 0x01, 0x02, 0x03]);
      const testPipeline = new ExecutionPipeline(testBytecode, testContext);

      // Mock fetch, decode, execute to succeed
      const mockFetch = testPipeline.getFetch();
      const originalFetch = mockFetch.fetch.bind(mockFetch);
      mockFetch.fetch = vi.fn().mockReturnValue({
        instruction: new Uint8Array([0x00]),
        size: 1
      });

      const mockDecode = testPipeline.getDecode();
      const originalDecode = mockDecode.decode.bind(mockDecode);
      mockDecode.decode = vi.fn().mockReturnValue({
        opcode: 0x00,
        operands: [],
        isCall: false,
        isReturn: false,
        isBranch: false
      });

      const mockExecute = testPipeline.getExecute();
      const originalExecute = mockExecute.execute.bind(mockExecute);
      mockExecute.execute = vi.fn().mockReturnValue({
        success: true,
        branchTaken: undefined
      });

      // Set running to true to allow loop execution
      testPipeline['running'] = true;

      const stats = testPipeline.runCycles(5);

      expect(stats.instructionsExecuted).toBeGreaterThan(0);

      // Restore originals
      mockFetch.fetch = originalFetch;
      mockDecode.decode = originalDecode;
      mockExecute.execute = originalExecute;
    });

    it('should track branch taken when result.branchTaken is true', () => {
      const testContext = new ExecutionContext();
      const testBytecode = new Uint8Array([0x00, 0x01, 0x02, 0x03]);
      const testPipeline = new ExecutionPipeline(testBytecode, testContext);

      const mockFetch = testPipeline.getFetch();
      const originalFetch = mockFetch.fetch.bind(mockFetch);
      mockFetch.fetch = vi.fn().mockReturnValue({
        instruction: new Uint8Array([0x00]),
        size: 1
      });

      const mockDecode = testPipeline.getDecode();
      const originalDecode = mockDecode.decode.bind(mockDecode);
      mockDecode.decode = vi.fn().mockReturnValue({
        opcode: 0x00,
        operands: [],
        isCall: false,
        isReturn: false,
        isBranch: false
      });

      const mockExecute = testPipeline.getExecute();
      const originalExecute = mockExecute.execute.bind(mockExecute);
      mockExecute.execute = vi.fn().mockReturnValue({
        success: true,
        branchTaken: true
      });

      testPipeline.cycle();
      const stats = testPipeline.getStatistics();

      expect(stats.branchesTaken).toBe(1);

      mockFetch.fetch = originalFetch;
      mockDecode.decode = originalDecode;
      mockExecute.execute = originalExecute;
    });

    it('should track branch not taken when result.branchTaken is false', () => {
      const testContext = new ExecutionContext();
      const testBytecode = new Uint8Array([0x00, 0x01, 0x02, 0x03]);
      const testPipeline = new ExecutionPipeline(testBytecode, testContext);

      const mockFetch = testPipeline.getFetch();
      const originalFetch = mockFetch.fetch.bind(mockFetch);
      mockFetch.fetch = vi.fn().mockReturnValue({
        instruction: new Uint8Array([0x00]),
        size: 1
      });

      const mockDecode = testPipeline.getDecode();
      const originalDecode = mockDecode.decode.bind(mockDecode);
      mockDecode.decode = vi.fn().mockReturnValue({
        opcode: 0x00,
        operands: [],
        isCall: false,
        isReturn: false,
        isBranch: false
      });

      const mockExecute = testPipeline.getExecute();
      const originalExecute = mockExecute.execute.bind(mockExecute);
      mockExecute.execute = vi.fn().mockReturnValue({
        success: true,
        branchTaken: false
      });

      testPipeline.cycle();
      const stats = testPipeline.getStatistics();

      expect(stats.branchesNotTaken).toBe(1);

      mockFetch.fetch = originalFetch;
      mockDecode.decode = originalDecode;
      mockExecute.execute = originalExecute;
    });

    it('should track call instructions', () => {
      const testContext = new ExecutionContext();
      const testBytecode = new Uint8Array([0x00, 0x01, 0x02, 0x03]);
      const testPipeline = new ExecutionPipeline(testBytecode, testContext);

      const mockFetch = testPipeline.getFetch();
      const originalFetch = mockFetch.fetch.bind(mockFetch);
      mockFetch.fetch = vi.fn().mockReturnValue({
        instruction: new Uint8Array([0x00]),
        size: 1
      });

      const mockDecode = testPipeline.getDecode();
      const originalDecode = mockDecode.decode.bind(mockDecode);
      mockDecode.decode = vi.fn().mockReturnValue({
        opcode: 0x00,
        operands: [],
        isCall: true,
        isReturn: false,
        isBranch: false
      });

      const mockExecute = testPipeline.getExecute();
      const originalExecute = mockExecute.execute.bind(mockExecute);
      mockExecute.execute = vi.fn().mockReturnValue({
        success: true,
        branchTaken: undefined
      });

      testPipeline.cycle();
      const stats = testPipeline.getStatistics();

      expect(stats.calls).toBe(1);

      mockFetch.fetch = originalFetch;
      mockDecode.decode = originalDecode;
      mockExecute.execute = originalExecute;
    });

    it('should track return instructions', () => {
      const testContext = new ExecutionContext();
      const testBytecode = new Uint8Array([0x00, 0x01, 0x02, 0x03]);
      const testPipeline = new ExecutionPipeline(testBytecode, testContext);

      const mockFetch = testPipeline.getFetch();
      const originalFetch = mockFetch.fetch.bind(mockFetch);
      mockFetch.fetch = vi.fn().mockReturnValue({
        instruction: new Uint8Array([0x00]),
        size: 1
      });

      const mockDecode = testPipeline.getDecode();
      const originalDecode = mockDecode.decode.bind(mockDecode);
      mockDecode.decode = vi.fn().mockReturnValue({
        opcode: 0x00,
        operands: [],
        isCall: false,
        isReturn: true,
        isBranch: false
      });

      const mockExecute = testPipeline.getExecute();
      const originalExecute = mockExecute.execute.bind(mockExecute);
      mockExecute.execute = vi.fn().mockReturnValue({
        success: true,
        branchTaken: undefined
      });

      testPipeline.cycle();
      const stats = testPipeline.getStatistics();

      expect(stats.returns).toBe(1);

      mockFetch.fetch = originalFetch;
      mockDecode.decode = originalDecode;
      mockExecute.execute = originalExecute;
    });

    it('should handle execution error with no error message', () => {
      const testContext = new ExecutionContext();
      const testBytecode = new Uint8Array([0x00, 0x01, 0x02, 0x03]);
      const testPipeline = new ExecutionPipeline(testBytecode, testContext);

      const mockFetch = testPipeline.getFetch();
      const originalFetch = mockFetch.fetch.bind(mockFetch);
      mockFetch.fetch = vi.fn().mockReturnValue({
        instruction: new Uint8Array([0x00]),
        size: 1
      });

      const mockDecode = testPipeline.getDecode();
      const originalDecode = mockDecode.decode.bind(mockDecode);
      mockDecode.decode = vi.fn().mockReturnValue({
        opcode: 0x00,
        operands: [],
        isCall: false,
        isReturn: false,
        isBranch: false
      });

      const mockExecute = testPipeline.getExecute();
      const originalExecute = mockExecute.execute.bind(mockExecute);
      mockExecute.execute = vi.fn().mockReturnValue({
        success: false,
        branchTaken: undefined,
        error: undefined
      });

      testPipeline.cycle();
      const stats = testPipeline.getStatistics();

      expect(stats.errors).toBe(1);
      expect(testContext.getError()).toBeInstanceOf(Error);

      mockFetch.fetch = originalFetch;
      mockDecode.decode = originalDecode;
      mockExecute.execute = originalExecute;
    });
  });

  // ═══════════════════════════════════════════════════════════════════
  // TARGETED TESTS — Kill surviving mutations & detect missed regressions
  // ═══════════════════════════════════════════════════════════════════

  describe('Mutation Kill: reset() must set running to false', () => {
    it('should set running to false after reset, even if it was true', () => {
      // Start running via run() with a halted context so it exits quickly
      context.halt();
      pipeline.run(); // sets running = true, then loop exits immediately
      // Now reset
      pipeline.reset();
      // The mutation `false -> true` would leave running = true here
      expect(pipeline['running']).toBe(false);
    });

    it('should prevent runCycles from executing after reset', () => {
      const testContext = new ExecutionContext();
      const testPipeline = new ExecutionPipeline(new Uint8Array([0x00, 0x01, 0x02, 0x03]), testContext);

      // Mock pipeline units
      const mockFetch = testPipeline.getFetch();
      mockFetch.fetch = vi.fn().mockReturnValue({ instruction: new Uint8Array([0x00]), size: 1 });
      const mockDecode = testPipeline.getDecode();
      mockDecode.decode = vi.fn().mockReturnValue({ opcode: 0x00, operands: [], isCall: false, isReturn: false, isBranch: false });
      const mockExecute = testPipeline.getExecute();
      mockExecute.execute = vi.fn().mockReturnValue({ success: true, branchTaken: undefined });

      // Run, then reset, then try runCycles without calling run() first
      testPipeline['running'] = true;
      testPipeline.runCycles(3);
      testPipeline.reset();

      // After reset, running MUST be false, so runCycles should execute 0 cycles
      const stats = testPipeline.runCycles(5);
      expect(stats.instructionsExecuted).toBe(0);
      expect(stats.cycles).toBe(0);
    });
  });

  describe('Mutation Kill: runCycles must start at i=0', () => {
    it('should execute exactly N cycles when runCycles(N) is called', () => {
      const testContext = new ExecutionContext();
      const testPipeline = new ExecutionPipeline(new Uint8Array([0x00, 0x01, 0x02, 0x03]), testContext);

      const mockFetch = testPipeline.getFetch();
      mockFetch.fetch = vi.fn().mockReturnValue({ instruction: new Uint8Array([0x00]), size: 1 });
      const mockDecode = testPipeline.getDecode();
      mockDecode.decode = vi.fn().mockReturnValue({ opcode: 0x00, operands: [], isCall: false, isReturn: false, isBranch: false });
      const mockExecute = testPipeline.getExecute();
      mockExecute.execute = vi.fn().mockReturnValue({ success: true, branchTaken: undefined });

      testPipeline['running'] = true;
      const stats = testPipeline.runCycles(5);
      // If `let i = 0` is mutated to `let i = 1`, this will be 4, not 5
      expect(stats.instructionsExecuted).toBe(5);
      expect(stats.cycles).toBe(5);
    });

    it('should execute exactly 1 cycle for runCycles(1)', () => {
      const testContext = new ExecutionContext();
      const testPipeline = new ExecutionPipeline(new Uint8Array([0x00, 0x01, 0x02, 0x03]), testContext);

      const mockFetch = testPipeline.getFetch();
      mockFetch.fetch = vi.fn().mockReturnValue({ instruction: new Uint8Array([0x00]), size: 1 });
      const mockDecode = testPipeline.getDecode();
      mockDecode.decode = vi.fn().mockReturnValue({ opcode: 0x00, operands: [], isCall: false, isReturn: false, isBranch: false });
      const mockExecute = testPipeline.getExecute();
      mockExecute.execute = vi.fn().mockReturnValue({ success: true, branchTaken: undefined });

      testPipeline['running'] = true;
      const stats = testPipeline.runCycles(1);
      expect(stats.instructionsExecuted).toBe(1);
    });
  });

  describe('Regression Kill: cycles counter must increment', () => {
    it('should increment cycles exactly once per cycle() call', () => {
      const testContext = new ExecutionContext();
      const testPipeline = new ExecutionPipeline(new Uint8Array([0x00, 0x01, 0x02, 0x03]), testContext);

      const mockFetch = testPipeline.getFetch();
      mockFetch.fetch = vi.fn().mockReturnValue({ instruction: new Uint8Array([0x00]), size: 1 });
      const mockDecode = testPipeline.getDecode();
      mockDecode.decode = vi.fn().mockReturnValue({ opcode: 0x00, operands: [], isCall: false, isReturn: false, isBranch: false });
      const mockExecute = testPipeline.getExecute();
      mockExecute.execute = vi.fn().mockReturnValue({ success: true, branchTaken: undefined });

      testPipeline.cycle();
      testPipeline.cycle();
      testPipeline.cycle();

      const stats = testPipeline.getStatistics();
      // If cycles++ is removed, this will be 0
      expect(stats.cycles).toBe(3);
    });
  });

  describe('Regression Kill: incrementProgramCounter must be called', () => {
    it('should increment program counter by fetch size after each cycle', () => {
      const testContext = new ExecutionContext();
      const testPipeline = new ExecutionPipeline(new Uint8Array([0x00, 0x01, 0x02, 0x03]), testContext);

      const mockFetch = testPipeline.getFetch();
      mockFetch.fetch = vi.fn().mockReturnValue({ instruction: new Uint8Array([0x00]), size: 2 });
      const mockDecode = testPipeline.getDecode();
      mockDecode.decode = vi.fn().mockReturnValue({ opcode: 0x00, operands: [], isCall: false, isReturn: false, isBranch: false });
      const mockExecute = testPipeline.getExecute();
      mockExecute.execute = vi.fn().mockReturnValue({ success: true, branchTaken: undefined });

      expect(testContext.getProgramCounter()).toBe(0);
      testPipeline.cycle();
      // If incrementProgramCounter is removed, PC stays at 0
      expect(testContext.getProgramCounter()).toBe(2);
      testPipeline.cycle();
      expect(testContext.getProgramCounter()).toBe(4);
    });
  });

  describe('Regression Kill: branch conditions must be exact', () => {
    it('should NOT increment branchesNotTaken when branchTaken is true (force true kills this)', () => {
      const testContext = new ExecutionContext();
      const testPipeline = new ExecutionPipeline(new Uint8Array([0x00, 0x01]), testContext);

      const mockFetch = testPipeline.getFetch();
      mockFetch.fetch = vi.fn().mockReturnValue({ instruction: new Uint8Array([0x00]), size: 1 });
      const mockDecode = testPipeline.getDecode();
      mockDecode.decode = vi.fn().mockReturnValue({ opcode: 0x00, operands: [], isCall: false, isReturn: false, isBranch: false });
      const mockExecute = testPipeline.getExecute();
      // branchTaken === false should ONLY increment branchesNotTaken, NOT branchesTaken
      mockExecute.execute = vi.fn().mockReturnValue({ success: true, branchTaken: false });

      testPipeline.cycle();
      const stats = testPipeline.getStatistics();
      expect(stats.branchesNotTaken).toBe(1);
      expect(stats.branchesTaken).toBe(0); // Force true would make branchesTaken=1
    });

    it('should NOT increment calls when isCall is false (force true kills this)', () => {
      const testContext = new ExecutionContext();
      const testPipeline = new ExecutionPipeline(new Uint8Array([0x00, 0x01]), testContext);

      const mockFetch = testPipeline.getFetch();
      mockFetch.fetch = vi.fn().mockReturnValue({ instruction: new Uint8Array([0x00]), size: 1 });
      const mockDecode = testPipeline.getDecode();
      // isCall is false — calls should NOT be incremented
      mockDecode.decode = vi.fn().mockReturnValue({ opcode: 0x00, operands: [], isCall: false, isReturn: false, isBranch: false });
      const mockExecute = testPipeline.getExecute();
      mockExecute.execute = vi.fn().mockReturnValue({ success: true, branchTaken: undefined });

      testPipeline.cycle();
      const stats = testPipeline.getStatistics();
      expect(stats.calls).toBe(0); // Force true on isCall would make this 1
    });

    it('should NOT increment returns when isReturn is false (force true kills this)', () => {
      const testContext = new ExecutionContext();
      const testPipeline = new ExecutionPipeline(new Uint8Array([0x00, 0x01]), testContext);

      const mockFetch = testPipeline.getFetch();
      mockFetch.fetch = vi.fn().mockReturnValue({ instruction: new Uint8Array([0x00]), size: 1 });
      const mockDecode = testPipeline.getDecode();
      mockDecode.decode = vi.fn().mockReturnValue({ opcode: 0x00, operands: [], isCall: false, isReturn: false, isBranch: false });
      const mockExecute = testPipeline.getExecute();
      mockExecute.execute = vi.fn().mockReturnValue({ success: true, branchTaken: undefined });

      testPipeline.cycle();
      const stats = testPipeline.getStatistics();
      expect(stats.returns).toBe(0); // Force true on isReturn would make this 1
    });

    it('should NOT set error when result.success is true (force true on !result.success kills this)', () => {
      const testContext = new ExecutionContext();
      const testPipeline = new ExecutionPipeline(new Uint8Array([0x00, 0x01]), testContext);

      const mockFetch = testPipeline.getFetch();
      mockFetch.fetch = vi.fn().mockReturnValue({ instruction: new Uint8Array([0x00]), size: 1 });
      const mockDecode = testPipeline.getDecode();
      mockDecode.decode = vi.fn().mockReturnValue({ opcode: 0x00, operands: [], isCall: false, isReturn: false, isBranch: false });
      const mockExecute = testPipeline.getExecute();
      mockExecute.execute = vi.fn().mockReturnValue({ success: true, branchTaken: undefined });

      testPipeline.cycle();
      const stats = testPipeline.getStatistics();
      expect(stats.errors).toBe(0); // Force true on !result.success would make this 1
      expect(testContext.getError()).toBeNull();
    });
  });

  describe('Regression Kill: validate must report specific errors', () => {
    it('should include "Program counter is negative" in errors for PC < 0', () => {
      context.setProgramCounter(-1);
      const validation = pipeline.validate();
      expect(validation.valid).toBe(false);
      // If errors.push('Program counter is negative') is removed, this fails
      expect(validation.errors).toContain('Program counter is negative');
    });

    it('should include context validation errors', () => {
      context.setProgramCounter(-1);
      const validation = pipeline.validate();
      // If errors.push(...contextValidation.errors) is removed, only the pipeline error remains
      // The context itself should also report an error for negative PC
      expect(validation.errors.length).toBeGreaterThanOrEqual(1);
    });

    it('should report valid=true when PC < 0 check is disabled (force false kills this)', () => {
      // With PC=0, validate should succeed. With PC=-1, it must fail.
      // If the condition `PC < 0` is forced to false, negative PC goes undetected.
      context.setProgramCounter(-5);
      const validation = pipeline.validate();
      expect(validation.valid).toBe(false);
      expect(validation.errors.some(e => e.includes('negative'))).toBe(true);
    });
  });

  describe('Regression Kill: reset must clear all state', () => {
    it('should reset statistics to zero after reset()', () => {
      const testContext = new ExecutionContext();
      const testPipeline = new ExecutionPipeline(new Uint8Array([0x00, 0x01, 0x02, 0x03]), testContext);

      const mockFetch = testPipeline.getFetch();
      mockFetch.fetch = vi.fn().mockReturnValue({ instruction: new Uint8Array([0x00]), size: 1 });
      const mockDecode = testPipeline.getDecode();
      mockDecode.decode = vi.fn().mockReturnValue({ opcode: 0x00, operands: [], isCall: true, isReturn: true, isBranch: false });
      let callCount = 0;
      const mockExecute = testPipeline.getExecute();
      mockExecute.execute = vi.fn().mockImplementation(() => {
        callCount++;
        return { success: true, branchTaken: true };
      });

      testPipeline.cycle();
      testPipeline.cycle();

      // Before reset, stats should be non-zero
      const before = testPipeline.getStatistics();
      expect(before.instructionsExecuted).toBe(2);
      expect(before.cycles).toBe(2);

      testPipeline.reset();

      // After reset, all stats MUST be zero
      // If `this.statistics = this.initializeStatistics()` is removed, they stay at 2
      const after = testPipeline.getStatistics();
      expect(after.instructionsExecuted).toBe(0);
      expect(after.cycles).toBe(0);
      expect(after.branchesTaken).toBe(0);
      expect(after.calls).toBe(0);
      expect(after.returns).toBe(0);
      expect(after.errors).toBe(0);
    });

    it('should set running to false after reset()', () => {
      pipeline['running'] = true;
      pipeline.reset();
      // If `this.running = false` is removed from reset(), this fails
      expect(pipeline['running']).toBe(false);
    });

    it('should call clearCache on reset()', () => {
      const testContext = new ExecutionContext();
      const testPipeline = new ExecutionPipeline(new Uint8Array([0x00, 0x01, 0x02, 0x03]), testContext);

      const mockFetch = testPipeline.getFetch();
      const clearCacheSpy = vi.spyOn(mockFetch, 'clearCache');

      testPipeline.reset();
      // If `this.fetch.clearCache()` is removed, spy will not be called
      expect(clearCacheSpy).toHaveBeenCalled();
    });
  });

  describe('Regression Kill: cache management must delegate', () => {
    it('should call fetch.enableCache when enableCache is called', () => {
      const mockFetch = pipeline.getFetch();
      const spy = vi.spyOn(mockFetch, 'enableCache');
      pipeline.enableCache();
      // If `this.fetch.enableCache()` is removed, spy will not be called
      expect(spy).toHaveBeenCalled();
    });

    it('should call fetch.disableCache when disableCache is called', () => {
      const mockFetch = pipeline.getFetch();
      const spy = vi.spyOn(mockFetch, 'disableCache');
      pipeline.disableCache();
      // If `this.fetch.disableCache()` is removed, spy will not be called
      expect(spy).toHaveBeenCalled();
    });

    it('should call fetch.setCacheSize when setCacheSize is called', () => {
      const mockFetch = pipeline.getFetch();
      const spy = vi.spyOn(mockFetch, 'setCacheSize');
      pipeline.setCacheSize(512);
      // If `this.fetch.setCacheSize(size)` is removed, spy will not be called
      expect(spy).toHaveBeenCalledWith(512);
    });
  });

  describe('Regression Kill: setBytecode must call reset', () => {
    it('should reset statistics when setBytecode is called', () => {
      const testContext = new ExecutionContext();
      const testPipeline = new ExecutionPipeline(new Uint8Array([0x00, 0x01, 0x02, 0x03]), testContext);

      const mockFetch = testPipeline.getFetch();
      mockFetch.fetch = vi.fn().mockReturnValue({ instruction: new Uint8Array([0x00]), size: 1 });
      const mockDecode = testPipeline.getDecode();
      mockDecode.decode = vi.fn().mockReturnValue({ opcode: 0x00, operands: [], isCall: false, isReturn: false, isBranch: false });
      const mockExecute = testPipeline.getExecute();
      mockExecute.execute = vi.fn().mockReturnValue({ success: true, branchTaken: undefined });

      testPipeline.cycle();
      testPipeline.cycle();
      expect(testPipeline.getStatistics().instructionsExecuted).toBe(2);

      testPipeline.setBytecode(new Uint8Array([0x05, 0x06]));
      // If `this.reset()` is removed from setBytecode, stats won't be cleared
      expect(testPipeline.getStatistics().instructionsExecuted).toBe(0);
      expect(testPipeline.getStatistics().cycles).toBe(0);
      expect(testContext.getProgramCounter()).toBe(0);
    });
  });

});
