// src/interview/runtime/fsm/types/RuntimeTransitionRecord.ts

import type { StableHash } from "../../utils/hash";
/**
 * Deterministic record describing a single FSM transition.
 * All fields are immutable, frozen, and hashable.
 */
export interface RuntimeTransitionRecord {
  readonly transitionId: StableHash;
  readonly transitionName: string;
  readonly previousHash: StableHash;
  readonly nextHash: StableHash;
  readonly eventHash: StableHash;
  readonly sequence: number;
  readonly timestamp: number;
}
