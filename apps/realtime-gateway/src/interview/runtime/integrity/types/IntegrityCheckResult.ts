export interface IntegrityCheckResult {
  /** Human‑readable name of the check, e.g. 'GraphInvariantValidator' */
  name: string;

  /** Did the check pass without fatal violations? */
  passed: boolean;

  /** All violations reported by this check. */
  violations: import("./IntegrityViolation").IntegrityViolation[];

  /** Execution time in milliseconds. */
  runtimeMs: number;
}
