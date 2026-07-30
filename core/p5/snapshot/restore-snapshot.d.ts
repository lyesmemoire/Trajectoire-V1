import { MindState } from "../execution-contract.js";
/**
 * Restores a MindState from a MindSnapshot.
 *
 * Returns a fresh deep copy — no shared reference with the snapshot.
 * The snapshot itself is never mutated.
 */
export declare function restoreSnapshot(snapshot: _MindSnapshot): MindState;
//# sourceMappingURL=restore-snapshot.d.ts.map