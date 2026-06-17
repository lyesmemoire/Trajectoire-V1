import { runtime_replay_validations_total } from "../fsm/metrics/RuntimeMetrics";
import type { RuntimeValidationResult } from "./types";

export class ValidationMetricsBridge {
  static recordFSM(_result: RuntimeValidationResult) {
    // Metric `runtime_fsm_errors_total` was removed to avoid registry conflict.
    // FSM validation results are logged but not metered individually.
  }

  static recordReplay(_result: RuntimeValidationResult) {
    // Count every replay validation attempt
    runtime_replay_validations_total.inc();
  }

  /** Record a single validation issue by type and severity */
  static recordIssue(_type: string, _severity: string) {
    // Placeholder – granular issue metrics can be added when needed.
  }
}
