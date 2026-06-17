export interface RawSignal {
  type: string;
  value: number;
  metadata?: any;
}

export interface NormalizedSignal {
  key: string;
  score: number; // 0-1
  impact: "positive" | "negative" | "neutral";
  timestamp: string;
}

/**
 * Normalizes and filters incoming behavioral signals.
 */
export function normalizeSignal(raw: RawSignal): NormalizedSignal {
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
export function compressSignals(signals: NormalizedSignal[]): any {
  // Simple averaging for the demo
  const summary: Record<string, number> = {};
  signals.forEach((s) => {
    summary[s.key] = (summary[s.key] || 0) + s.score;
  });
  return summary;
}
