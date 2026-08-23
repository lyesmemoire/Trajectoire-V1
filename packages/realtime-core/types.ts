import { MindState } from "@trajectoire/execution-core/execution-contract";
import { RuntimeDecision } from "@trajectoire/execution-core/integration/integration-contract";

export interface CandidateMessage {
  text: string;
  metadata?: Record<string, unknown>;
}

export interface SessionGovernor {
  decide(
    message: CandidateMessage,
    currentState: MindState
  ): RuntimeDecision;
}

export interface RuntimeTurnResult {
  sessionId: string;
  timestamp: number;

  state: MindState;
  decision: RuntimeDecision;

  journalSize: number;
  timelineTick: number;
}

export type SessionResult =
  | { ok: true; value: RuntimeTurnResult }
  | { ok: false; reason: string };
