import { describe, it, expect } from "vitest";
import { ExecutionFacade } from "../execution-facade.js";
import { replay } from "../../journal/replay.js";
describe("execution-facade — end-to-end integration", () => {
    const getState = () => ({
        trust: 0.5,
        suspicion: 0.5,
        pressure: 50,
        emotion: "neutral",
    });
    it("should init, execute, and retrieve state", () => {
        const facade = new ExecutionFacade();
        facade.initSession("s1", getState(), 0);
        const result = facade.execute("s1", { trustDelta: 0.2 }, 1);
        expect(result).not.toBeNull();
        expect(result.next.trust).toBeCloseTo(0.7, 5);
        expect(facade.getState("s1").trust).toBeCloseTo(0.7, 5);
    });
    it("should return null for unknown session", () => {
        const facade = new ExecutionFacade();
        const result = facade.execute("unknown", { trustDelta: 0.1 }, 0);
        expect(result).toBeNull();
    });
    it("should return null for invalid decision", () => {
        const facade = new ExecutionFacade();
        facade.initSession("s1", getState(), 0);
        const result = facade.execute("s1", { trustDelta: NaN }, 0);
        expect(result).toBeNull();
        // State unchanged
        expect(facade.getState("s1")).toEqual(getState());
    });
    it("should isolate sessions (R2)", () => {
        const facade = new ExecutionFacade();
        facade.initSession("s1", getState(), 0);
        facade.initSession("s2", getState(), 0);
        facade.execute("s1", { trustDelta: 0.3 }, 1);
        expect(facade.getState("s1").trust).toBeCloseTo(0.8, 5);
        expect(facade.getState("s2").trust).toBe(0.5); // untouched
    });
    it("should destroy a session", () => {
        const facade = new ExecutionFacade();
        facade.initSession("s1", getState(), 0);
        expect(facade.destroySession("s1")).toBe(true);
        expect(facade.getState("s1")).toBeUndefined();
        expect(facade.activeSessions).toBe(0);
    });
    it("should maintain coherent journal and timeline across multiple executions", () => {
        const facade = new ExecutionFacade();
        facade.initSession("s1", getState(), 0);
        facade.execute("s1", { trustDelta: 0.1 }, 1);
        facade.execute("s1", { pressureDelta: -5, emotion: "calm" }, 2);
        facade.execute("s1", { suspicionDelta: 0.15 }, 3);
        const session = facade.getSession("s1");
        // Journal and timeline must have same length (R1)
        expect(session.journal.entries.length).toBe(session.timeline.entries.length);
        // 1 (trust) + 2 (pressure + emotion) + 1 (suspicion) = 4 events
        expect(session.journal.entries.length).toBe(4);
    });
    it("should support full replay from session data (R5)", () => {
        const facade = new ExecutionFacade();
        facade.initSession("s1", getState(), 0);
        facade.execute("s1", { trustDelta: 0.1, pressureDelta: 10 }, 1);
        facade.execute("s1", { emotion: "happy" }, 2);
        const session = facade.getSession("s1");
        // Replay via journal
        const replayed = replay(session.initialSnapshot, session.journal);
        expect(replayed).toEqual(session.state);
    });
});
//# sourceMappingURL=execution-facade.test.js.map