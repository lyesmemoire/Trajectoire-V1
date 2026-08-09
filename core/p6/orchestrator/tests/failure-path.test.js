import { describe, it, expect } from "vitest";
import { RuntimeOrchestrator } from "../runtime-orchestrator.js";
import { ExecutionFacade } from "../../../p5/integration/execution-facade.js";
class DummyGovernor {
    decide() { return {}; }
}
class DummyUX {
    calculateUX() { return { text: "", delayMs: 0, speechRate: 1, interruptionChance: 0, silenceProbability: 0 }; }
}
describe("P6.5 - Failure Paths", () => {
    it("should fail gracefully if ExecutionFacade fails", () => {
        const facade = new ExecutionFacade();
        const orchestrator = new RuntimeOrchestrator(facade, new DummyGovernor(), new DummyUX());
        orchestrator.initSession("s1", { trust: 0.5, suspicion: 0.5, pressure: 50, emotion: "neutral" }, 1000);
        // forcefully break the session in the facade to simulate internal failure
        facade.destroySession("s1");
        const result = orchestrator.step({ sessionId: "s1", timestamp: 1010 }, { text: "Break" });
        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.reason).toBe("SESSION_NOT_FOUND");
        }
    });
});
//# sourceMappingURL=failure-path.test.js.map