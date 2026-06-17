// src/interview/runtime/fsm/orchestrator/ReplaySnapshot.ts

import type { StableHash } from "../../utils/hash";
import { deepFreeze } from "../../utils/deepFreeze";
import { SERIALIZATION_SCHEMA_VERSION } from "../constants/serializationSchemaVersion";

/**
 * Immutable snapshot taken after each deterministic FSM transition.
 * All fields are readonly and the object is deep‑frozen to guarantee
 * replay‑safety. The timestamp must be supplied by the originating event
 * (no Date.now inside the runtime).
 */
export interface ReplaySnapshot {
  /** Deterministic hash of the state after this transition */
  readonly replayHash: StableHash;
  /** Stable hash of the previous state */
  readonly previousHash: StableHash;
  /** Stable hash of the triggering event */
  readonly eventHash: StableHash;
  /** Deterministic identifier for the transition */
  readonly transitionId: StableHash;
  /** Monotonic sequence number for this transition */
  readonly sequence: number;
  /** Name of the FSM state after the transition */
  readonly currentState: string;
  /** Timestamp supplied by the event (deterministic) */
  readonly snapshotTimestamp: number;
  /** Schema version for forward compatibility */
  readonly schemaVersion: typeof SERIALIZATION_SCHEMA_VERSION;
}

/** Helper to create a frozen snapshot */
export function createSnapshot(
  data: ReplaySnapshot,
): Readonly<ReplaySnapshot> {
  return deepFreeze(data) as Readonly<ReplaySnapshot>;
}
