// @ts-nocheck
export interface VerificationViolation {
  /** Short machine‑readable code identifying the rule that failed. */
  code: string;
  /** Tick identifier where the violation occurred (optional). */
  tickId?: number;
  /** Node identifier (optional, for leader‑related violations). */
  nodeId?: string;
  /** Human‑readable description of the problem. */
  message: string;
}

/** Result of a verification pass. */
export interface VerificationResult {
  /** `true` iff no violations were detected. */
  ok: boolean;
  /** All violations discovered by the verifier suite. */
  violations: VerificationViolation[];
}

/** Contract metadata for each verifier. */
export interface VerifierContract {
  /** Human readable name of the verifier. */
  name: string;
  /** Incremental version number. */
  version: number;
  /** Whether a failure is considered critical for CI. */
  critical: boolean;
}
