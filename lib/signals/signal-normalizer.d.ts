export interface RawSignal {
    type: string;
    value: number;
    metadata?: unknown;
}
export interface NormalizedSignal {
    key: string;
    score: number;
    impact: "positive" | "negative" | "neutral";
    timestamp: string;
}
/**
 * Normalizes and filters incoming behavioral signals.
 */
export declare function normalizeSignal(raw: _RawSignal): NormalizedSignal;
/**
 * Aggregates a list of signals into a compact summary to save DB space.
 */
export declare function compressSignals(signals: NormalizedSignal[]): unknown;
//# sourceMappingURL=signal-normalizer.d.ts.map