import { useVoiceInterviewClient } from "../provider/VoiceInterviewProvider";
import { useInterviewStore } from "../stores/interview.store";
import { useState, useEffect } from "react";

export function useTranscript() {
  const client = useVoiceInterviewClient();
  const sessionId = useInterviewStore((state) => state.sessionId);
  const [transcript, setTranscript] = useState<string>("");

  useEffect(() => {
    // When session ID changes, we might want to reset local transcript state
    // For now, it resets when a new turn starts.
    setTranscript("");
  }, [sessionId]);

  const sendTranscript = (text: string) => {
    if (text.trim().length > 0) {
      client.sendTranscript(text);
      setTranscript("");
    }
  };

  return {
    transcript,
    setTranscript,
    sendTranscript,
  };
}
