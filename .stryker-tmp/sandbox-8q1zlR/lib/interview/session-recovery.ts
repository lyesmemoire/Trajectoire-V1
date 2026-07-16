// @ts-nocheck
import { createAdminClientSupabase } from "@/lib/supabase/admin";

/**
 * Session Recovery Service
 * Persists interview state in Supabase instead of localStorage.
 */

export interface SessionSnapshot {
  sessionId: string;
  currentIndex: number;
  personaId: string;
  jobTitle: string;
  timestamp: number;
  isVoiceEnabled: boolean;
  pressureLevel: number | null;
  previousAnswers?: Array<{ question: string; answer: string }>;
}

const supabase = createAdminClientSupabase();

export const SessionRecovery = {
  async saveSnapshot(snapshot: SessionSnapshot) {
    const { error } = await supabase
      .from("interview_sessions")
      .update({
        recovery_state: snapshot,
        updated_at: new Date().toISOString(),
      })
      .eq("id", snapshot.sessionId);

    if (error) console.error("Failed to save session snapshot:", error);
  },

  async getValidSnapshot(sessionId: string): Promise<SessionSnapshot | null> {
    const { data, error } = await supabase
      .from("interview_sessions")
      .select("recovery_state, updated_at")
      .eq("id", sessionId)
      .single();

    if (error || !data?.recovery_state) return null;

    const snapshot: SessionSnapshot = data.recovery_state;
    const age = Date.now() - snapshot.timestamp;

    // Expire after 2 hours
    if (age > 1000 * 60 * 60 * 2) return null;

    return snapshot;
  },

  async clear(sessionId: string) {
    await supabase
      .from("interview_sessions")
      .update({ recovery_state: null })
      .eq("id", sessionId);
  },
};
