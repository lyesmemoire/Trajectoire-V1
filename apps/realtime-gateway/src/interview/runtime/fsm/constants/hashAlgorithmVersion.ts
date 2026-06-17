// src/interview/runtime/fsm/constants/hashAlgorithmVersion.ts

/**
 * Global version identifier for the hashing algorithm used in the deterministic runtime.
 * Increment when the hashing algorithm changes (e.g., migration to a new hash function).
 */
export const HASH_ALGORITHM_VERSION = "sha256-v1" as const;
