import { computeEventHash } from "../utils/computeEventHash";
import { computeTransitionId } from "../utils/computeTransitionId";
import { computeReplayHash } from "../utils/computeReplayHash";
import { SERIALIZATION_SCHEMA_VERSION } from "../constants/serializationSchemaVersion";
import {
  replayIntegrityFailures,
  replayIntegrityFailuresByReason,
  replayIntegrityValidationDuration,
} from "../metrics/RuntimeMetrics";
import { performance } from "perf_hooks";
import type { InterviewRuntimeEvent } from "../types/InterviewRuntimeEvent";
import type { ReplaySnapshot } from "./ReplaySnapshot";
import { ReplayIntegrityError } from "../errors/ReplayIntegrityError";

/** Helper to record a failure metric */
function recordFailure(reason: string) {
  replayIntegrityFailures.inc();
  replayIntegrityFailuresByReason.inc({ reason });
}

/**
 * Pure, side‑effect‑free validator that checks the entire replay chain.
 * All methods are deliberately ordered to fail fast.
 */
export class ReplayIntegrityValidator {
  /** Verify full integrity of a replay sequence. */
  public verifyReplayIntegrity(
    snapshots: ReadonlyArray<ReplaySnapshot>,
    events: ReadonlyArray<InterviewRuntimeEvent>,
  ): void {
    const start = performance.now();
    try {
      const len = snapshots.length;
      if (len !== events.length) {
        recordFailure("COUNT_MISMATCH");
        throw new ReplayIntegrityError(
          `Snapshot / event count mismatch: ${len} snapshots vs ${events.length} events`,
          "COUNT_MISMATCH",
          { snapshots: len, events: events.length },
        );
      }
      for (let i = 0; i < len; i++) {
        const snap = snapshots[i]!;
        const ev = events[i]!;
        const prev = i === 0 ? null : (snapshots[i - 1] ?? null);

        this.verifySequence(prev, snap);
        this.verifyTimestampOrder(prev, snap);
        if (prev) this.verifyContinuity(prev, snap);
        this.verifyEventHashLineage(snap, ev);
        this.verifyTransitionId(prev, snap, ev);
        this.verifySnapshotIntegrity(snap);
      }
    } finally {
      replayIntegrityValidationDuration.observe(performance.now() - start);
    }
  }

  /** 1️⃣ Sequence must increase by exactly 1 */
  public verifySequence(prev: ReplaySnapshot | null, curr: ReplaySnapshot): void {
    if (!prev) return;
    if (curr.sequence !== prev.sequence + 1) {
      recordFailure("SEQ_MONOTONICITY");
      throw new ReplayIntegrityError(
        `Sequence monotonicity violation at snapshot ${curr.sequence}`,
        "SEQ_MONOTONICITY",
        { expected: prev.sequence + 1, actual: curr.sequence },
      );
    }
  }

  /** 2️⃣ Timestamp must be non‑decreasing */
  public verifyTimestampOrder(prev: ReplaySnapshot | null, curr: ReplaySnapshot): void {
    if (!prev) return;
    if (curr.snapshotTimestamp < prev.snapshotTimestamp) {
      recordFailure("TIMESTAMP_ORDER");
      throw new ReplayIntegrityError(
        `Timestamp order violation at snapshot ${curr.sequence}`,
        "TIMESTAMP_ORDER",
        { prev: prev.snapshotTimestamp, curr: curr.snapshotTimestamp },
      );
    }
  }

  /** 3️⃣ Continuity hash chain */
  public verifyContinuity(prev: ReplaySnapshot, curr: ReplaySnapshot): void {
    if (curr.previousHash !== prev.replayHash) {
      recordFailure("CONTINUITY_BREAK");
      throw new ReplayIntegrityError(
        `Continuity chain broken at snapshot ${curr.sequence}`,
        "CONTINUITY_BREAK",
        { expected: prev.replayHash, actual: curr.previousHash },
      );
    }
  }

  /** 4️⃣ Event hash must match the deterministic hash of the originating event */
  public verifyEventHashLineage(snapshot: ReplaySnapshot, event: InterviewRuntimeEvent): void {
    const computed = computeEventHash(event);
    if (snapshot.eventHash !== computed) {
      recordFailure("EVENT_HASH_MISMATCH");
      throw new ReplayIntegrityError(
        `Event hash mismatch at snapshot ${snapshot.sequence}`,
        "EVENT_HASH_MISMATCH",
        { expected: computed, actual: snapshot.eventHash },
      );
    }
  }

  /** 5️⃣ Re‑compute transitionId from minimal payload */
  public verifyTransitionId(
    prev: ReplaySnapshot | null,
    curr: ReplaySnapshot,
    event: InterviewRuntimeEvent,
  ): void {
    const prevHash = prev ? prev.replayHash : "0";
    const recomputed = computeTransitionId({
      previousHash: prevHash,
      nextHash: curr.replayHash,
      eventHash: curr.eventHash,
      sequence: curr.sequence,
      schemaVersion: SERIALIZATION_SCHEMA_VERSION,
    });
    if (curr.transitionId !== recomputed) {
      recordFailure("TRANSITION_ID_MISMATCH");
      throw new ReplayIntegrityError(
        `TransitionId mismatch at snapshot ${curr.sequence}`,
        "TRANSITION_ID_MISMATCH",
        { expected: recomputed, actual: curr.transitionId },
      );
    }
  }

  /** 6️⃣ Snapshot integrity – recompute full hash from immutable state */
  public verifySnapshotIntegrity(snapshot: ReplaySnapshot): void {
    const fullHash = computeReplayHash({
      schemaVersion: SERIALIZATION_SCHEMA_VERSION,
      currentState: snapshot.currentState,
      previousHash: snapshot.previousHash,
      timestamps: snapshot.snapshotTimestamp,
      eventSequence: snapshot.sequence,
      transitionHistory: snapshot.transitionId,
    });
    if (snapshot.replayHash !== fullHash) {
      recordFailure("SNAPSHOT_HASH_MISMATCH");
      throw new ReplayIntegrityError(
        `Snapshot replayHash mismatch at sequence ${snapshot.sequence}`,
        "SNAPSHOT_HASH_MISMATCH",
        { expected: fullHash, actual: snapshot.replayHash },
      );
    }
  }
}
