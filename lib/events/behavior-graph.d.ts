export type BehaviorEventType = "LANDING_VIEW" | "CV_UPLOAD" | "ATS_ANALYSIS" | "INTERVIEW_START" | "VICTOR_INTERRUPT" | "CLARA_RECOVERY" | "REPLAY_VIEW" | "SESSION_RETRY" | "FREEZE_DETECTED";
interface BehaviorEventInput {
    userId: string;
    sessionId: string;
    type: BehaviorEventType;
    payload?: unknown;
    metadata?: {
        latencyMs?: number;
    };
}
/**
 * Moteur de Graphe Comportemental (Core Moat).
 * Transforme chaque interaction en un point de donnée lié dans un graphe de session.
 */
export declare function emitBehaviorEvent(event: BehaviorEventInput): Promise<any>;
export {};
//# sourceMappingURL=behavior-graph.d.ts.map