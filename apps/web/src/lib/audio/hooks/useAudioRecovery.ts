"use client";

import { useState, useCallback, useRef } from "react";

export function useAudioRecovery() {
  const [isRecovering, setIsRecovering] = useState(false);
  const lastStateRef = useRef<any>(null);

  const saveSessionState = useCallback((state: any) => {
    lastStateRef.current = state;
    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        "interview_audio_state",
        JSON.stringify({
          ...state,
          timestamp: Date.now(),
        }),
      );
    }
  }, []);

  const attemptRecovery = useCallback(() => {
    if (typeof window === "undefined") return null;

    const saved = sessionStorage.getItem("interview_audio_state");
    if (!saved) return null;

    const parsed = JSON.parse(saved);
    const age = Date.now() - parsed.timestamp;

    // Only recover if state is less than 5 minutes old
    if (age < 300000) {
      console.info(
        "[Audio Recovery] Found valid session state, attempting recovery...",
      );
      return parsed;
    }

    return null;
  }, []);

  return {
    saveSessionState,
    attemptRecovery,
    isRecovering,
    setIsRecovering,
  };
}
