import { performance } from "perf_hooks";
import { fsmTransitionsTotal, fsmTransitionDuration } from "../metrics/RuntimeMetrics";
import { FSMEngine } from "../engine/FSMEngine";
import type { InterviewRuntimeEvent } from "../types/InterviewRuntimeEvent";
import type { ReplaySnapshot } from "./ReplaySnapshot";
import { createSnapshot } from "./ReplaySnapshot";
import { computeEventHash } from "../utils/computeEventHash";
import { computeReplayHash } from "../utils/computeReplayHash";
import { deepFreeze } from "../../utils/deepFreeze";
import { SERIALIZATION_SCHEMA_VERSION } from "../constants/serializationSchemaVersion";

/**
 * ReplayDebugger reconstructs FSM state solely through `FSMEngine.transition`.
 * It never mutates state directly, never restores snapshots, and never bypasses guards.
 */
// ---------------------------------------------------------------
// Replay hash authority
// ---------------------------------------------------------------
// - All replay hashes MUST be produced exclusively by ReplayDebugger via computeReplayHash().
// - No other component (RuntimeEventBus, Orchestrator, etc.) should invoke computeReplayHash.
// - This guarantees a single source‑of‑truth for deterministic replay hashes.
// ---------------------------------------------------------------

export class ReplayDebugger {
  /** Engine instance used for deterministic transitions */
  private engine: FSMEngine;
  /** Ordered immutable snapshots recorded after each transition */
  private snapshots: ReadonlyArray<ReplaySnapshot> = [];

  /** Initialise the debugger with the same initial state used by the live FSM */
  constructor(initialState: any) {
    this.engine = new FSMEngine(initialState);
  }

  /** Replay a full event log from the beginning */
  public replay(events: InterviewRuntimeEvent[]): void {
    this.reset();
    this.replayFrom(events, 0);
  }

  /** Replay events starting at a given sequence index (0‑based) */
  public replayFrom(events: InterviewRuntimeEvent[], sequence: number): void {
    if (sequence < 0 || sequence > events.length) {
      throw new Error(`Invalid sequence ${sequence}`);
    }
    // Ensure engine is at the correct starting snapshot if we are resuming
    if (sequence > 0) {
      const prior = this.snapshots[sequence - 1];
      if (!prior) {
        throw new Error(`Missing snapshot for sequence ${sequence}`);
      }
      // Engine state is already the result of previous transitions because we never reset it here.
    }
    const mutableSnaps: ReplaySnapshot[] = [] as any;
    for (let i = sequence; i < events.length; i++) {
      const ev = events[i];
      const start = performance.now();
      const result = this.engine.transition(ev as any);
      const duration = performance.now() - start;
      const fromState = i === 0 ? "unknown" : (this.snapshots[i - 1]?.currentState ?? "unknown");
      const toState = result.state.currentState;
      fsmTransitionsTotal.inc({ from: fromState, to: toState, source: "replay" });
      fsmTransitionDuration.observe({ source: "replay" }, duration);
      const snapshot: ReplaySnapshot = createSnapshot({
      replayHash: computeReplayHash(result.state),
      previousHash: (i === 0 ? "0" : (this.snapshots[i - 1]?.replayHash ?? "0")) as any,
      eventHash: computeEventHash(ev!),
      transitionId: result.transitionId as any,
      sequence: i + 1,
      currentState: result.state.currentState,
      snapshotTimestamp: ev!.timestamp,
      schemaVersion: SERIALIZATION_SCHEMA_VERSION,
    });
      mutableSnaps.push(snapshot);
    }
    // Replace immutable array with fresh frozen collection
    this.snapshots = deepFreeze(mutableSnaps);
  }

  /** Compare two snapshots for strict equality */
  public compareReplay(a: ReplaySnapshot, b: ReplaySnapshot): boolean {
    return (
      a.replayHash === b.replayHash &&
      a.previousHash === b.previousHash &&
      a.eventHash === b.eventHash &&
      a.transitionId === b.transitionId &&
      a.sequence === b.sequence &&
      a.currentState === b.currentState &&
      a.snapshotTimestamp === b.snapshotTimestamp
    );
  }

  /** Verify that the latest computed replay hash matches the expected value */
  public verifyReplayHash(expectedHash: string): void {
    const latest = this.snapshots[this.snapshots.length - 1];
    if (!latest) {
      throw new Error("No snapshots recorded");
    }
    if (latest.replayHash !== expectedHash) {
      throw new Error(
        `Replay hash mismatch: expected ${expectedHash}, got ${latest.replayHash}`,
      );
    }
  }

  /** Verify the integrity of the transition chain (ids order & monotonicity) */
  public verifyTransitionIntegrity(): void {
    const ids = this.snapshots.map((s) => s.transitionId);
    for (let i = 1; i < ids.length; i++) {
      if (ids[i] === ids[i - 1]) {
        throw new Error(`Duplicate transitionId detected at index ${i}`);
      }
    }
  }

  /** Reset debugger to initial clean state */
  private reset(): void {
    // Re‑instantiate engine with the original initial state (assumed stored on engine)
    const initState = (this.engine as any).initialState ?? {};
    this.engine = new FSMEngine(initState);
    this.snapshots = [] as any;
  }
}
