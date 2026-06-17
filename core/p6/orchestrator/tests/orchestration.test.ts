import { describe, it, expect, vi } from "vitest";
import { RuntimeOrchestrator } from "../runtime-orchestrator";
import { ExecutionFacade } from "../../../p5/integration/execution-facade";
import { SessionGovernor, CandidateMessage } from "../../types";
import { VoiceUXCalculator } from "../orchestrator-contract";
import { MindState } from "../../../p5/execution-contract";
import { RuntimeDecision } from "../../../p5/integration/integration-contract";
import { VoiceInput } from "../../voice/voice-contract";

describe("P6.5 - Orchestration Guarantees", () => {
  it("O3, O4, O5, O6: should guarantee 1:1 mapping through the pipeline", () => {
    const mockGovernorDecide = vi.fn((msg: CandidateMessage, state: MindState) => {
      return { trustDelta: 0.1 };
    });
    const mockGovernor: SessionGovernor = { decide: mockGovernorDecide };

    const mockUXCalculate = vi.fn((state: MindState, dec: RuntimeDecision, msg: CandidateMessage) => {
      return {
        text: "Pipeline 1:1",
        delayMs: 100,
        speechRate: 1.0,
        interruptionChance: 0,
        silenceProbability: 0,
      };
    });
    const mockUX: VoiceUXCalculator = { calculateUX: mockUXCalculate };

    const facade = new ExecutionFacade();
    const orchestrator = new RuntimeOrchestrator(facade, mockGovernor, mockUX);
    
    orchestrator.initSession("s1", { trust: 0.5, suspicion: 0.5, pressure: 50, emotion: "neutral" }, 1000);
    
    const result = orchestrator.step({ sessionId: "s1", timestamp: 1010 }, { text: "Step" });

    expect(result.ok).toBe(true);
    
    // O3: 1 decision per message
    expect(mockGovernorDecide).toHaveBeenCalledTimes(1);
    
    // O4: 1 mutation (since facade returns a single state, and UX receives it)
    expect(mockUXCalculate).toHaveBeenCalledTimes(1);
    
    if (result.ok) {
      // O5 & O6 implied by exactly one plan and exactly one commands array generated
      expect(result.value.voicePlan).toBeDefined();
      expect(result.value.commands).toBeDefined();
      expect(Array.isArray(result.value.commands)).toBe(true);
      
      // Check the exact chain worked: decision -> UX -> plan -> commands
      expect(result.value.voicePlan.utterance).toBe("Pipeline 1:1");
      expect(result.value.commands).toEqual([
        { type: "WAIT", ms: 100 },
        { type: "SPEAK", text: "Pipeline 1:1", speechRate: 1.0 },
        { type: "START_LISTENING" }
      ]);
    }
  });
});
