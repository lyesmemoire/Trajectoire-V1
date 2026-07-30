import { describe, it, expect, beforeEach } from 'vitest';
import { ExecutionPipeline } from '../../../compiler/cvm/execution-pipeline';
import { ExecutionContext } from '../../../compiler/cvm/execution-context';

describe('Execution Pipeline - R5 Minimal Test', () => {
  let context: ExecutionContext;
  let pipeline: ExecutionPipeline;

  beforeEach(() => {
    context = new ExecutionContext();
    pipeline = new ExecutionPipeline(new Uint8Array([0x00, 0x01, 0x02]), context);
  });

  describe('R5: stop() should set running flag to false', () => {
    it('should set running to false when stop() is called', () => {
      // Set running to true manually
      pipeline['running'] = true;
      expect(pipeline['running']).toBe(true);

      // Stop the pipeline
      pipeline.stop();

      // Verify running is false
      expect(pipeline['running']).toBe(false);
    });
  });

  describe('R5: stop() should prevent runCycles() from executing cycles', () => {
    it('should prevent runCycles() from executing cycles when running is false', () => {
      // Stop the pipeline
      pipeline.stop();

      // Try to run 10 cycles - should execute 0 cycles because running is false
      const stats = pipeline.runCycles(10);
      expect(stats.cycles).toBe(0);
    });
  });
});
