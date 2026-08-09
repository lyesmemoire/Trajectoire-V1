import { describe, it, expect } from "vitest";
import { createSnapshot } from "../create-snapshot.js";
import { restoreSnapshot } from "../restore-snapshot.js";
import { applyEvents } from "../../execution-engine.js";
describe("snapshot — S5: Recovery", () => {
    const events = [
        { type: "TRUST_DELTA", delta: 0.1 },
        { type: "SUSPICION_DELTA", delta: -0.05 },
        { type: "PRESSURE_DELTA", delta: 15 },
        { type: "EMOTION_SET", emotion: "engaged" },
    ];
    it("should produce identical result whether starting from state or snapshot", () => {
        const state = {
            trust: 0.5,
            suspicion: 0.5,
            pressure: 50,
            emotion: "neutral",
        };
        // Path A: state → applyEvents
        const resultA = applyEvents(state, events);
        // Path B: state → snapshot → restore → applyEvents
        const snapshot = createSnapshot(state, 1000);
        const restored = restoreSnapshot(snapshot);
        const resultB = applyEvents(restored, events);
        expect(resultB).toEqual(resultA);
    });
    it("should support mid-execution snapshot and resume", () => {
        const initial = {
            trust: 0.3,
            suspicion: 0.6,
            pressure: 70,
            emotion: "neutral",
        };
        const firstBatch = [
            { type: "TRUST_DELTA", delta: 0.2 },
            { type: "PRESSURE_DELTA", delta: -10 },
        ];
        const secondBatch = [
            { type: "SUSPICION_DELTA", delta: -0.1 },
            { type: "EMOTION_SET", emotion: "relaxed" },
        ];
        // Full execution
        const mid = applyEvents(initial, firstBatch);
        const fullResult = applyEvents(mid, secondBatch);
        // Snapshot at mid-point, then resume
        const snapshot = createSnapshot(mid, 2000);
        const restored = restoreSnapshot(snapshot);
        const recoveredResult = applyEvents(restored, secondBatch);
        expect(recoveredResult).toEqual(fullResult);
    });
    it("should handle recovery with empty event list", () => {
        const state = {
            trust: 0.8,
            suspicion: 0.2,
            pressure: 30,
            emotion: "calm",
        };
        const snapshot = createSnapshot(state, 0);
        const restored = restoreSnapshot(snapshot);
        const result = applyEvents(restored, []);
        expect(result).toEqual(state);
    });
});
//# sourceMappingURL=recovery.test.js.map