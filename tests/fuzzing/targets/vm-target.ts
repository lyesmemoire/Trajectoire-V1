import { FuzzTarget, FuzzResult } from '../engine/interfaces';
import { ExecutionPipeline } from '../../../compiler/cvm/execution-pipeline';

export class VMTarget implements FuzzTarget {
  name = 'VMTarget';
  private pipeline: ExecutionPipeline;

  constructor() {
    this.pipeline = new ExecutionPipeline(1024, 1024);
  }

  async initialize(): Promise<void> {
    // any startup logic
  }

  async execute(input: Uint8Array): Promise<FuzzResult> {
    const start = Date.now();
    try {
      this.pipeline.execute(input);
      return { executionTimeMs: Date.now() - start };
    } catch (error: any) {
      return { executionTimeMs: Date.now() - start, error };
    }
  }

  async shutdown(): Promise<void> {
    // any cleanup logic
  }
}
