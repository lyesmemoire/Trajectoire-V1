/**
 * Session Recovery Service
 * Persists interview state in Supabase instead of localStorage.
 */
export interface SessionSnapshot {
    sessionId: string;
    currentIndex: number;
    personaId: string;
    jobTitle: string;
    timestamp: number;
    isVoiceEnabled: boolean;
    pressureLevel: number | null;
    previousAnswers?: Array<{
        question: string;
        answer: string;
    }>;
}
export declare const SessionRecovery: {
    saveSnapshot(snapshot: SessionSnapshot): Promise<void>;
    getValidSnapshot(sessionId: string): Promise<SessionSnapshot | null>;
    clear(sessionId: string): Promise<void>;
};
//# sourceMappingURL=session-recovery.d.ts.map