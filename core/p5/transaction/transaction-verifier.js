import { applyEvents } from "../execution-engine.js";
import { restoreSnapshot } from "../snapshot/restore-snapshot.js";
export function verifyTransaction(tx, committedState) {
    const replayed = applyEvents(restoreSnapshot(tx.snapshot), tx.events);
    const diff = [];
    if (replayed.trust !== committedState.trust)
        diff.push("trust");
    if (replayed.suspicion !== committedState.suspicion)
        diff.push("suspicion");
    if (replayed.pressure !== committedState.pressure)
        diff.push("pressure");
    if (replayed.emotion !== committedState.emotion)
        diff.push("emotion");
    return { valid: diff.length === 0, diff };
}
//# sourceMappingURL=transaction-verifier.js.map