import { describe, it, expect } from "vitest";
import { createSnapshot } from "../create-snapshot.js";
import { restoreSnapshot } from "../restore-snapshot.js";
describe("snapshot — S2: Immutability", () => {
    it("should not share references between original state and snapshot", () => {
        const state = {
            trust: 0.5,
            suspicion: 0.5,
            pressure: 50,
            emotion: "neutral",
        };
        const snapshot = createSnapshot(state, 0);
        // Mutate original state
        state.trust = 0.99;
        state.emotion = "corrupted";
        // Snapshot must be unaffected
        expect(snapshot.state.trust).toBe(0.5);
        expect(snapshot.state.emotion).toBe("neutral");
    });
    it("should not share references between snapshot and restored state", () => {
        const state = {
            trust: 0.7,
            suspicion: 0.3,
            pressure: 60,
            emotion: "focused",
        };
        const snapshot = createSnapshot(state, 0);
        const restored = restoreSnapshot(snapshot);
        // Mutate restored state
        restored.trust = 0;
        restored.emotion = "corrupted";
        // Snapshot must be unaffected
        expect(snapshot.state.trust).toBe(0.7);
        expect(snapshot.state.emotion).toBe("focused");
    });
    it("should survive Object.freeze on original state", () => {
        const state = Object.freeze({
            trust: 0.5,
            suspicion: 0.5,
            pressure: 50,
            emotion: "neutral",
        });
        // Should not throw
        const snapshot = createSnapshot(state, 0);
        const restored = restoreSnapshot(snapshot);
        expect(restored).toEqual(state);
    });
});
//# sourceMappingURL=snapshot-immutability.test.js.map