// src/interview/runtime/fsm/utils/computeReplayHash.ts

import { versionedHash } from "./versionedHash";
import type { StableHash } from "../../utils/hash";

/** Payload for deterministic replay hash */
export type ReplayPayload = unknown;

/** Compute deterministic hash for a replay payload using versionedHash */
export function computeReplayHash(payload: ReplayPayload): StableHash {
  return versionedHash(payload) as StableHash;
}
