import { useVoiceInterviewClient } from "../provider/VoiceInterviewProvider";
import { useEffect, useState } from "react";

/**
 * Experimental hook if the UI wants to manually trigger a barge-in event
 * instead of relying solely on the VAD.
 */
export function useBargeIn() {
  const client = useVoiceInterviewClient();
  const [bargeInCount, setBargeInCount] = useState(0);

  useEffect(() => {
    // We can listen to the raw event if we want to show a visual indicator
    const unsub = client.on("stateChanged", (event) => {
      // If we went from PlayingTTS -> Listening abruptly, it's a barge-in
      if (event.previousState === "PlayingTTS" && event.currentState === "Listening") {
        setBargeInCount((prev) => prev + 1);
      }
    });
    return unsub;
  }, [client]);

  return {
    bargeInCount,
  };
}
