import { MindState, P5Event } from "../execution-contract";
import { reduceMind } from "../reduceMind";
import { createSnapshot } from "../snapshot/create-snapshot";
import { MindSnapshot } from "../snapshot/snapshot-contract";
import { EventJournal } from "../journal/journal-contract";
import { createJournal } from "../journal/journal";
import { appendEvent } from "../journal/append-event";
import { Timeline } from "../timeline/timeline-contract";
import { createTimeline } from "../timeline/timeline";
import { appendTick } from "../timeline/append-tick";
import { beginTransaction } from "../transaction/begin-transaction";
import { applyTransaction } from "../transaction/apply-transaction";
import { commitTransaction } from "../transaction/commit-transaction";
import { rollbackTransaction } from "../transaction/rollback-transaction";
import { RuntimeDecision, ExecutionResult } from "./integration-contract";
import { adaptDecision } from "./governor-adapter";

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
export function createSession(state: MindState, timestamp: number): ExecutionSession {
  return {
    state,
    journal: createJournal(),
    timeline: createTimeline(),
    initialSnapshot: createSnapshot(state, timestamp),
  };
}

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
export function executeDecision(
  session: ExecutionSession,
  decision: RuntimeDecision,
  timestamp: number,
): { session: ExecutionSession; result: ExecutionResult | null } {
  const adapted = adaptDecision(decision);

  if (!adapted.valid) {
    return { session, result: null };
  }

  const previous = session.state;

  // Begin transaction
  let tx = beginTransaction(session.state, timestamp);
  for (const event of adapted.events) {
    tx = applyTransaction(tx, event);
  }

  // Commit
  const committed = commitTransaction(tx);

  // Update journal
  let journal = session.journal;
  for (const event of adapted.events) {
    journal = appendEvent(journal, event);
  }

  // Update timeline
  let timeline = session.timeline;
  for (const event of adapted.events) {
    timeline = appendTick(timeline, event);
  }

  const nextSession: ExecutionSession = {
    state: committed.state,
    journal,
    timeline,
    initialSnapshot: session.initialSnapshot,
  };

  const result: ExecutionResult = {
    previous,
    next: committed.state,
    journalSize: journal.entries.length,
    timelineTick: timeline.entries.length,
  };

  return { session: nextSession, result };
}
