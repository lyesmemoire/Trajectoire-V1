export type ReplayEventType = "pressure_peak" | "interruption" | "hesitation" | "recovery" | "strong_answer" | "evasion" | "milestone";
export interface ReplayEvent {
    id: string;
    timestamp: number;
    type: ReplayEventType;
    title: string;
    description: string;
    pressureLevel: number;
    triggerSignal?: string;
    coachingAdvice?: string;
    originalText?: string;
    betterVersion?: string;
}
export interface SessionReplay {
    sessionId: string;
    events: ReplayEvent[];
    pressureCurve: {
        time: number;
        level: number;
    }[];
    archetype: string;
    overallCoaching: string;
}
//# sourceMappingURL=replay.types.d.ts.map