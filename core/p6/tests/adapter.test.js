import { describe, it, expect } from "vitest";
import { SessionRuntimeAdapter } from "../SessionRuntimeAdapter.js";
import { ExecutionFacade } from "../../p5/integration/execution-facade.js";
class MockGovernor {
    fixedDecision;
    constructor(fixedDecision) {
        this.fixedDecision = fixedDecision;
    }
    decide(message, currentState) {
        return this.fixedDecision;
    }
}
describe("SessionRuntimeAdapter (P6.1)", () => {
    const initialState = {
        trust: 0.5,
        suspicion: 0.5,
        pressure: 50,
        emotion: "neutral"
    };
    it("should process a candidate message successfully", () => {
        const facade = new ExecutionFacade();
        const governor = new MockGovernor({ trustDelta: 0.1 });
        const adapter = new SessionRuntimeAdapter(facade, governor);
        facade.initSession("session-1", initialState, 1000);
        const result = adapter.handleCandidateMessage("session-1", { text: "Hello" }, 1010);
        expect(result.ok).toBe(true);
        if (result.ok) {
            expect(result.value.sessionId).toBe("session-1");
            expect(result.value.timestamp).toBe(1010);
            expect(result.value.state.trust).toBe(0.6); // 0.5 + 0.1
            expect(result.value.journalSize).toBe(1);
        }
    });
    it("should fail if session not found", () => {
        const facade = new ExecutionFacade();
        const governor = new MockGovernor({ trustDelta: 0.1 });
        const adapter = new SessionRuntimeAdapter(facade, governor);
        const result = adapter.handleCandidateMessage("invalid-session", { text: "Hello" }, 1010);
        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.reason).toBe("Session not found: invalid-session");
        }
    });
});
//# sourceMappingURL=adapter.test.js.map