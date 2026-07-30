import { createHash } from "node:crypto";

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
export function snapshotHash(snapshot: _MindSnapshot): string {
  const canonical = JSON.stringify({
    v: snapshot.version,
    t: snapshot.state.trust,
    s: snapshot.state.suspicion,
    p: snapshot.state.pressure,
    e: snapshot.state.emotion,
  });

  return createHash("sha256").update(canonical).digest("hex");
}
