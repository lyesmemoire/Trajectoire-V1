/**
 * Compares two MindStates and reports any divergent fields.
 *
 * Returns { valid: true, diff: [] } if states are logically equivalent.
 * Returns { valid: false, diff: ["trust", ...] } listing every divergent field.
 *
 * Pure function — no side effects.
 */
export function verifyReplay(original, replayed) {
    const diff = [];
    if (original.trust !== replayed.trust) {
        diff.push("trust");
    }
    if (original.suspicion !== replayed.suspicion) {
        diff.push("suspicion");
    }
    if (original.pressure !== replayed.pressure) {
        diff.push("pressure");
    }
    if (original.emotion !== replayed.emotion) {
        diff.push("emotion");
    }
    return { valid: diff.length === 0, diff };
}
//# sourceMappingURL=replay-verifier.js.map