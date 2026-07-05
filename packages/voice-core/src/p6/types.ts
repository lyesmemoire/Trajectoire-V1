import { MindState } from "../p5/execution-contract.js";
import { RuntimeDecision } from "../p5/integration/integration-contract.js";

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
