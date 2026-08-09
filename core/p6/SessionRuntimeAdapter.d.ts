import { SessionGovernor, CandidateMessage, SessionResult } from "./types.js";
import { ExecutionFacade } from "../p5/integration/execution-facade.js";
export declare class SessionRuntimeAdapter {
    private readonly facade;
    private readonly governor;
    constructor(facade: ExecutionFacade, governor: SessionGovernor);
    handleCandidateMessage(sessionId: string, message: CandidateMessage, timestamp: number): SessionResult;
}
//# sourceMappingURL=SessionRuntimeAdapter.d.ts.map