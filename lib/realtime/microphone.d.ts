export declare class MicrophoneCapture {
    private context;
    private stream;
    private source;
    private worklet;
    onAudioData: ((float32Array: Float32Array) => void) | null;
    start(): Promise<void>;
    stop(): void;
}
//# sourceMappingURL=microphone.d.ts.map