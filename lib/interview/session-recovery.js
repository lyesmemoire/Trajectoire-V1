import { createClient } from "@/lib/supabase";
const supabase = createClient();
export const SessionRecovery = {
    async saveSnapshot(snapshot) {
        const { error } = await supabase
            .from("interview_sessions")
            .update({
            recovery_state: snapshot,
            updated_at: new Date().toISOString(),
        })
            .eq("id", snapshot.sessionId);
        if (error)
            console.error("Failed to save session snapshot:", error);
    },
    async getValidSnapshot(sessionId) {
        const { data, error } = await supabase
            .from("interview_sessions")
            .select("recovery_state, updated_at")
            .eq("id", sessionId)
            .single();
        if (error || !data?.recovery_state)
            return null;
        const snapshot = data.recovery_state;
        const age = Date.now() - snapshot.timestamp;
        // Expire after 2 hours
        if (age > 1000 * 60 * 60 * 2)
            return null;
        return snapshot;
    },
    async clear(sessionId) {
        await supabase
            .from("interview_sessions")
            .update({ recovery_state: null })
            .eq("id", sessionId);
    },
};
//# sourceMappingURL=session-recovery.js.map