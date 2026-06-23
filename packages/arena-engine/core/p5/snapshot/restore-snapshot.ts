import { MindState } from "../execution-contract.js";
import { MindSnapshot } from "./snapshot-contract.js";

/**
 * Restores a MindState from a MindSnapshot.
 *
 * Returns a fresh deep copy — no shared reference with the snapshot.
 * The snapshot itself is never mutated.
 */
export function restoreSnapshot(snapshot: MindSnapshot): MindState {
  return {
    trust: snapshot.state.trust,
    suspicion: snapshot.state.suspicion,
    pressure: snapshot.state.pressure,
    emotion: snapshot.state.emotion,
  };
}
