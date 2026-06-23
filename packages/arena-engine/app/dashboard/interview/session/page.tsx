"use client";

import { useState, useEffect } from "react";
import { SessionRecovery, SessionSnapshot } from "@/lib/interview/session-recovery";

export default function InterviewSession() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [recoveredSnapshot, setRecoveredSnapshot] = useState<SessionSnapshot | null>(null);

  // Auto-restore from Supabase on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sid = params.get("sessionId");

    if (sid) {
      setSessionId(sid);

      SessionRecovery.getValidSnapshot(sid).then((snapshot) => {
        if (snapshot) {
          setRecoveredSnapshot(snapshot);
          // TODO: Restore state into React (currentIndex, persona, answers, etc.)
          console.log("Session restored from Supabase:", snapshot);
        }
      });
    }
  }, []);

  // Save snapshot to Supabase on important state changes
  const saveProgress = async (snapshot: Partial<SessionSnapshot>) => {
    if (!sessionId) return;

    await SessionRecovery.saveSnapshot({
      sessionId,
      currentIndex: snapshot.currentIndex ?? 0,
      personaId: snapshot.personaId ?? "faang",
      jobTitle: snapshot.jobTitle ?? "",
      timestamp: Date.now(),
      isVoiceEnabled: snapshot.isVoiceEnabled ?? true,
      pressureLevel: snapshot.pressureLevel ?? null,
    });
  };

  // Example usage when state changes
  // saveProgress({ currentIndex: 3, pressureLevel: 42 });

  return (
    <div>
      {/* ... existing UI ... */}
      {recoveredSnapshot && (
        <div className="text-xs text-[var(--text-secondary)]">
          Session restored from previous device/browser
        </div>
      )}
    </div>
  );
}
