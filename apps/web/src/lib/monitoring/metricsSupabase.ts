/**
 * Persistent AI monitoring metrics.
 *
 * Historical note:
 * This module keeps its original filename to avoid unnecessary
 * import churn.
 *
 * Legacy Supabase tables removed:
 * - ai_metrics
 * - error_logs
 *
 * Canonical persistence:
 * Prisma AIUsageLog -> public."AIUsageLog"
 */

import { prisma } from "@/lib/prisma";
import { logError } from "@/lib/logger/Logger";


export async function recordAIRequest(
  latency: number,
  promptTokens: number,
  completionTokens: number,
  totalTokens: number,
  model: string,
  userId?: string,
  context?: string
): Promise<void> {
  try {
    /**
     * `totalTokens` is kept in the public function contract because
     * callers already provide it.
     *
     * AIUsageLog stores input/output separately, therefore the total
     * is derived when statistics are read.
     */
    void totalTokens;

    await prisma.aIUsageLog.create({
      data: {
        userId: userId ?? null,
        provider: "openai",
        model,
        feature: context ?? "unknown",
        tokensInput: promptTokens,
        tokensOutput: completionTokens,
        latencyMs: latency,

        /**
         * This legacy metrics API did not provide monetary cost.
         * Do not invent a cost during the migration.
         */
        costUsd: 0,

        cacheHit: false,
      },
    });
  } catch (error) {
    logError("Failed to record AI metrics", error);
  }
}


export async function recordError(
  type: string,
  message: string,
  userId?: string,
  context?: string
): Promise<void> {
  try {
    /**
     * AIUsageLog is the canonical AI observability store.
     *
     * The old error_logs table had free-form messages.
     * The canonical schema only exposes failureType, so preserve
     * the error category there and put the message into feature
     * without changing the Prisma schema during this migration.
     */
    await prisma.aIUsageLog.create({
      data: {
        userId: userId ?? null,
        provider: "openai",
        model: "unknown",
        feature: context
          ? `${context}: ${message}`
          : message,
        tokensInput: 0,
        tokensOutput: 0,
        latencyMs: 0,
        costUsd: 0,
        cacheHit: false,
        failureType: type,
      },
    });
  } catch (error) {
    logError("Failed to record AI error", error);
  }
}


export async function getLatencyStats(
  userId?: string,
  days: number = 7
): Promise<{
  avg: number;
  min: number;
  max: number;
  p50: number;
  p95: number;
  p99: number;
} | null> {
  const startDate = new Date();

  startDate.setDate(
    startDate.getDate() - days
  );

  try {
    const rows =
      await prisma.aIUsageLog.findMany({
        where: {
          ...(userId
            ? {
                userId,
              }
            : {}),

          createdAt: {
            gte: startDate,
          },

          failureType: null,
        },

        select: {
          latencyMs: true,
        },

        orderBy: {
          latencyMs: "asc",
        },
      });

    if (rows.length === 0) {
      return null;
    }

    const latencies = rows.map(
      (row) => row.latencyMs
    );

    const sum = latencies.reduce(
      (total, latency) =>
        total + latency,
      0
    );

    const percentile = (
      value: number
    ): number => {
      const index = Math.min(
        latencies.length - 1,
        Math.floor(
          latencies.length * value
        )
      );

      return latencies[index] ?? 0;
    };

    return {
      avg: sum / latencies.length,
      min: latencies[0] ?? 0,
      max:
        latencies[
          latencies.length - 1
        ] ?? 0,
      p50: percentile(0.5),
      p95: percentile(0.95),
      p99: percentile(0.99),
    };
  } catch (error) {
    logError(
      "Failed to get latency stats",
      error
    );

    return null;
  }
}


export async function getTokenStats(
  userId?: string,
  days: number = 7
): Promise<{
  totalPromptTokens: number;
  totalCompletionTokens: number;
  totalTokens: number;
  avgTokensPerRequest: number;
} | null> {
  const startDate = new Date();

  startDate.setDate(
    startDate.getDate() - days
  );

  try {
    const rows =
      await prisma.aIUsageLog.findMany({
        where: {
          ...(userId
            ? {
                userId,
              }
            : {}),

          createdAt: {
            gte: startDate,
          },

          failureType: null,
        },

        select: {
          tokensInput: true,
          tokensOutput: true,
        },
      });

    if (rows.length === 0) {
      return null;
    }

    const totalPromptTokens =
      rows.reduce(
        (sum, row) =>
          sum + row.tokensInput,
        0
      );

    const totalCompletionTokens =
      rows.reduce(
        (sum, row) =>
          sum + row.tokensOutput,
        0
      );

    const totalTokens =
      totalPromptTokens +
      totalCompletionTokens;

    return {
      totalPromptTokens,
      totalCompletionTokens,
      totalTokens,
      avgTokensPerRequest:
        totalTokens / rows.length,
    };
  } catch (error) {
    logError(
      "Failed to get token stats",
      error
    );

    return null;
  }
}


export async function getErrorCounts(
  userId?: string,
  days: number = 7
): Promise<Record<string, number>> {
  const startDate = new Date();

  startDate.setDate(
    startDate.getDate() - days
  );

  try {
    const rows =
      await prisma.aIUsageLog.findMany({
        where: {
          ...(userId
            ? {
                userId,
              }
            : {}),

          createdAt: {
            gte: startDate,
          },

          failureType: {
            not: null,
          },
        },

        select: {
          failureType: true,
        },
      });

    const counts: Record<
      string,
      number
    > = {};

    for (const row of rows) {
      if (!row.failureType) {
        continue;
      }

      counts[row.failureType] =
        (counts[row.failureType] ?? 0) +
        1;
    }

    return counts;
  } catch (error) {
    logError(
      "Failed to get error counts",
      error
    );

    return {};
  }
}
