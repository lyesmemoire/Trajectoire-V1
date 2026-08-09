/**
 * Produces a deterministic SHA-256 hash of a MindSnapshot's logical state.
 *
 * Only hashes the state fields (trust, suspicion, pressure, emotion)
 * and the version. Timestamp is excluded because it is observability-only
 * and must not influence identity.
 *
 * Guarantees:
 * - S3: same state → same hash.
 * - S4: unknown field change → different hash.
 * - Pure function, no side effects.
 */
export declare function snapshotHash(snapshot: _MindSnapshot): string;
//# sourceMappingURL=snapshot-hash.d.ts.map