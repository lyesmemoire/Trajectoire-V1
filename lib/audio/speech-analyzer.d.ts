export interface SpeechAnalysisResult {
    wordsPerMinute: number;
    wordsPerMinuteRating: SpeedRating;
    totalWords: number;
    totalDurationSeconds: number;
    pauseCount: number;
    averagePauseDuration: number;
    longPauseCount: number;
    pauseRatio: number;
    fillerWords: FillerWordOccurrence[];
    fillerWordCount: number;
    fillerWordRate: number;
    speedVariation: number;
    speedVariationRating: string;
    overallScore: number;
    overallRating: OverallRating;
    recommendations: Recommendation[];
    segments: SpeechSegment[];
}
export type SpeedRating = "too_slow" | "slow" | "ideal" | "fast" | "too_fast";
export type OverallRating = "excellent" | "good" | "average" | "needs_work" | "poor";
export interface FillerWordOccurrence {
    word: string;
    count: number;
    timestamps: number[];
}
export interface Recommendation {
    type: "speed" | "pauses" | "fillers" | "variation" | "general";
    severity: "info" | "warning" | "critical";
    title: string;
    description: string;
    tip: string;
}
export interface SpeechSegment {
    startTime: number;
    endTime: number;
    wordsPerMinute: number;
    isSilence: boolean;
    text: string;
}
export declare class SpeechAnalyzer {
    private audioContext;
    private analyserNode;
    private stream;
    private volumeHistory;
    private segmentBuffer;
    private recordingStart;
    private isCurrentlySilent;
    private silenceStart;
    initialize(): Promise<void>;
    connectStream(stream: MediaStream): Promise<void>;
    getCurrentVolumeDb(): number;
    startVolumeTracking(intervalMs?: number): () => void;
    private detectSilence;
    analyzeTranscript(transcript: string, durationSeconds: number, segments?: unknown[]): SpeechAnalysisResult;
    private rateWPM;
    private detectFillerWords;
    private analyzeWhisperSegments;
    private analyzeSpeedVariation;
    private computeScore;
    private rateOverall;
    private buildRecommendations;
    destroy(): void;
}
export declare const speechAnalyzer: SpeechAnalyzer;
//# sourceMappingURL=speech-analyzer.d.ts.map