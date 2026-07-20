import { SessionGovernor, CandidateMessage, SessionResult } from "./types.js";
import { ExecutionFacade } from "../p5/integration/execution-facade.js";

export class SessionRuntimeAdapter {
  constructor(
    private readonly facade: ExecutionFacade,
    private readonly governor: SessionGovernor
  ) {}

  public handleCandidateMessage(
    sessionId: string,
    message: CandidateMessage,
    timestamp: number
  ): SessionResult {
    const currentState = this.facade.getState(sessionId);

    if (!currentState) {
      return { ok: false, reason: `Session not found: ${sessionId}` };
    }

    const decision = this.governor.decide(message, currentState);
    const executionResult = this.facade.execute(sessionId, decision, timestamp);

    if (!executionResult) {
      return { ok: false, reason: "Execution failed or invalid decision" };
    }

    return {
      ok: true,
      value: {
        sessionId,
        timestamp,
        state: executionResult.next,
        decision,
        journalSize: executionResult.journalSize,
        timelineTick: executionResult.timelineTick,
      },
    };
  }
}
