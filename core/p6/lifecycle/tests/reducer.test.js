import { describe, it, expect } from "vitest";
import { reduceLifecycle, InvalidLifecycleTransitionError } from "../lifecycle-reducer.js";
describe("P6.4 - Lifecycle Engine", () => {
    it("L1: should allow valid transitions", () => {
        // CREATED -> ACTIVE
        expect(reduceLifecycle("CREATED", { type: "START" })).toBe("ACTIVE");
        // ACTIVE -> PAUSED
        expect(reduceLifecycle("ACTIVE", { type: "PAUSE" })).toBe("PAUSED");
        // ACTIVE -> FINISHED
        expect(reduceLifecycle("ACTIVE", { type: "FINISH" })).toBe("FINISHED");
        // PAUSED -> ACTIVE
        expect(reduceLifecycle("PAUSED", { type: "RESUME" })).toBe("ACTIVE");
    });
    it("L2: should reject forbidden transitions", () => {
        expect(() => reduceLifecycle("CREATED", { type: "RESUME" })).toThrowError(InvalidLifecycleTransitionError);
        expect(() => reduceLifecycle("ACTIVE", { type: "START" })).toThrowError(InvalidLifecycleTransitionError);
        expect(() => reduceLifecycle("PAUSED", { type: "PAUSE" })).toThrowError(InvalidLifecycleTransitionError);
        expect(() => reduceLifecycle("FINISHED", { type: "START" })).toThrowError(InvalidLifecycleTransitionError);
    });
    it("L3: should treat ARCHIVED as strictly terminal (no outgoing transitions)", () => {
        const events = [
            { type: "START" },
            { type: "PAUSE" },
            { type: "RESUME" },
            { type: "FINISH" },
            { type: "ARCHIVE" },
        ];
        for (const event of events) {
            expect(() => reduceLifecycle("ARCHIVED", event)).toThrowError(InvalidLifecycleTransitionError);
        }
    });
    it("L4: should treat FINISHED as irreversible (no return to ACTIVE or PAUSED)", () => {
        expect(() => reduceLifecycle("FINISHED", { type: "START" })).toThrowError(InvalidLifecycleTransitionError);
        expect(() => reduceLifecycle("FINISHED", { type: "RESUME" })).toThrowError(InvalidLifecycleTransitionError);
        expect(() => reduceLifecycle("FINISHED", { type: "PAUSE" })).toThrowError(InvalidLifecycleTransitionError);
        // Only valid transition from FINISHED is ARCHIVE
        expect(reduceLifecycle("FINISHED", { type: "ARCHIVE" })).toBe("ARCHIVED");
    });
    it("L5: should be totally deterministic for a given sequence of events", () => {
        const sequence = [
            { type: "START" },
            { type: "PAUSE" },
            { type: "RESUME" },
            { type: "FINISH" },
        ];
        let state = "CREATED";
        for (const event of sequence) {
            state = reduceLifecycle(state, event);
        }
        expect(state).toBe("FINISHED");
    });
});
//# sourceMappingURL=reducer.test.js.map