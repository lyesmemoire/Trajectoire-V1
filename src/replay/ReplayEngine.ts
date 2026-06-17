import { RuntimeOrchestrator } from "../../apps/realtime-gateway/src/interview/runtime/fsm/orchestrator/RuntimeOrchestrator";
import { ReplayCanonicalizer } from "./ReplayCanonicalizer";
import { ReplayDeterminismGuard } from "./ReplayDeterminismGuard";
import { PersistenceEngine } from "../persistence/PersistenceEngine";
import crypto from "crypto";

/**
 * Result of a replay run.
 * stateHash is the authoritative hash of the system state after replay.
 * replayHash is the hash of the deterministic event trace.
 */
export type ReplayResult = {
  totalEvents: number;
  success: number;
  failed: number;
  stateHash: string;
  replayHash: string;
  eventIndexDrift: number;
  mismatchEvents: number[];
};

export class ReplayEngine {
  private orchestrator: RuntimeOrchestrator;
  private store: PersistenceEngine;
  private guard: ReplayDeterminismGuard = new ReplayDeterminismGuard();
  // Deterministic seed for reproducible replay (authoritative for both replayHash and any RNG usage)
  private readonly seed: number = 1337;

  constructor() {
    this.orchestrator = new RuntimeOrchestrator(null as any, null as any);
    this.store = new PersistenceEngine();
  }

  /** Simple LCG seeded random for deterministic behavior */
  private seededRandom(seed: number): () => number {
    let _seed = seed >>> 0;
    return () => {
      // Numerical Recipes LCG parameters
      _seed = (_seed * 1664525 + 1013904223) >>> 0;
      return _seed / 0x100000000;
    };
  }

  async run(): Promise<ReplayResult> {
    // Freeze RNG for reproducibility
    Math.random = this.seededRandom(this.seed);

    const events = this.store.readAll();

    let success = 0;
    let failed = 0;
    let expectedIndex = 0;
    const mismatchEvents: number[] = [];

    for (const event of events) {
      const canonicalEvent = ReplayCanonicalizer.normalizeEvent(event);
      this.guard.record(canonicalEvent);

      if (event.index !== expectedIndex) {
        mismatchEvents.push(event.index);
      }
      expectedIndex++;

      try {
        await (this.orchestrator as any).process(event);
        success++;
      } catch {
        failed++;
      }
    }

    const guardResult = this.guard.verify();

    // REPLAY RULE:
    // All events MUST be canonicalized before hashing.
    // Any deviation invalidates B2 certification.

    return {
      totalEvents: events.length,
      success,
      failed,
      stateHash: this.computeStateHash(),
      replayHash: guardResult.hash,
      eventIndexDrift: mismatchEvents.length,
      mismatchEvents,
    };
  }

  /**
   * AUTHORITATIVE STATE HASH: this hash is the source of truth for certification.
   * The replayHash (event trace) must match the deterministic stateHash for a passing B2 check.
   */
  private computeStateHash(): string {
    const state =
      (this.orchestrator as any).getState?.() ??
      (this.orchestrator as any).state ??
      {};

    return crypto.createHash("sha256").update(JSON.stringify(state)).digest("hex");
  }
}
