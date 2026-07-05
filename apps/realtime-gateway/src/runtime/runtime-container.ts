import { RuntimeOrchestrator } from "@trajectoire/voice-core/p6";
import { ExecutionFacade } from "@trajectoire/voice-core/p5";
import { SessionGovernor, CandidateMessage } from "@trajectoire/voice-core/p6";
import { VoiceUXCalculator } from "@trajectoire/voice-core/p6";
import { MindState } from "@trajectoire/voice-core/p5";
import { RuntimeDecision } from "@trajectoire/voice-core/p5";
import { VoiceInput } from "@trajectoire/voice-core/p6";

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
