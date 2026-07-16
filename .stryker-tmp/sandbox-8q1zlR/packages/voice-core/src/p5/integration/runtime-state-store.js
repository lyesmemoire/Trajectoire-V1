/**
 * Minimal in-memory session store.
 *
 * No disk. No database. No network. No Redis.
 * Exists to manage session lifecycle for runtime integration.
 */
// @ts-nocheck

export class RuntimeStateStore {
    sessions = new Map();
    /** Store or update a session. */
    setSession(sessionId, session) {
        this.sessions.set(sessionId, session);
    }
    /** Retrieve a session by ID. Returns undefined if not found. */
    getSession(sessionId) {
        return this.sessions.get(sessionId);
    }
    /** Delete a session. Returns true if it existed. */
    deleteSession(sessionId) {
        return this.sessions.delete(sessionId);
    }
    /** Remove all sessions. */
    clear() {
        this.sessions.clear();
    }
    /** Number of active sessions. */
    get size() {
        return this.sessions.size;
    }
}
//# sourceMappingURL=runtime-state-store.js.map