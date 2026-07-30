import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ExecutionPipeline } from '../../../compiler/cvm/execution-pipeline';
import { ExecutionContext } from '../../../compiler/cvm/execution-context';

describe('Execution Pipeline - Regression Detection Tests', () => {
  let context: ExecutionContext;
  let pipeline: ExecutionPipeline;

  beforeEach(() => {
    context = new ExecutionContext();
    pipeline = new ExecutionPipeline(new Uint8Array([0x00, 0x01, 0x02]), context);
  });

  describe('R5: stop() should prevent further cycle execution', () => {
    it('should stop pipeline when running is true', () => {
      // Mock fetch, decode, execute to succeed
      const mockFetch = pipeline.getFetch();
      const originalFetch = mockFetch.fetch.bind(mockFetch);
      mockFetch.fetch = vi.fn().mockReturnValue({
        instruction: new Uint8Array([0x00]),
        size: 1
      });

      const mockDecode = pipeline.getDecode();
      const originalDecode = mockDecode.decode.bind(mockDecode);
      mockDecode.decode = vi.fn().mockReturnValue({
        opcode: 0x00,
        operands: [],
        isCall: false,
        isReturn: false,
        isBranch: false
      });

      const mockExecute = pipeline.getExecute();
      const originalExecute = mockExecute.execute.bind(mockExecute);
      mockExecute.execute = vi.fn().mockReturnValue({
        success: true,
        branchTaken: undefined
      });

      // Set running to true to allow cycle execution
      pipeline['running'] = true;
      
      // Execute one cycle to verify it works
      pipeline.cycle();
      
      const statsBeforeStop = pipeline.getStatistics();
      const cyclesBefore = statsBeforeStop.cycles;
      
      // Stop the pipeline
      pipeline.stop();
      
      // Try to execute more cycles - should not increment cycles
      pipeline.cycle();
      pipeline.cycle();
      pipeline.cycle();
      
      const statsAfterStop = pipeline.getStatistics();
      const cyclesAfter = statsAfterStop.cycles;
      
      // Cycles should not have increased after stop()
      expect(cyclesAfter).toBe(cyclesBefore);

      // Restore originals
      mockFetch.fetch = originalFetch;
      mockDecode.decode = originalDecode;
      mockExecute.execute = originalExecute;
    });
  });

  describe('R10: cycles should increment by exactly 1 per cycle', () => {
    it('should increment cycles from 0 to 1 after one cycle', () => {
      // Mock fetch, decode, execute to succeed
      const mockFetch = pipeline.getFetch();
      const originalFetch = mockFetch.fetch.bind(mockFetch);
      mockFetch.fetch = vi.fn().mockReturnValue({
        instruction: new Uint8Array([0x00]),
        size: 1
      });

      const mockDecode = pipeline.getDecode();
      const originalDecode = mockDecode.decode.bind(mockDecode);
      mockDecode.decode = vi.fn().mockReturnValue({
        opcode: 0x00,
        operands: [],
        isCall: false,
        isReturn: false,
        isBranch: false
      });

      const mockExecute = pipeline.getExecute();
      const originalExecute = mockExecute.execute.bind(mockExecute);
      mockExecute.execute = vi.fn().mockReturnValue({
        success: true,
        branchTaken: undefined
      });

      // Set running to true to allow cycle execution
      pipeline['running'] = true;
      
      const statsBefore = pipeline.getStatistics();
      expect(statsBefore.cycles).toBe(0);
      
      // Execute one cycle
      pipeline.cycle();
      
      const statsAfter = pipeline.getStatistics();
      
      // Cycles should be exactly 1 after one cycle
      expect(statsAfter.cycles).toBe(1);

      // Restore originals
      mockFetch.fetch = originalFetch;
      mockDecode.decode = originalDecode;
      mockExecute.execute = originalExecute;
    });
    
    it('should increment cycles by exactly 1 for each cycle', () => {
      // Mock fetch, decode, execute to succeed
      const mockFetch = pipeline.getFetch();
      const originalFetch = mockFetch.fetch.bind(mockFetch);
      mockFetch.fetch = vi.fn().mockReturnValue({
        instruction: new Uint8Array([0x00]),
        size: 1
      });

      const mockDecode = pipeline.getDecode();
      const originalDecode = mockDecode.decode.bind(mockDecode);
      mockDecode.decode = vi.fn().mockReturnValue({
        opcode: 0x00,
        operands: [],
        isCall: false,
        isReturn: false,
        isBranch: false
      });

      const mockExecute = pipeline.getExecute();
      const originalExecute = mockExecute.execute.bind(mockExecute);
      mockExecute.execute = vi.fn().mockReturnValue({
        success: true,
        branchTaken: undefined
      });

      // Set running to true to allow cycle execution
      pipeline['running'] = true;
      
      const statsBefore = pipeline.getStatistics();
      const cyclesBefore = statsBefore.cycles;
      
      // Execute 5 cycles
      for (let i = 0; i < 5; i++) {
        pipeline.cycle();
      }
      
      const statsAfter = pipeline.getStatistics();
      const cyclesAfter = statsAfter.cycles;
      
      // Cycles should be exactly 5 more than before
      expect(cyclesAfter).toBe(cyclesBefore + 5);

      // Restore originals
      mockFetch.fetch = originalFetch;
      mockDecode.decode = originalDecode;
      mockExecute.execute = originalExecute;
    });
  });

  describe('R19: reset() should reset all statistics to zero', () => {
    it('should reset statistics when they are non-zero', () => {
      // Set running to true to allow cycle execution
      pipeline['running'] = true;
      
      // Execute cycles to accumulate non-zero statistics
      for (let i = 0; i < 10; i++) {
        try {
          pipeline.cycle();
        } catch (e) {
          // Invalid bytecode - ignore
        }
      }
      
      const statsBeforeReset = pipeline.getStatistics();
      
      // Manually set some statistics to non-zero values to ensure they are tested
      pipeline['statistics'].branchesTaken = 5;
      pipeline['statistics'].branchesNotTaken = 3;
      pipeline['statistics'].calls = 2;
      pipeline['statistics'].returns = 1;
      pipeline['statistics'].errors = 4;
      
      const statsBeforeManual = pipeline.getStatistics();
      expect(statsBeforeManual.branchesTaken).toBe(5);
      expect(statsBeforeManual.branchesNotTaken).toBe(3);
      expect(statsBeforeManual.calls).toBe(2);
      expect(statsBeforeManual.returns).toBe(1);
      expect(statsBeforeManual.errors).toBe(4);
      
      // Reset
      pipeline.reset();
      
      // Verify ALL statistics are zero
      const statsAfterReset = pipeline.getStatistics();
      expect(statsAfterReset.instructionsExecuted).toBe(0);
      expect(statsAfterReset.cycles).toBe(0);
      expect(statsAfterReset.branchesTaken).toBe(0);
      expect(statsAfterReset.branchesNotTaken).toBe(0);
      expect(statsAfterReset.calls).toBe(0);
      expect(statsAfterReset.returns).toBe(0);
      expect(statsAfterReset.errors).toBe(0);
    });
  });
});
