/**
 * Liveness Check
 * Checks if the application is running (lightweight check)
 */

import { CheckResult } from "./health-check";
import { LoggerProvider } from "@/lib/core/observability/logger";

const logger = LoggerProvider.getLogger();

export async function livenessCheck(): Promise<CheckResult> {
  try {
    // Simple liveness check - just verify the process is running
    // This is intentionally lightweight to avoid false positives
    const uptime = process.uptime();
    
    if (uptime < 0) {
      return {
        status: "fail",
        message: "Invalid uptime",
      };
    }

    return {
      status: "pass",
      message: "Application is running",
      metadata: {
        uptime: Math.floor(uptime),
        memory: process.memoryUsage(),
      },
    };
  } catch (error) {
    logger.error("Liveness check failed", { error });
    return {
      status: "fail",
      message: error instanceof Error ? error.message : "Liveness check failed",
    };
  }
}
