import { registry } from "../fsm/metrics/RuntimeMetrics";

export type AlertSeverity = "info" | "warning" | "critical";

export interface Alert {
  name: string;
  severity: AlertSeverity;
  message: string;
  timestamp: number;
  value?: number;
}

export class RuntimeAlertEngine {
  private alerts: Alert[] = [];

  public async evaluate(): Promise<Alert[]> {
    const metricsText = await registry.metrics();
    const alerts: Alert[] = [];

    // FSM latency
    const latencyMatch = metricsText.match(/runtime_fsm_transition_duration_ms_sum[\s\S]*?(\d+\.\d+)/);
    if (latencyMatch) {
      const latency = parseFloat(latencyMatch[1]!);
      if (latency > 1000) {
        alerts.push({ name: "FSM_LATENCY_HIGH", severity: "critical", message: "FSM transition latency too high", timestamp: Date.now(), value: latency });
      } else if (latency > 250) {
        alerts.push({ name: "FSM_LATENCY_ELEVATED", severity: "warning", message: "FSM latency elevated", timestamp: Date.now(), value: latency });
      }
    }

    // Validation errors
    const validationMatch = metricsText.match(/runtime_validation_issues_total.*?(\d+)$/m);
    if (validationMatch) {
      const errors = parseInt(validationMatch[1]!, 10);
      if (errors > 100) {
        alerts.push({ name: "VALIDATION_ERRORS_HIGH", severity: "critical", message: "Too many validation errors", timestamp: Date.now(), value: errors });
      } else if (errors > 20) {
        alerts.push({ name: "VALIDATION_ERRORS_SPIKE", severity: "warning", message: "Validation error spike detected", timestamp: Date.now(), value: errors });
      }
    }

    // Guard rejections
    const guardMatch = metricsText.match(/runtime_fsm_guard_rejections_total.*?(\d+)$/m);
    if (guardMatch) {
      const guards = parseInt(guardMatch[1]!, 10);
      if (guards > 50) {
        alerts.push({ name: "GUARD_REJECTIONS_HIGH", severity: "warning", message: "High guard rejection rate", timestamp: Date.now(), value: guards });
      }
    }

    this.alerts = alerts;
    return alerts;
  }

  public getLastAlerts(): Alert[] {
    return this.alerts;
  }
}
