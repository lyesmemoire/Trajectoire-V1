export interface HumanizedFeedback {
    insight: string;
    reassurance: string;
}
/**
 * Traduit les métriques d'IA en coaching humain protecteur.
 * Interdiction stricte de montrer des scores ou des index.
 */
export declare function humanizeBehavioralSignals(signals: {
    verbosity: number;
    clarity: number;
    hesitation: number;
    ownership: number;
}): HumanizedFeedback;
//# sourceMappingURL=humanize-insights.d.ts.map