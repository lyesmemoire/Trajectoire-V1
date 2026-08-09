/**
 * Normalizes and filters incoming behavioral signals.
 */
export function normalizeSignal(raw) {
    // Logic to clamp values and map to standard keys
    const score = Math.max(0, Math.min(100, raw.value)) / 100;
    return {
        key: raw.type.toLowerCase().replace(/\s+/g, "_"),
        score,
        impact: score > 0.7 ? "positive" : score < 0.4 ? "negative" : "neutral",
        timestamp: new Date().toISOString(),
    };
}
/**
 * Aggregates a list of signals into a compact summary to save DB space.
 */
export function compressSignals(signals) {
    // Simple averaging for the demo
    const summary = {};
    signals.forEach((s) => {
        summary[s.key] = (summary[s.key] || 0) + s.score;
    });
    return summary;
}
//# sourceMappingURL=signal-normalizer.js.map