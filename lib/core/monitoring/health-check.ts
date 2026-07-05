/**
 * Health Check
 * Provides health check endpoints for monitoring
 */

import { LoggerProvider } from "@/lib/core/observability/logger";

const logger = LoggerProvider.getLogger();

export interface HealthCheckResult {
  status: "healthy" | "unhealthy" | "degraded";
  checks: Record<string, CheckResult>;
  timestamp: Date;
}

export interface CheckResult {
  status: "pass" | "fail" | "warn";
  message?: string;
  duration?: number;
  metadata?: Record<string, any>;
}

export class HealthChecker {
  private checks: Map<string, () => Promise<CheckResult>> = new Map();

  /**
   * Register a health check
   */
  register(name: string, check: () => Promise<CheckResult>): void {
    this.checks.set(name, check);
  }

  /**
   * Run all health checks
   */
  async check(): Promise<HealthCheckResult> {
    const results: Record<string, CheckResult> = {};
    let overallStatus: "healthy" | "unhealthy" | "degraded" = "healthy";

    for (const [name, checkFn] of this.checks.entries()) {
      try {
        const startTime = Date.now();
        const result = await checkFn();
        const duration = Date.now() - startTime;
        
        results[name] = {
          ...result,
          duration,
        };

        if (result.status === "fail") {
          overallStatus = "unhealthy";
        } else if (result.status === "warn" && overallStatus !== "unhealthy") {
          overallStatus = "degraded";
        }
      } catch (error) {
        results[name] = {
          status: "fail",
          message: error instanceof Error ? error.message : "Unknown error",
        };
        overallStatus = "unhealthy";
      }
    }

    logger.info("Health check completed", { status: overallStatus, checks: results });

    return {
      status: overallStatus,
      checks: results,
      timestamp: new Date(),
    };
  }

  /**
   * Run a specific health check
   */
  async checkName(name: string): Promise<CheckResult> {
    const checkFn = this.checks.get(name);
    if (!checkFn) {
      return {
        status: "fail",
        message: `Check '${name}' not found`,
      };
    }

    try {
      const startTime = Date.now();
      const result = await checkFn();
      const duration = Date.now() - startTime;
      
      return {
        ...result,
        duration,
      };
    } catch (error) {
      return {
        status: "fail",
        message: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}

// Singleton instance
let healthChecker: HealthChecker | null = null;

export function getHealthChecker(): HealthChecker {
  if (!healthChecker) {
    healthChecker = new HealthChecker();
  }
  return healthChecker;
}
