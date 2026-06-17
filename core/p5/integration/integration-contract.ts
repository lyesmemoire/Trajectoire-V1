import { MindState } from "../execution-contract";

/**
 * A decision coming from the runtime layer (Governor, Voice Runtime, etc.).
 * Identical shape to GovernorDecision — kept as a separate type to mark
 * the integration boundary explicitly.
 */
export interface RuntimeDecision {
  trustDelta?: number;
  suspicionDelta?: number;
  pressureDelta?: number;
  emotion?: string;
}

/**
 * Result of executing a decision within a session.
 */
export interface ExecutionResult {
  readonly previous: MindState;
  readonly next: MindState;
  readonly journalSize: number;
  readonly timelineTick: number;
}
