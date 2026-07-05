
import { LoggerProvider } from "@/lib/core/observability/logger";

export interface LLMTrace {
  sessionId?: string;
  userId: string;
  endpoint: string;
  model: string;
  promptTokens: number;
  completionTokens: number;
  latencyMs: number;
  status: "success" | "error";
  metadata?: any;
}

/**
 * Logs an LLM interaction for performance and quality monitoring.
 */
export async function logLLMTrace(trace: LLMTrace) {
  // We can store this in a dedicated monitoring table or simple audit log
  LoggerProvider.getLogger().debug(
    `[LLM Trace] ${trace.endpoint} | ${trace.model} | ${trace.latencyMs}ms | ${trace.status}`,
    { userId: trace.userId, sessionId: trace.sessionId }
  );

  // Example storage logic (if table exists)
  /*
  await prisma.aIUsageStats.create({
    data: {
      userId: trace.userId,
      endpoint: trace.endpoint,
      model: trace.model,
      tokens: trace.promptTokens + trace.completionTokens,
      latency: trace.latencyMs,
      status: trace.status
    }
  });
  */
}
