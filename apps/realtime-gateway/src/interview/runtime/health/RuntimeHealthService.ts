import { registry } from "../fsm/metrics/RuntimeMetrics";
import type { ValidationResult } from "../validation/RuntimeValidationSystem";

export interface RuntimeHealthSnapshot {
  status: "healthy" | "degraded" | "unhealthy";
  timestamp: number;

  metrics: {
    metricsCount: number;
    uptime: number;
  };

  validation?: {
    ok: boolean;
    errorCount: number;
    warningCount: number;
  };
}

export class RuntimeHealthService {
  private startTime = Date.now();

  public async getHealth(validation?: ValidationResult): Promise<RuntimeHealthSnapshot> {
    const metrics = await this.collectMetrics();

    const errorCount = validation?.errors.length ?? 0;
    const warningCount = validation?.warnings.length ?? 0;

    const status =
      errorCount > 0 ? "unhealthy" :
      warningCount > 0 ? "degraded" :
      "healthy";

    const result: RuntimeHealthSnapshot = {
      status,
      timestamp: Date.now(),
      metrics: {
        metricsCount: metrics,
        uptime: Date.now() - this.startTime,
      },
    };
    if (validation) {
      result.validation = { ok: validation.ok, errorCount, warningCount };
    }
    return result;
  }

  private async collectMetrics(): Promise<number> {
    const metricsText = await registry.metrics();
    return metricsText.split("\n").length;
  }
}
