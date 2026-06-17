export class MetricFaultBridge {
  static evaluate(metrics: Record<string, number>) {
    const faults: any[] = [];

    if ((metrics.runtime_backpressure_drop_total || 0) > 0) {
      faults.push({
        domain: "BACKPRESSURE",
        severity: "CRITICAL",
        message: "Backpressure drops detected",
      });
    }

    if ((metrics.runtime_fsm_guard_rejections_total || 0) > 100) {
      faults.push({
        domain: "ORDERING",
        severity: "WARN",
        message: "High guard rejection rate",
      });
    }

    if ((metrics.runtime_circuit_state_total || 0) > 3) {
      faults.push({
        domain: "CIRCUIT",
        severity: "CRITICAL",
        message: "Circuit instability detected",
      });
    }

    return faults;
  }
}
