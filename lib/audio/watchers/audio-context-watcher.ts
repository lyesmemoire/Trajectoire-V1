/**
 * Surveille l'état de l'AudioContext pour détecter les suspensions système (Safari iOS).
 * Client-side file - console.log is appropriate for browser debugging
 */
export function createAudioContextWatcher(
  context: AudioContext,
  onStateChange: (state: AudioContextState) => void,
) {
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
export async function resumeAudioContext(
  context: AudioContext,
): Promise<boolean> {
  if (context.state === "suspended") {
    try {
      await context.resume();
      return (context.state as AudioContextState) === "running";
    } catch (e) {
      console.error("[Audio Recovery] Failed to resume AudioContext", e);
      return false;
    }
  }
  return true;
}
