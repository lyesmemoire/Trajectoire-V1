/**
 * Tracks deep engagement metrics for the Replay experience.
 */
export declare const ReplayAnalytics: {
    opened: (sessionId: string, isFirstTime: boolean) => void;
    momentRewatched: (sessionId: string, momentId: string, momentTitle: string) => void;
    completed: (sessionId: string, timeSpentSeconds: number) => void;
    abandoned: (sessionId: string, lastMomentSeen: number) => void;
    nextSessionStarted: (sessionId: string, fromReplay: boolean) => void;
};
//# sourceMappingURL=track-replay-engagement.d.ts.map