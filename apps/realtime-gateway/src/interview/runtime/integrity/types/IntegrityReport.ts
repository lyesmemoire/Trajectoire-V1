import { IntegrityCheckResult } from "./IntegrityCheckResult";

export interface IntegrityReport {
  passed: boolean;
  replayHash: string;
  sessionHash: string;
  runtimeMs: number;
  checks: IntegrityCheckResult[];
}

// Note: IntegrityCheckResult is defined in ./IntegrityCheckResult.ts
