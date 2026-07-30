import prisma from "@/lib/prisma";

export interface TrackAIUsageInput {
  userId?: string;
  sessionId?: string;
  provider: string;
  model: string;
  feature: string;
  tokensInput: number;
  tokensOutput: number;
  latencyMs: number;
  costUsd: number;
  cacheHit?: boolean;
}

/**
 * Persists AI usage logs for cost analysis and observability.
 */
export async function trackAIUsage(input: _TrackAIUsageInput) {
  try {
    return await prisma.aIUsageLog.create({
      data: {
        userId: input.userId,
        sessionId: input.sessionId,
        provider: input.provider,
        model: input.model,
        feature: input.feature,
        tokensInput: input.tokensInput,
        tokensOutput: input.tokensOutput,
        latencyMs: input.latencyMs,
        costUsd: input.costUsd,
        cacheHit: input.cacheHit ?? false,
      },
    });
  } catch (error) {
    console.error("[trackAIUsage Error]:", error);
  }
}
