import { describe, it, expect } from "vitest";
import { RuntimeOrchestrator } from "../../core/p6/orchestrator/runtime-orchestrator";
import { ExecutionFacade } from "../../core/p5/integration/execution-facade";
import { SessionGovernor, CandidateMessage } from "../../core/p6/types";
import { VoiceUXCalculator } from "../../core/p6/orchestrator/orchestrator-contract";
import { MindState } from "../../core/p5/execution-contract";
import { RuntimeDecision } from "../../core/p5/integration/integration-contract";
import { VoiceInput } from "../../core/p6/voice/voice-contract";

class StaticGovernor implements SessionGovernor {
  decide(msg: CandidateMessage, state: MindState): RuntimeDecision {
    return { trustDelta: 0.1, emotion: "neutral" };
  }
}

class StaticUXCalculator implements VoiceUXCalculator {
  calculateUX(state: MindState, decision: RuntimeDecision, message: CandidateMessage): VoiceInput {
    return {
      text: message.text,
      delayMs: 200,
      speechRate: 1.0,
      interruptionChance: 0,
      silenceProbability: 0
    };
  }
}

function runSequence(seed: string) {
  const facade = new ExecutionFacade();
  const orchestrator = new RuntimeOrchestrator(facade, new StaticGovernor(), new StaticUXCalculator());
  
  orchestrator.initSession(seed, { trust: 0.5, suspicion: 0.5, pressure: 50, emotion: "neutral" }, 1000);
  
  const step1 = orchestrator.step({ sessionId: seed, timestamp: 1010 }, { text: "Hello" });
  const step2 = orchestrator.step({ sessionId: seed, timestamp: 1020 }, { text: "World" });

  const state = facade.getState(seed);
  const journal = facade.getSession(seed)?.journal;
  
  return {
    state,
    journal,
    step1Result: step1.ok ? step1.value : null,
    step2Result: step2.ok ? step2.value : null,
  };
}

describe("P6.7 - A2 Determinism Audit", () => {
  it("should yield identical output for 3 consecutive identical runs", () => {
    const run1 = runSequence("session_audit");
    const run2 = runSequence("session_audit");
    const run3 = runSequence("session_audit");

    expect(run1).toEqual(run2);
    expect(run2).toEqual(run3);
    
    // Deeper explicit assertions
    expect(run1.journal?.entries.length).toBe(4);
  });
});
