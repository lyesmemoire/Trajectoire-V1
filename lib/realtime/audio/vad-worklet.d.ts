/**
 * Load the VAD AudioWorklet into the provided AudioContext.
 * @param audioCtx The AudioContext where the worklet will be added.
 * @returns A promise that resolves when the processor is ready.
 */
export declare function loadVADWorklet(audioCtx: AudioContext): Promise<void>;
/**
 * Initialise VAD using the AudioWorklet processor.
 * The returned object mirrors the old `initVAD` signature used by the UI.
 */
export declare function initVADWorklet(audioCtx: AudioContext, onSpeechStart: () => void, onSpeechEnd: () => void, options?: {
    silenceThreshold?: number;
    minSpeechMs?: number;
    maxSilenceMs?: number;
}): any;
//# sourceMappingURL=vad-worklet.d.ts.map