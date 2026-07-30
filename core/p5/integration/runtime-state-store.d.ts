import { ExecutionSession } from "./execution-session.js";
/**
 * Minimal in-memory session store.
 *
 * No disk. No database. No network. No Redis.
 * Exists to manage session lifecycle for runtime integration.
 */
export declare class RuntimeStateStore {
    private readonly sessions;
    /** Store or update a session. */
    setSession(sessionId: string, session: ExecutionSession): void;
    /** Retrieve a session by ID. Returns undefined if not found. */
    getSession(sessionId: string): ExecutionSession | undefined;
    /** Delete a session. Returns true if it existed. */
    deleteSession(sessionId: string): boolean;
    /** Remove all sessions. */
    clear(): void;
    /** Number of active sessions. */
    get size(): number;
}
//# sourceMappingURL=runtime-state-store.d.ts.map