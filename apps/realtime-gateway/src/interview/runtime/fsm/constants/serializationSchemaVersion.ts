// src/interview/runtime/fsm/constants/serializationSchemaVersion.ts

/**
 * Global version identifier for the deterministic serialization contract.
 * Increment when the serialized shape of any persisted structure changes.
 */
export const SERIALIZATION_SCHEMA_VERSION = "fsm-runtime-v1" as const;

/** Namespace identifier for hashing to avoid cross‑domain collisions. */
export const HASH_NAMESPACE = "fsm-runtime" as const;
