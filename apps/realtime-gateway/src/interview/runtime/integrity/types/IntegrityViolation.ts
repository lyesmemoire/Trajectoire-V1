import { IntegritySeverity } from "./IntegritySeverity";
import { IntegrityInvariantId } from "./IntegrityInvariantId";

export interface IntegrityViolation {
  /** Deterministic hash of the violation for deduplication */
  violationHash: string;

  /** Identifier of the invariant that was violated */
  invariantId: IntegrityInvariantId;

  /** Severity level of the violation */
  severity: IntegritySeverity;

  /** Category to aid filtering */
  category:
    | "playback"
    | "snapshot"
    | "graph"
    | "renderer"
    | "session"
    | "hash"
    | "timing";

  /** Human‑readable description */
  message: string;

  /** Optional free‑form details */
  details?: unknown;

  /** Logical time associated with the violation, if applicable */
  logicalTime?: number;

  /** Frame identifier, when related to playback */
  frameId?: number;

  /** Snapshot hash involved, if any */
  snapshotHash?: string;
}
