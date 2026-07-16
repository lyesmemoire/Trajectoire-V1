/**
 * Restores a MindState from a MindSnapshot.
 *
 * Returns a fresh deep copy — no shared reference with the snapshot.
 * The snapshot itself is never mutated.
 */
// @ts-nocheck

export function restoreSnapshot(snapshot) {
    return {
        trust: snapshot.state.trust,
        suspicion: snapshot.state.suspicion,
        pressure: snapshot.state.pressure,
        emotion: snapshot.state.emotion,
    };
}
//# sourceMappingURL=restore-snapshot.js.map