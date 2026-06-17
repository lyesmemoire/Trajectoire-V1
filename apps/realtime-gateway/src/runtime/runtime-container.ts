import { RuntimeOrchestrator } from "../../../../core/p6/orchestrator/runtime-orchestrator";
import { ExecutionFacade } from "../../../../core/p5/integration/execution-facade";
import { SessionGovernor, CandidateMessage } from "../../../../core/p6/types";
import { VoiceUXCalculator } from "../../../../core/p6/orchestrator/orchestrator-contract";
import { MindState } from "../../../../core/p5/execution-contract";
import { RuntimeDecision } from "../../../../core/p5/integration/integration-contract";
import { VoiceInput } from "../../../../core/p6/voice/voice-contract";

// Mocks for concrete implementation placeholders
class ConcreteGovernor implements SessionGovernor {
  decide(msg: CandidateMessage, state: MindState): RuntimeDecision {
    return { trustDelta: 0, emotion: "neutral" };
  }
}

class ConcreteUXCalculator implements VoiceUXCalculator {
  calculateUX(state: MindState, decision: RuntimeDecision, message: CandidateMessage): VoiceInput {
    return {
      text: message.text,
      delayMs: 250,
      speechRate: 1.0,
      interruptionChance: 0.1,
      silenceProbability: 0.1
    };
  }
}

export class RuntimeContainer {
  public readonly orchestrator: RuntimeOrchestrator;
  public readonly facade: ExecutionFacade;
  
  constructor() {
    this.facade = new ExecutionFacade();
    const governor = new ConcreteGovernor();
    const uxCalculator = new ConcreteUXCalculator();
    this.orchestrator = new RuntimeOrchestrator(this.facade, governor, uxCalculator);
  }
}

export function createRuntime(): RuntimeContainer {
  return new RuntimeContainer();
}
