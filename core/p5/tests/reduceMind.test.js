import { describe, it, expect } from "vitest";
import { reduceMind } from "../reduceMind.js";
describe("reduceMind - Core logic", () => {
    const getInitialState = () => ({
        trust: 0.5,
        suspicion: 0.5,
        pressure: 50,
        emotion: "neutral"
    });
    it("should handle neutral events by returning an equivalent state", () => {
        const state = getInitialState();
        const result1 = reduceMind(state, { type: "TRUST_DELTA", delta: 0 });
        expect(result1).toEqual(state);
        const result2 = reduceMind(state, { type: "PRESSURE_DELTA", delta: 0 });
        expect(result2).toEqual(state);
        const result3 = reduceMind(state, { type: "EMOTION_SET", emotion: "neutral" });
        expect(result3).toEqual(state);
    });
    it("should be deterministic for the same state and event", () => {
        const state = getInitialState();
        const event = { type: "TRUST_DELTA", delta: 0.2 };
        const a = reduceMind(state, event);
        const b = reduceMind(state, event);
        expect(a).toEqual(b);
    });
    it("should modify only the relevant field (Locality)", () => {
        const state = getInitialState();
        const nextState = reduceMind(state, { type: "TRUST_DELTA", delta: 0.2 });
        // Changed
        expect(nextState.trust).toBe(0.7);
        // Unchanged
        expect(nextState.suspicion).toBe(state.suspicion);
        expect(nextState.pressure).toBe(state.pressure);
        expect(nextState.emotion).toBe(state.emotion);
    });
});
//# sourceMappingURL=reduceMind.test.js.map