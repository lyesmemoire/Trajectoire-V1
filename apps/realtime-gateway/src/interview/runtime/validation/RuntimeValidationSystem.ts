import { ValidationMetricsBridge } from "./ValidationMetricsBridge";
import type { ReplaySnapshot } from "../fsm/orchestrator/ReplaySnapshot";
import { runtime_validation_duration_ms } from "../fsm/metrics/RuntimeMetrics";

export type ValidationSeverity = "error" | "warning";

export interface ValidationIssue {
  type: string;
  message: string;
  severity: ValidationSeverity;
}

export interface ValidationResult {
  ok: boolean;
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
}

export class RuntimeValidationSystem {
  // No constructor needed; using static bridge methods

  public validate(snapshot: ReplaySnapshot): ValidationResult {
    const end = runtime_validation_duration_ms.startTimer();
    try {
      const errors: ValidationIssue[] = [];
      const warnings: ValidationIssue[] = [];

    const safeRun = (fn: () => void, type: string, severity: ValidationSeverity) => {
      try {
        fn();
      } catch (err: any) {
        const issue: ValidationIssue = {
          type,
          message: err?.message ?? "unknown error",
          severity,
        };
        if (severity === "error") errors.push(issue);
        else warnings.push(issue);
        // Record metric regardless of severity
        ValidationMetricsBridge.recordIssue(type, severity);
      }
    };

    // Run all validators regardless of prior failures
    safeRun(() => this.validateSchema(snapshot), "SCHEMA", "error");
    safeRun(() => this.validateHashes(snapshot), "HASH_INTEGRITY", "error");
    safeRun(() => this.validateSequence(snapshot), "SEQUENCE", "warning");
    safeRun(() => this.validateTimestamp(snapshot), "TIMESTAMP", "warning");

      return {
        ok: errors.length === 0,
        errors,
        warnings,
      };
    } finally {
      end();
    }
  }

  private validateSchema(snapshot: ReplaySnapshot) {
    if (!snapshot.schemaVersion) {
      throw new Error("Missing schemaVersion");
    }
  }

  private validateHashes(snapshot: ReplaySnapshot) {
    if (!snapshot.replayHash || !snapshot.eventHash) {
      throw new Error("Missing hashes");
    }
  }

  private validateSequence(snapshot: ReplaySnapshot) {
    if (snapshot.sequence < 0) {
      throw new Error("Invalid sequence");
    }
  }

  private validateTimestamp(snapshot: ReplaySnapshot) {
    if (snapshot.snapshotTimestamp <= 0) {
      throw new Error("Invalid timestamp");
    }
  }
}
