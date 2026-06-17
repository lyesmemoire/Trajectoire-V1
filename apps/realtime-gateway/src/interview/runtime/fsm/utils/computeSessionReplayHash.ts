// src/interview/runtime/fsm/utils/computeSessionReplayHash.ts

import { versionedHash } from "./versionedHash";
import type { StableHash } from "../../utils/hash";

/** Payload for session replay hash */
export interface SessionReplayPayload {
  /** Immutable list of events for the session */
  events: readonly unknown[];
  /** Schema version of the serialization contract */
  schemaVersion: string;
  /** Optional session identifier */
  sessionId?: string;
}

/** Compute deterministic hash for a session replay payload using versionedHash */
export function computeSessionReplayHash(payload: SessionReplayPayload): StableHash {
  return versionedHash(payload) as StableHash;
}
