// @ts-nocheck
import { OrchestratorResult, RuntimeContext, VoiceUXCalculator } from "./orchestrator-contract.js";
import { CandidateMessage, SessionGovernor } from "../types.js";
import { SessionLifecycleState } from "../lifecycle/lifecycle-contract.js";
import { reduceLifecycle } from "../lifecycle/lifecycle-reducer.js";
import { ExecutionFacade } from "../../p5/integration/execution-facade.js";
import { buildVoicePlan } from "../voice/build-plan.js";
import { buildTransportCommands } from "../transport/command-builder.js";
import { MindState } from "../../p5/execution-contract.js";

export class RuntimeOrchestrator {
  private lifecycles = new Map<string, SessionLifecycleState>();

  constructor(
    private readonly facade: ExecutionFacade,
    private readonly governor: SessionGovernor,
    private readonly uxCalculator: VoiceUXCalculator
  ) {}

  public initSession(sessionId: string, initialState: MindState, timestamp: number): void {
    this.lifecycles.set(sessionId, "CREATED");
    this.facade.initSession(sessionId, initialState, timestamp);
    // Move to ACTIVE
    const nextLifecycle = reduceLifecycle("CREATED", { type: "START" });
    this.lifecycles.set(sessionId, nextLifecycle);
  }

  public step(context: RuntimeContext, message: CandidateMessage): OrchestratorResult {
    const { sessionId, timestamp } = context;

    // 1. Validation lifecycle
    const lifecycle = this.lifecycles.get(sessionId);
    if (!lifecycle) {
      return { ok: false, sessionId, reason: "SESSION_NOT_FOUND" };
    }
    if (lifecycle !== "ACTIVE") {
      return { ok: false, sessionId, reason: "SESSION_NOT_ACTIVE" };
    }

    // 2. Fetch P5 state
    const state = this.facade.getState(sessionId);
    if (!state) {
      return { ok: false, sessionId, reason: "SESSION_NOT_FOUND" };
    }

    // 3. Governor decision
    const decision = this.governor.decide(message, state);

    // 4. ExecutionFacade
    const executionResult = this.facade.execute(sessionId, decision, timestamp);
    if (!executionResult) {
      return { ok: false, sessionId, reason: "EXECUTION_ERROR" };
    }

    // 5. Voice Binding (Calculate UX -> VoiceInput -> VoicePlan)
    const voiceInput = this.uxCalculator.calculateUX(executionResult.next, decision, message);
    const voicePlan = buildVoicePlan(voiceInput);

    // 6. Transport adapter
    const commands = buildTransportCommands(voicePlan);

    // 7. Aggregate Result
    return {
      ok: true,
      value: {
        sessionId,
        timestamp,
        lifecycle: "ACTIVE", // unchanged by step by default, could be updated if event generated
        state: executionResult.next,
        decision,
        voicePlan,
        commands,
      },
    };
  }

  // Lifecycle management
  public dispatchLifecycleEvent(sessionId: string, event: import("../lifecycle/lifecycle-contract.js").LifecycleEvent): boolean {
    const current = this.lifecycles.get(sessionId);
    if (!current) return false;
    try {
      const next = reduceLifecycle(current, event);
      this.lifecycles.set(sessionId, next);
      return true;
    } catch {
      return false;
    }
  }
}
