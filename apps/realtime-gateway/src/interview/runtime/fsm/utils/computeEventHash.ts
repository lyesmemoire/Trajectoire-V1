// src/interview/runtime/fsm/utils/computeEventHash.ts

import type { InterviewRuntimeEvent } from "../types/InterviewRuntimeEvent";
import { versionedHash } from "./versionedHash";
import type { StableHash } from "../../utils/hash";

/** Compute deterministic hash for a runtime event using versionedHash */
export function computeEventHash(event: InterviewRuntimeEvent): StableHash {
  return versionedHash(event) as StableHash;
}
