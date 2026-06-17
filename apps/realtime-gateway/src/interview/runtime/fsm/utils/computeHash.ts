// src/interview/runtime/fsm/utils/computeHash.ts

import { versionedHash } from "./versionedHash";
import type { StableHash } from "../../utils/hash";

/** Forward any payload to the central versioned hash. */
export function computeHash(payload: unknown): StableHash {
  return versionedHash(payload) as StableHash;
}
