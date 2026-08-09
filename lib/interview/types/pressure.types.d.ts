export interface InterruptionSignals {
    verbosity: number;
    specificity: number;
    fillerDensity: number;
    relevanceScore: number;
    ramblingScore: number;
}
export type InterruptionType = "clarify" | "pressure" | "redirect" | "skeptical" | "speed_up";
export interface InterruptionDecision {
    shouldInterrupt: boolean;
    type: InterruptionType | null;
    reason: string | null;
}
//# sourceMappingURL=pressure.types.d.ts.map