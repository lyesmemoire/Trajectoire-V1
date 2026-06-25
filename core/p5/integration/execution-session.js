import { createSnapshot } from "../snapshot/create-snapshot.js";
import { createJournal } from "../journal/journal.js";
import { appendEvent } from "../journal/append-event.js";
import { createTimeline } from "../timeline/timeline.js";
import { appendTick } from "../timeline/append-tick.js";
import { beginTransaction } from "../transaction/begin-transaction.js";
import { applyTransaction } from "../transaction/apply-transaction.js";
import { commitTransaction } from "../transaction/commit-transaction.js";
import { adaptDecision } from "./governor-adapter.js";
/**
 * Creates a new execution session from an initial MindState.
 */
export function createSession(state, timestamp) {
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
export function executeDecision(session, decision, timestamp) {
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
    const nextSession = {
        state: committed.state,
        journal,
        timeline,
        initialSnapshot: session.initialSnapshot,
    };
    const result = {
        previous,
        next: committed.state,
        journalSize: journal.entries.length,
        timelineTick: timeline.entries.length,
    };
    return { session: nextSession, result };
}
//# sourceMappingURL=execution-session.js.map