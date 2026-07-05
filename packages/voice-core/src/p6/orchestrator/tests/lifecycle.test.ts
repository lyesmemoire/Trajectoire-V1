import { describe, it, expect } from "vitest";
import { RuntimeOrchestrator } from "../runtime-orchestrator.js";
import { ExecutionFacade } from "../../../p5/integration/execution-facade.js";
import { SessionGovernor } from "../../types.js";
import { VoiceUXCalculator } from "../orchestrator-contract.js";
import { RuntimeDecision } from "../../../p5/integration/integration-contract.js";
import { VoiceInput } from "../../voice/voice-contract.js";

class DummyGovernor implements SessionGovernor {
  decide(): RuntimeDecision { return {}; }
}
class DummyUX implements VoiceUXCalculator {
  calculateUX(): VoiceInput { return { text: "", delayMs: 0, speechRate: 1, interruptionChance: 0, silenceProbability: 0 }; }
}

describe("P6.5 - Lifecycle Rejections", () => {
  it("O1: should reject if session does not exist", () => {
    const orchestrator = new RuntimeOrchestrator(new ExecutionFacade(), new DummyGovernor(), new DummyUX());
    
    const result = orchestrator.step({ sessionId: "non-existent", timestamp: 1000 }, { text: "Hi" });
    
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toBe("SESSION_NOT_FOUND");
    }
  });

  it("O2: should reject if session is not ACTIVE", () => {
    const orchestrator = new RuntimeOrchestrator(new ExecutionFacade(), new DummyGovernor(), new DummyUX());
    orchestrator.initSession("session-1", { trust: 0.5, suspicion: 0.5, pressure: 50, emotion: "neutral" }, 1000);
    
    // Move to PAUSED
    orchestrator.dispatchLifecycleEvent("session-1", { type: "PAUSE" });

    const result = orchestrator.step({ sessionId: "session-1", timestamp: 1010 }, { text: "Hi" });
    
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toBe("SESSION_NOT_ACTIVE");
    }
  });
});
