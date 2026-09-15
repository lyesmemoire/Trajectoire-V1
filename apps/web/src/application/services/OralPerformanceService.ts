export type OralPerformance = {
  durationMs: number;
  wordCount: number;
  wordsPerMinute: number | null;
  fillerWords: {
    total: number;
    detected: string[];
    ratePer100Words: number;
  };
  hesitationCount: number;
  longPauseCount: number | null;
  responseLatencyMs: number | null;
  flags: {
    tooShort: boolean;
    tooLong: boolean;
    rushed: boolean;
    slow: boolean;
    highFillerRate: boolean;
  };
};

const FILLER_WORDS = [
  "euh", "euhm", "hum", "ben", "bah", "du coup", "en fait", "voilà"
];

// Configuration thresholds
const THRESHOLDS = {
  MIN_DURATION_MS: 3000,
  MAX_DURATION_MS: 180000,
  RUSHED_WPM: 160,
  SLOW_WPM: 90,
  HIGH_FILLER_RATE: 5 // per 100 words
};

export class OralPerformanceService {
  /**
   * Calculates deterministic objective oral performance metrics.
   * If durationMs is not provided, it's a text response -> returns null.
   */
  static analyze(content: string, durationMs?: number): OralPerformance | null {
    if (!durationMs || durationMs <= 0 || !content.trim()) {
      return null;
    }

    const words = content.trim().split(/\s+/).filter(w => w.length > 0);
    const wordCount = words.length;

    // Words Per Minute
    const minutes = durationMs / 60000;
    const wordsPerMinute = minutes > 0 ? Math.round(wordCount / minutes) : null;

    // Filler detection (conservative, deterministic)
    const lowerContent = content.toLowerCase();
    const detected: string[] = [];
    let totalFillers = 0;

    for (const filler of FILLER_WORDS) {
      // Use unicode letter boundaries to correctly match accented words like 'voilà'
      const regex = new RegExp(`(^|[^\\p{L}])${filler}(?=[^\\p{L}]|$)`, 'gu');
      const matches = lowerContent.match(regex);
      if (matches) {
        detected.push(filler);
        totalFillers += matches.length;
      }
    }

    const ratePer100Words = wordCount > 0 ? (totalFillers / wordCount) * 100 : 0;

    // Hesitation count (can be correlated to fillers + repeated words, but for now we map it to totalFillers if deterministic)
    // We could detect "euh" as hesitations specifically. We'll map it to totalFillers for simplicity since no LLM is used.
    const hesitationCount = totalFillers;

    return {
      durationMs,
      wordCount,
      wordsPerMinute,
      fillerWords: {
        total: totalFillers,
        detected,
        ratePer100Words: Number(ratePer100Words.toFixed(1))
      },
      hesitationCount,
      longPauseCount: null, // Cannot deterministically count long pauses from transcript length alone
      responseLatencyMs: null, // Requires tracking on frontend, not reliably available purely from transcript yet
      flags: {
        tooShort: durationMs < THRESHOLDS.MIN_DURATION_MS,
        tooLong: durationMs > THRESHOLDS.MAX_DURATION_MS,
        rushed: wordsPerMinute !== null && wordsPerMinute > THRESHOLDS.RUSHED_WPM,
        slow: wordsPerMinute !== null && wordsPerMinute < THRESHOLDS.SLOW_WPM,
        highFillerRate: ratePer100Words > THRESHOLDS.HIGH_FILLER_RATE
      }
    };
  }

  /**
   * Aggregates multiple OralPerformance records into a single OralSummary.
   */
  static aggregateSummary(performances: (OralPerformance | null | undefined)[]) {
    const valid = performances.filter((p): p is OralPerformance => p !== null && p !== undefined);
    if (valid.length === 0) return undefined;

    let totalWpm = 0;
    let wpmCount = 0;
    let totalFillers = 0;
    let totalDuration = 0;
    let totalWords = 0;
    let rushed = 0;
    let slow = 0;
    let tooLong = 0;

    for (const perf of valid) {
      if (perf.wordsPerMinute !== null) {
        totalWpm += perf.wordsPerMinute;
        wpmCount++;
      }
      totalFillers += perf.fillerWords.total;
      totalDuration += perf.durationMs;
      totalWords += perf.wordCount;
      if (perf.flags.rushed) rushed++;
      if (perf.flags.slow) slow++;
      if (perf.flags.tooLong) tooLong++;
    }

    return {
      analyzedResponses: valid.length,
      averageWordsPerMinute: wpmCount > 0 ? Math.round(totalWpm / wpmCount) : null,
      totalFillerWords: totalFillers,
      fillerRatePer100Words: totalWords > 0 ? Number(((totalFillers / totalWords) * 100).toFixed(1)) : 0,
      averageResponseDurationMs: Math.round(totalDuration / valid.length),
      rushedResponses: rushed,
      slowResponses: slow,
      tooLongResponses: tooLong,
    };
  }
}
