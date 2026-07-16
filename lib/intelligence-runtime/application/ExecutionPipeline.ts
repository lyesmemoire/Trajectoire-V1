/**
 * ExecutionPipeline
 *
 * Orchestrates execution pipeline: Context → UseCase → Provider → Result → Event Publishing
 * No Forecast-specific logic, pure orchestration.
 */

import { RuntimeContext } from "../domain/context/RuntimeContext";

export interface ExecutionStage<TInput, TOutput> {
  name: string;
  execute: (input: TInput, context: RuntimeContext) => Promise<TOutput>;
}

export interface ExecutionMiddleware {
  name: string;
  before?: (input: unknown, context: RuntimeContext) => Promise<unknown>;
  after?: (output: unknown, context: RuntimeContext) => Promise<unknown>;
  onError?: (error: Error, context: RuntimeContext) => Promise<void>;
}

export interface PipelineOptions {
  middleware?: ExecutionMiddleware[];
}

export class ExecutionPipeline {
  private middleware: ExecutionMiddleware[] = [];

  constructor(options?: PipelineOptions) {
    this.middleware = options?.middleware ?? [];
  }

  /**
   * Execute pipeline with stages
   * @param input - Pipeline input
   * @param stages - Pipeline stages
   * @param context - Runtime context
   * @returns Pipeline output
   */
  async execute<TInput, TOutput>(
    input: TInput,
    stages: ExecutionStage<TInput, TOutput>[],
    context: RuntimeContext
  ): Promise<TOutput> {
    let currentInput: unknown = input;

    try {
      // Apply before middleware
      for (const middleware of this.middleware) {
        if (middleware.before) {
          currentInput = await middleware.before(currentInput, context);
        }
      }

      // Execute stages sequentially
      let currentOutput: unknown = currentInput;
      for (const stage of stages) {
        currentOutput = await stage.execute(currentOutput as TInput, context);
      }

      // Apply after middleware
      for (const middleware of this.middleware) {
        if (middleware.after) {
          currentOutput = await middleware.after(currentOutput, context);
        }
      }

      return currentOutput as TOutput;
    } catch (error) {
      // Apply error middleware
      for (const middleware of this.middleware) {
        if (middleware.onError) {
          await middleware.onError(error as Error, context);
        }
      }
      throw error;
    }
  }

  /**
   * Add middleware to pipeline
   * @param middleware - Middleware to add
   * @returns Updated pipeline
   */
  use(middleware: ExecutionMiddleware): ExecutionPipeline {
    this.middleware.push(middleware);
    return this;
  }

  /**
   * Create pipeline from config
   * @param config - Pipeline configuration
   * @returns Configured pipeline
   */
  static fromConfig<TInput, TOutput>(
    config: PipelineOptions
  ): ExecutionPipeline {
    return new ExecutionPipeline(config);
  }

  /**
   * Clear all middleware
   */
  clearMiddleware(): void {
    this.middleware = [];
  }

  /**
   * Get middleware count
   * @returns Number of middleware
   */
  getMiddlewareCount(): number {
    return this.middleware.length;
  }
}
