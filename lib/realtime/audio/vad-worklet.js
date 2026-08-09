// lib/realtime/audio/vad-worklet.ts
// ------------------------------------------------------------
// This module loads the AudioWorklet processor defined in
// `audio-worklet.js` and provides a convenient `initVAD` function
// that mirrors the previous ScriptProcessor API.
// ------------------------------------------------------------
/**
 * Load the VAD AudioWorklet into the provided AudioContext.
 * @param audioCtx The AudioContext where the worklet will be added.
 * @returns A promise that resolves when the processor is ready.
 */
export async function loadVADWorklet(audioCtx) {
    // The worklet script is served from the public folder at runtime.
    // In a Next.js app, `public/` is served at the root URL.
    await audioCtx.audioWorklet.addModule("/audio-worklet.js");
}
/**
 * Initialise VAD using the AudioWorklet processor.
 * The returned object mirrors the old `initVAD` signature used by the UI.
 */
export function initVADWorklet(audioCtx, onSpeechStart, onSpeechEnd, options = {}) {
    const node = new AudioWorkletNode(audioCtx, "vad-processor", {
        parameterData: {
            silenceThreshold: options.silenceThreshold ?? 0.02,
            minSpeechMs: options.minSpeechMs ?? 300,
            maxSilenceMs: options.maxSilenceMs ?? 800,
        },
    });
    node.port.onmessage = (event) => {
        const { type } = event.data;
        if (type === "speechStart")
            onSpeechStart();
        if (type === "speechEnd")
            onSpeechEnd();
    };
    return node;
}
//# sourceMappingURL=vad-worklet.js.map