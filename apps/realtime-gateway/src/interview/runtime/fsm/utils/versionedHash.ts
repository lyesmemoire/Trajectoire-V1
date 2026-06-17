// src/interview/runtime/fsm/utils/versionedHash.ts

import { hashObjectStable } from "../../utils/hash";
import { HASH_NAMESPACE } from "../constants/serializationSchemaVersion";
import { HASH_ALGORITHM_VERSION } from "../constants/hashAlgorithmVersion";
import { SERIALIZATION_SCHEMA_VERSION } from "../constants/serializationSchemaVersion";

/**
 * Central deterministic hashing that embeds namespace, schema version,
 * and hash algorithm version. All runtime hashes must go through this.
 */
export function versionedHash(payload: unknown): string {
  return hashObjectStable({
    namespace: HASH_NAMESPACE,
    schemaVersion: SERIALIZATION_SCHEMA_VERSION,
    hashAlgorithmVersion: HASH_ALGORITHM_VERSION,
    payload,
  });
}
