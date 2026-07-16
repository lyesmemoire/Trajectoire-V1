/**
 * Intelligence Use Case
 * 
 * Orchestrates the intelligence engine execution:
 * - Validation
 * - Context construction
 * - Provider call
 * - Result transformation
 * 
 * Does not depend on Next, Supabase, React, or EventBus.
 */

import type { IntelligenceRequest } from "../domain/contracts/intelligence-request";
import type { IntelligenceResponse as IntelligenceResponseContract } from "../domain/contracts/intelligence-response";
import type { IntelligenceProviderPort } from "../domain/ports/intelligence-provider.port";
import {
  ValidationError,
  ProviderError,
  EngineExecutionError,
  TimeoutError,
} from "../domain/contracts/intelligence-errors";

export class IntelligenceUseCase<TInput = unknown, TOutput = unknown> {
  constructor(
    private readonly provider: IntelligenceProviderPort,
    private readonly promptTemplate: string
  ) {}

  /**
   * Execute the intelligence request
   */
  async execute(request: IntelligenceRequest<TInput>): Promise<IntelligenceResponseContract<TOutput>> {
    const startTime = Date.now();

    try {
      // Validate request
      this.validateRequest(request);

      // Build prompt variables from context
      const variables = this.buildPromptVariables(request);

      // Execute provider call
      const providerResult = await this.executeProvider(request, variables);

      // Transform result
      const response = this.transformResult(request, providerResult, startTime);

      return response;
    } catch (error) {
      // Handle errors
      return this.handleError(request, error as Error, startTime);
    }
  }

  /**
   * Validate the request
   */
  private validateRequest(request: IntelligenceRequest<TInput>): void {
    if (!request.id) {
      throw new ValidationError("Request id is required");
    }

    if (!request.type) {
      throw new ValidationError("Request type is required");
    }

    if (!request.input) {
      throw new ValidationError("Request input is required");
    }

    if (!request.context) {
      throw new ValidationError("Request context is required");
    }

    if (!request.options) {
      throw new ValidationError("Request options is required");
    }

    if (!request.options.provider) {
      throw new ValidationError("Provider is required in options");
    }

    if (!request.options.model) {
      throw new ValidationError("Model is required in options");
    }
  }

  /**
   * Build prompt variables from request context
   */
  private buildPromptVariables(request: IntelligenceRequest<TInput>): Record<string, unknown> {
    const variables: Record<string, unknown> = {
      input: request.input,
      candidateProfile: JSON.stringify(request.context.candidateProfile),
      historicalObservations: request.context.historicalObservations.join("\n"),
      currentGoals: request.context.currentGoals.join("\n"),
      recentInsights: request.context.recentInsights.join("\n"),
    };

    // Add engine-specific context if present
    if (request.context.engineContext) {
      Object.assign(variables, request.context.engineContext);
    }

    return variables;
  }

  /**
   * Execute the provider call with timeout
   */
  private async executeProvider(
    request: IntelligenceRequest<TInput>,
    variables: Record<string, unknown>
  ): Promise<unknown> {
    const timeout = request.options.timeout || 30000; // Default 30s

    // Create timeout promise
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new TimeoutError(`Request timed out after ${timeout}ms`));
      }, timeout);
    });

    // Race between provider call and timeout
    try {
      const result = await Promise.race([
        this.provider.execute<unknown>(this.promptTemplate, variables, {
          provider: request.options.provider,
          model: request.options.model,
          temperature: request.options.temperature,
          maxTokens: request.options.maxTokens,
          timeout: request.options.timeout,
        }),
        timeoutPromise,
      ]);

      return result;
    } catch (error) {
      if (error instanceof TimeoutError) {
        throw error;
      }

      throw new ProviderError(
        `Provider execution failed: ${(error as Error).message}`,
        { originalError: (error as Error).message }
      );
    }
  }

  /**
   * Transform provider result to response
   */
  private transformResult(
    request: IntelligenceRequest<TInput>,
    providerResult: unknown,
    startTime: number
  ): IntelligenceResponseContract<TOutput> {
    const result = providerResult as {
      success: boolean;
      data?: TOutput;
      error?: { code: string; message: string };
      metrics?: { latency: number; totalTokens: number; cost: number };
    };

    if (!result.success || !result.data) {
      throw new EngineExecutionError(
        result.error?.message || "Provider returned unsuccessful result",
        { code: result.error?.code }
      );
    }

    const duration = Date.now() - startTime;

    return {
      id: request.id,
      type: request.type,
      output: result.data,
      metadata: {
        processedAt: new Date().toISOString(),
        duration,
        provider: request.options.provider,
        model: request.options.model,
        totalTokens: result.metrics?.totalTokens,
        cost: result.metrics?.cost,
      },
      success: true,
    };
  }

  /**
   * Handle errors and return error response
   */
  private handleError(
    request: IntelligenceRequest<TInput>,
    error: Error,
    startTime: number
  ): IntelligenceResponseContract<TOutput> {
    const duration = Date.now() - startTime;

    let errorContract = {
      code: "UNKNOWN_ERROR",
      message: error.message,
    };

    if (error instanceof ValidationError || 
        error instanceof ProviderError || 
        error instanceof EngineExecutionError || 
        error instanceof TimeoutError) {
      errorContract = {
        code: error.code,
        message: error.message,
      };
    }

    return {
      id: request.id,
      type: request.type,
      output: undefined as TOutput,
      metadata: {
        processedAt: new Date().toISOString(),
        duration,
        provider: request.options.provider,
        model: request.options.model,
      },
      success: false,
      error: errorContract,
    };
  }
}
