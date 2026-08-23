import { describe, it, expect } from "vitest";
import { RuntimeOrchestrator } from "../runtime-orchestrator.js";
import { ExecutionFacade } from "@trajectoire/execution-core/integration/execution-facade";
import { SessionGovernor, CandidateMessage } from "../../types.js";
import { VoiceUXCalculator } from "../orchestrator-contract.js";
import { MindState } from "@trajectoire/execution-core/execution-contract";
import { RuntimeDecision } from "@trajectoire/execution-core/integration/integration-contract";
import { VoiceInput } from "../../voice/voice-contract.js";

class DeterministicGovernor implements SessionGovernor {
  decide(message: CandidateMessage, state: MindState): RuntimeDecision {
    return { trustDelta: 0.05 };
  }
}

class DeterministicUX implements VoiceUXCalculator {
  calculateUX(state: MindState, decision: RuntimeDecision, message: CandidateMessage): VoiceInput {
    return {
      text: message.text,
      delayMs: state.pressure > 50 ? 0 : 100,
      speechRate: 1.0,
      interruptionChance: 0,
      silenceProbability: 0,
    };
  }
}

describe("P6.5 - O7 Determinism", () => {
  it("should produce exactly the same result for the same input sequence", () => {
    const initialState: MindState = { trust: 0.5, suspicion: 0.5, pressure: 50, emotion: "neutral" };
    
    // First run
    const facade1 = new ExecutionFacade();
    const orchestrator1 = new RuntimeOrchestrator(facade1, new DeterministicGovernor(), new DeterministicUX());
    orchestrator1.initSession("s1", initialState, 1000);
    const result1 = orchestrator1.step({ sessionId: "s1", timestamp: 1010 }, { text: "Repeat" });

    // Second run
    const facade2 = new ExecutionFacade();
    const orchestrator2 = new RuntimeOrchestrator(facade2, new DeterministicGovernor(), new DeterministicUX());
    orchestrator2.initSession("s1", initialState, 1000);
    const result2 = orchestrator2.step({ sessionId: "s1", timestamp: 1010 }, { text: "Repeat" });

    expect(result1).toEqual(result2);
  });
});
