/**
 * Surveille l'état de l'AudioContext pour détecter les suspensions système (Safari iOS).
 */
export function createAudioContextWatcher(context, onStateChange) {
    const handleStateChange = () => {
        console.log(`[AudioContext Watcher] State: ${context.state}`);
        onStateChange(context.state);
    };
    context.addEventListener("statechange", handleStateChange);
    return () => {
        context.removeEventListener("statechange", handleStateChange);
    };
}
/**
 * Tente de reprendre l'AudioContext après une suspension (ex: appel entrant).
 */
export async function resumeAudioContext(context) {
    if (context.state === "suspended") {
        try {
            await context.resume();
            return context.state === "running";
        }
        catch (error) {
            console.error("[Audio Recovery] Failed to resume AudioContext", e);
            return false;
        }
    }
    return true;
}
//# sourceMappingURL=audio-context-watcher.js.map