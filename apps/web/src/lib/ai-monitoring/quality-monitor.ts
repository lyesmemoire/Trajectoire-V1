import prisma from "@/lib/prisma";
import { logInfo } from "@/lib/logger/Logger";

export interface AIQualityMetric {
  sessionId: string;
  userId: string;
  model: string;
  feature: string;
  confidenceScore: number;
  driftDetected: boolean;
  timestamp: string;
}

/**
 * Monitors the quality and behavioral consistency of AI outputs.
 */
export const AIQualityMonitor = {
  logMetric: async (metric: AIQualityMetric) => {
    logInfo(
      `[AI Quality] Feature: ${metric.feature} | Drift: ${metric.driftDetected} | Conf: ${metric.confidenceScore}`,
    );

    // We update the existing AIUsageLog to include quality metrics
    await prisma.aIUsageLog
      .create({
        data: {
          userId: metric.userId,
          sessionId: metric.sessionId,
          provider: "OpenAI",
          model: metric.model,
          feature: metric.feature,
          tokensInput: 0, // Placeholder
          tokensOutput: 0,
          latencyMs: 0,
          costUsd: 0,
          confidenceScore: metric.confidenceScore,
          failureType: metric.driftDetected ? "behavioral_drift" : null,
        },
      })
      .catch(() => {});
  },
};
