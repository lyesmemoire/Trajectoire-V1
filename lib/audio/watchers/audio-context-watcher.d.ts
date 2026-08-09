/**
 * Surveille l'état de l'AudioContext pour détecter les suspensions système (Safari iOS).
 */
export declare function createAudioContextWatcher(context: AudioContext, onStateChange: (state: AudioContextState) => void): () => void;
/**
 * Tente de reprendre l'AudioContext après une suspension (ex: appel entrant).
 */
export declare function resumeAudioContext(context: AudioContext): Promise<boolean>;
//# sourceMappingURL=audio-context-watcher.d.ts.map