import { MindState } from "../execution-contract.js";
import { RuntimeDecision, ExecutionResult } from "./integration-contract.js";
/**
 * High-level facade for the P5 execution engine.
 *
 * Provides a single entry point for runtime consumers:
 *   initSession → execute → execute → ... → destroySession
 *
 * All state management, journaling, timeline, and transactions
 * are handled internally.
 */
export declare class ExecutionFacade {
    private readonly store;
    /** Initialize a new execution session with the given initial state. */
    initSession(sessionId: string, initialState: MindState, timestamp: number): void;
    private commitListener?;
    onCommit(listener: (event: {
        sessionId: string;
        snapshotHash: string;
        journalPointer: string;
    }) => void): void;
    /**
     * Execute a decision within a session.
     *
     * Returns the ExecutionResult on success, or null if:
     * - The session does not exist.
     * - The decision is invalid.
     */
    execute(sessionId: string, decision: RuntimeDecision, timestamp: number): ExecutionResult | null;
    /** Get the current state of a session. */
    getState(sessionId: string): MindState | undefined;
    /** Get the full session (state + journal + timeline). */
    getSession(sessionId: string): import("./execution-session.js").ExecutionSession | undefined;
    /** Destroy a session. */
    destroySession(sessionId: string): boolean;
    /** Number of active sessions. */
    get activeSessions(): number;
}
//# sourceMappingURL=execution-facade.d.ts.map