/**
 * SIL v1.0 — FORMAL INVARIANTS
 * These are NOT runtime rules.
 * They are mathematical constraints enforced via property testing.
 */

export const INVARIANTS = {
  /**
   * I1 — Determinism
   */
  DETERMINISM: "same input events => same final hash",

  /**
   * I2 — Replay Equivalence
   */
  REPLAY_EQUIVALENCE:
    "replay(original_event_log) === replay(reconstructed_event_log)",

  /**
   * I3 — Order Independence (within partition rules)
   */
  PARTITION_CONSISTENCY:
    "reordering across shards does not affect per-session result",

  /**
   * I4 — Ledger Integrity
   */
  LEDGER_BINDING:
    "any event mutation ⇒ merkle root divergence",

  /**
   * I5 — Tenant Isolation
   */
  TENANT_ISOLATION:
    "events from different tenants never influence same state"
} as const;
