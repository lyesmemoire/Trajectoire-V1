import { MindSnapshot } from "./snapshot-contract.js";
/**
 * Captures a deep copy of MindState into a MindSnapshot.
 *
 * The timestamp is injected as a parameter to keep this function pure
 * (no Date.now() call). The caller decides the timestamp source.
 *
 * Guarantees:
 * - Deep copy: no shared references between input state and snapshot.state.
 * - The original state is never mutated.
 */
export declare function createSnapshot(state: _MindState, timestamp: number): MindSnapshot;
//# sourceMappingURL=create-snapshot.d.ts.map