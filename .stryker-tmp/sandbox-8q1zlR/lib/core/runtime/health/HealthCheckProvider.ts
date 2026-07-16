// @ts-nocheck
export interface HealthCheck {
  name: string;
  check(): Promise<HealthStatus>;
}

export interface HealthStatus {
  healthy: boolean;
  latencyMs?: number;
  message?: string;
}

export interface AggregatedHealth {
  healthy: boolean;
  checks: Record<string, HealthStatus>;
  timestamp: Date;
}

/**
 * Aggregates multiple health checks into a single report.
 * Each external dependency (Stripe, Supabase, OpenAI, Redis, etc.)
 * registers a HealthCheck instance.
 */
export class HealthCheckProvider {
  private checks: HealthCheck[] = [];

  register(check: HealthCheck): void {
    this.checks.push(check);
  }

  async checkAll(): Promise<AggregatedHealth> {
    const results: Record<string, HealthStatus> = {};
    let allHealthy = true;

    for (const check of this.checks) {
      const start = Date.now();
      try {
        const status = await check.check();
        status.latencyMs = Date.now() - start;
        results[check.name] = status;
        if (!status.healthy) allHealthy = false;
      } catch (error: any) {
        results[check.name] = {
          healthy: false,
          latencyMs: Date.now() - start,
          message: error.message,
        };
        allHealthy = false;
      }
    }

    return {
      healthy: allHealthy,
      checks: results,
      timestamp: new Date(),
    };
  }
}
