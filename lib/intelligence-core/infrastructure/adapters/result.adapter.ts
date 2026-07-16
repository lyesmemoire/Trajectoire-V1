/**
 * Result Adapter
 * 
 * Adapts provider results to domain contracts.
 * Handles transformation between provider-specific formats and domain DTOs.
 */

import type { ProviderResult } from "../../domain/ports/intelligence-provider.port";
import type { IntelligenceResponse } from "../../domain/contracts/intelligence-response";

export class ResultAdapter {
  /**
   * Adapt provider result to intelligence response
   */
  static adapt<TOutput = unknown>(
    providerResult: ProviderResult<TOutput>,
    requestId: string,
    requestType: string,
    provider: "openai" | "anthropic",
    model: string
  ): IntelligenceResponse<TOutput> {
    if (!providerResult.success || !providerResult.data) {
      return {
        id: requestId,
        type: requestType,
        output: undefined as TOutput,
        metadata: {
          processedAt: new Date().toISOString(),
          duration: providerResult.metrics?.latency || 0,
          provider,
          model,
          totalTokens: providerResult.metrics?.totalTokens,
          cost: providerResult.metrics?.cost,
        },
        success: false,
        error: providerResult.error
          ? {
              code: providerResult.error.code,
              message: providerResult.error.message,
              details: providerResult.error.details,
            }
          : {
              code: "UNKNOWN_ERROR",
              message: "Provider returned unsuccessful result",
            },
      };
    }

    return {
      id: requestId,
      type: requestType,
      output: providerResult.data,
      metadata: {
        processedAt: new Date().toISOString(),
        duration: providerResult.metrics?.latency || 0,
        provider,
        model,
        totalTokens: providerResult.metrics?.totalTokens,
        cost: providerResult.metrics?.cost,
        additional: {
          promptTokens: providerResult.metrics?.promptTokens,
          completionTokens: providerResult.metrics?.completionTokens,
        },
      },
      success: true,
    };
  }

  /**
   * Adapt error to intelligence error contract
   */
  static adaptError(error: Error): {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  } {
    return {
      code: "UNKNOWN_ERROR",
      message: error.message,
      details: {
        name: error.name,
        stack: error.stack,
      },
    };
  }
}
