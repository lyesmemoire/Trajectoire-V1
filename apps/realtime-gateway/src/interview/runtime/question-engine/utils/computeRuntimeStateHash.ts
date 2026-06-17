import { hashObjectStable } from "../../utils/hash";
import { InterviewRuntimeState } from "../state/InterviewRuntimeState";

// List of fields that must never participate in the runtime state hash.
// Keeping this list explicit prevents accidental drift when new transient fields are added.
export const NON_HASHABLE_RUNTIME_FIELDS = [
  "stateHash",
  "executionDurationMs",
  "memoryFootprintEstimate",
  "debugMetadata",
  "traceBuffer",
  "runtimeWarnings",
  "transientTelemetry",
] as const;

type NonHashableKeys = (typeof NON_HASHABLE_RUNTIME_FIELDS)[number];

/**
 * Compute a deterministic hash of the runtime state, *excluding* all non‑hashable / transient fields.
 * The function expects a state *without* the `stateHash` field already – callers should
 * spread the original state and omit `stateHash` before invoking.
 */
export function computeRuntimeStateHash(
  state: Omit<InterviewRuntimeState, "stateHash">,
): string {
  // Build a shallow copy that removes any non‑hashable keys.
  const hashableState = { ...state } as Record<string, unknown>;
  for (const key of NON_HASHABLE_RUNTIME_FIELDS) {
    // @ts-ignore – we deliberately delete possibly undefined keys.
    delete hashableState[key];
  }
  // The stable hash implementation guarantees deterministic ordering.
  return hashObjectStable(hashableState);
}
