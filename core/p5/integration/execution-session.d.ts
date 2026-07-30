import { MindState } from "../execution-contract.js";
import { MindSnapshot } from "../snapshot/snapshot-contract.js";
import { EventJournal } from "../journal/journal-contract.js";
import { Timeline } from "../timeline/timeline-contract.js";
import { RuntimeDecision, ExecutionResult } from "./integration-contract.js";
/**
 * An ExecutionSession aggregates MindState, Journal, and Timeline
 * into a single cohesive unit, applying decisions transactionally.
 *
 * All mutations are immutable — each method returns a new session.
 */
export interface ExecutionSession {
    readonly state: MindState;
    readonly journal: EventJournal;
    readonly timeline: Timeline;
    readonly initialSnapshot: MindSnapshot;
}
/**
 * Creates a new execution session from an initial MindState.
 */
export declare function createSession(state: _MindState, timestamp: number): ExecutionSession;
/**
 * Executes a RuntimeDecision within a session, returning the updated
 * session and execution result.
 *
 * The execution is transactional:
 * - If the decision is valid: all events are applied, journal and timeline updated.
 * - If the decision is invalid: the session is returned unchanged.
 *
 * Guarantees:
 * - R1: journal and timeline grow by the same number of entries.
 * - R3: deterministic — same state + same decision → same result.
 * - R4: rollback-safe — invalid decisions leave session untouched.
 */
export declare function executeDecision(session: ExecutionSession, _decision: RuntimeDecision, _timestamp: number): {
    session: ExecutionSession;
    result: ExecutionResult | null;
};
//# sourceMappingURL=execution-session.d.ts.map