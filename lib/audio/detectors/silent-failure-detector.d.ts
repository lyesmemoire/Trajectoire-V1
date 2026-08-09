/**
 * Détecte les échecs silencieux du micro (permissions OK mais volume nul).
 */
export declare class SilentFailureDetector {
    private analyser;
    private dataArray;
    private silenceCounter;
    private readonly THRESHOLD;
    private readonly MAX_SILENCE_SAMPLES;
    constructor(context: AudioContext, stream: MediaStream);
    check(onFailure: () => void): void;
}
//# sourceMappingURL=silent-failure-detector.d.ts.map