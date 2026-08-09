/**
 * lib/voice/client.ts — Client WebSocket vocal navigateur (P3.3 + P3.4).
 * Optimized for Ultra-Low Latency (< 1.5s perceived RTT).
 */
export type VoiceClientState = "idle" | "connecting" | "listening" | "thinking" | "speaking" | "error";
export interface VoiceClientCallbacks {
    onState?: (state: VoiceClientState) => void;
    onTranscript?: (text: string, final: boolean) => void;
    onFeedback?: (msg: {
        feedback: string;
        score: number;
        question: string;
        signal: string;
        finished: boolean;
    }) => void;
    onError?: (message: string) => void;
}
export interface VoiceClientOptions {
    url: string;
    gap?: string;
    question?: string;
    bargeInThreshold?: number;
}
export declare class VoiceClient {
    private readonly options;
    private readonly cb;
    private ws;
    private media;
    private recorder;
    private audioCtx;
    private analyser;
    private monitorRAF;
    private audioQueue;
    private playing;
    private currentSource;
    private sessionId;
    private reconnectAttempt;
    private manualStop;
    private seenEvents;
    private state;
    private speechEndTimestamp;
    private llmStartTimestamp;
    private firstTokenTimestamp;
    private ttsStartTimestamp;
    private audioPlayStartTimestamp;
    private streamAbortController;
    constructor(options: VoiceClientOptions, cb?: VoiceClientCallbacks);
    getState(): VoiceClientState;
    private setState;
    private fail;
    start(): Promise<void>;
    private buildUrl;
    private connect;
    private scheduleReconnect;
    private startMic;
    private setupBargeIn;
    private bargeIn;
    endSpeech(): void;
    stop(): void;
    private onMessage;
    private ensureCtx;
    private enqueueAudio;
    private drainQueue;
    private playOne;
    private abortAudio;
    /**
     * Premium Streaming Pipeline: LLM Stream -> Sentence Chunking -> TTS Stream.
     * Optimizes TTFP (Time To First Phoneme) by not waiting for the full LLM response.
     */
    processPremiumAudio(transcript: string, context: string): Promise<void>;
    private sendToTTS;
}
//# sourceMappingURL=client.d.ts.map