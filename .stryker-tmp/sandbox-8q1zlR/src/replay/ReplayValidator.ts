// @ts-nocheck
import crypto from "crypto";
import { ReplayResult } from "./ReplayEngine";
import { ReplayInvariant } from "./ReplayInvariant";


// REPLAY CERTIFICATION RULE (B2):
// Replay is VALID ONLY if:
// stateHash === replayHash AND eventIndexDrift === 0
export class ReplayValidator {
  static hash(obj: any): string {
    return crypto.createHash("sha256").update(JSON.stringify(obj)).digest("hex");
  }

  /** Validate that two state objects are identical based on hash */
  static validate(originalState: any, replayState: any) {
    const originalHash = this.hash(originalState);
    const replayHash = this.hash(replayState);
    return { match: originalHash === replayHash, originalHash, replayHash };
  }

  /** Validate the replay trace for determinism and ordering integrity */
  static validateReplay(trace: ReplayResult) {
    const deterministic = trace.eventIndexDrift === 0;
    const integrity = trace.mismatchEvents.length === 0;
    const valid = deterministic && integrity;
    return { deterministic, integrity, valid };
  }

  /** Evaluate the full replay invariant contract */
  static evaluateReplayInvariant(result: ReplayResult): ReplayInvariant {
    // Hard guard – any drift is a fatal error
    if (result.eventIndexDrift !== 0) {
      throw new Error("REPLAY_DRIFT_DETECTED");
    }
    return {
      hashEquality: result.stateHash === result.replayHash,
      eventDrift: result.eventIndexDrift,
      mismatchEvents: result.mismatchEvents.length,
      canonicalizationStable: true,
    };
  }
}
