// @ts-nocheck
import { reduceLifecycle } from "../lifecycle/lifecycle-reducer.js";
import { buildVoicePlan } from "../voice/build-plan.js";
import { buildTransportCommands } from "../transport/command-builder.js";
export class RuntimeOrchestrator {
    facade;
    governor;
    uxCalculator;
    lifecycles = new Map();
    constructor(facade, governor, uxCalculator) {
        this.facade = facade;
        this.governor = governor;
        this.uxCalculator = uxCalculator;
    }
    initSession(sessionId, initialState, timestamp) {
        this.lifecycles.set(sessionId, "CREATED");
        this.facade.initSession(sessionId, initialState, timestamp);
        // Move to ACTIVE
        const nextLifecycle = reduceLifecycle("CREATED", { type: "START" });
        this.lifecycles.set(sessionId, nextLifecycle);
    }
    step(context, message) {
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
    dispatchLifecycleEvent(sessionId, event) {
        const current = this.lifecycles.get(sessionId);
        if (!current)
            return false;
        try {
            const next = reduceLifecycle(current, event);
            this.lifecycles.set(sessionId, next);
            return true;
        }
        catch {
            return false;
        }
    }
}
//# sourceMappingURL=runtime-orchestrator.js.map