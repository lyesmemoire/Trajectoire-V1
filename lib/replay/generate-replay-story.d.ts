export interface ReplayCard {
    title: string;
    content: {
        positive: string;
        doubt: string;
        correction: string;
    };
}
export interface ReplaySimplified {
    headline: string;
    recruiterCard: ReplayCard;
    nextStep: {
        title: string;
        goal: string;
        duration: number;
    };
}
/**
 * Moteur de simplification radicale du Replay (v1.0).
 * Transforme un rapport complexe en une récompense psychologique de 20 secondes.
 */
export declare function generateSimplifiedReplay(session: _unknown): ReplaySimplified;
//# sourceMappingURL=generate-replay-story.d.ts.map