// src/interview/runtime/fsm/utils/computeTransitionId.ts

import { versionedHash } from "./versionedHash";
import type { StableHash } from "../../utils/hash";

/** Payload for transition identifier hashing */
export interface TransitionIdPayload {
  previousHash: string;
  nextHash: string;
  eventHash: string;
  sequence: number;
  schemaVersion: string;
}

/** Compute deterministic hash for a transition identifier using versionedHash */
export function computeTransitionId(payload: TransitionIdPayload): StableHash {
  return versionedHash(payload) as StableHash;
}
