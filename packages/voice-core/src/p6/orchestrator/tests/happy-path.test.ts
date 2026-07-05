import { describe, it, expect } from "vitest";
import { RuntimeOrchestrator } from "../runtime-orchestrator.js";
import { ExecutionFacade } from "../../../p5/integration/execution-facade.js";
import { SessionGovernor, CandidateMessage } from "../../types.js";
import { VoiceUXCalculator } from "../orchestrator-contract.js";
import { MindState } from "../../../p5/execution-contract.js";
import { RuntimeDecision } from "../../../p5/integration/integration-contract.js";
import { VoiceInput } from "../../voice/voice-contract.js";

class MockGovernor implements SessionGovernor {
  decide(message: CandidateMessage, currentState: MindState): RuntimeDecision {
    return { trustDelta: 0.1, emotion: "happy" };
  }
}

class MockUXCalculator implements VoiceUXCalculator {
  calculateUX(state: MindState, decision: RuntimeDecision, message: CandidateMessage): VoiceInput {
    return {
      text: message.text,
      delayMs: 250,
      speechRate: 1.0,
      interruptionChance: 0.1,
      silenceProbability: 0.1,
    };
  }
}

describe("P6.5 - Happy Path", () => {
  it("should process a message end-to-end successfully", () => {
    const facade = new ExecutionFacade();
    const governor = new MockGovernor();
    const ux = new MockUXCalculator();
    const orchestrator = new RuntimeOrchestrator(facade, governor, ux);

    const initialState: MindState = {
      trust: 0.5,
      suspicion: 0.5,
      pressure: 50,
      emotion: "neutral"
    };

    orchestrator.initSession("session-1", initialState, 1000);

    const result = orchestrator.step({ sessionId: "session-1", timestamp: 1010 }, { text: "Bonjour" });

    expect(result.ok).toBe(true);
    if (result.ok) {
      const { value } = result;
      expect(value.sessionId).toBe("session-1");
      expect(value.lifecycle).toBe("ACTIVE");
      expect(value.state.trust).toBe(0.6); // 0.5 + 0.1
      expect(value.decision.emotion).toBe("happy");
      expect(value.voicePlan.utterance).toBe("Bonjour");
      expect(value.voicePlan.delayMs).toBe(250);
      expect(value.commands).toEqual([
        { type: "WAIT", ms: 250 },
        { type: "SPEAK", text: "Bonjour", speechRate: 1.0 },
        { type: "START_LISTENING" }
      ]);
    }
  });
});
