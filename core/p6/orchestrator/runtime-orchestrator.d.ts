import { OrchestratorResult, RuntimeContext, VoiceUXCalculator } from "./orchestrator-contract.js";
import { CandidateMessage, SessionGovernor } from "../types.js";
import { ExecutionFacade } from "../../p5/integration/execution-facade.js";
import { MindState } from "../../p5/execution-contract.js";
export declare class RuntimeOrchestrator {
    private readonly facade;
    private readonly governor;
    private readonly uxCalculator;
    private lifecycles;
    constructor(facade: ExecutionFacade, governor: SessionGovernor, uxCalculator: VoiceUXCalculator);
    initSession(sessionId: string, initialState: MindState, timestamp: number): void;
    step(context: RuntimeContext, message: CandidateMessage): OrchestratorResult;
    dispatchLifecycleEvent(sessionId: string, event: import("../lifecycle/lifecycle-contract.js").LifecycleEvent): boolean;
}
//# sourceMappingURL=runtime-orchestrator.d.ts.map