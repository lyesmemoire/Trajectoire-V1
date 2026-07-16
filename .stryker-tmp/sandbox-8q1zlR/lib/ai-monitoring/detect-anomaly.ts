// @ts-nocheck
import prisma from "@/lib/prisma";

/**
 * Detects abnormal AI usage patterns.
 */
export async function detectAIAnomalies() {
  const logs = await prisma.aIUsageLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const anomalies = [];

  // 1. Latency Anomaly (> 5s)
  const slowCalls = logs.filter((l) => l.latencyMs > 5000);
  if (slowCalls.length > 0) {
    anomalies.push({
      type: "latency",
      severity: "medium",
      message: `${slowCalls.length} calls exceeded 5s latency.`,
    });
  }

  // 2. High Cost Anomaly (> 0.50$ for a single call)
  const expensiveCalls = logs.filter((l) => l.costUsd > 0.5);
  if (expensiveCalls.length > 0) {
    anomalies.push({
      type: "cost",
      severity: "high",
      message: `${expensiveCalls.length} calls exceeded 0.50$ per invocation.`,
    });
  }

  // 3. Failure Rate Anomaly (> 10% in last 100 calls)
  const failures = logs.filter((l) => l.failureType);
  if (failures.length > 10) {
    anomalies.push({
      type: "failure_rate",
      severity: "high",
      message: `Failure rate is above 10% for the last 100 calls.`,
    });
  }

  return anomalies;
}
