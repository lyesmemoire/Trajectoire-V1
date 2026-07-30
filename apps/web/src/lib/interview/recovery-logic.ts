/**
 * Moteur de continuité de session (Session Recovery Logic).
 * Gère la persistance locale de l'état émotionnel et technique de l'entretien.
 */

export interface SessionSnapshot {
  sessionId: string;
  currentIndex: number;
  personaId: string;
  jobTitle: string;
  timestamp: number;
  isVoiceEnabled: boolean;
  pressureLevel: number;
}

const STORAGE_KEY = "studio_entretien_active_session";

export const SessionRecovery = {
  /**
   * Sauvegarde un instantané de la session pour permettre une reprise immédiate.
   */
  saveSnapshot: (snapshot: SessionSnapshot) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  },

  /**
   * Récupère la session interrompue si elle a moins de 30 minutes.
   */
  getValidSnapshot: (currentSessionId?: string): SessionSnapshot | null => {
    if (typeof window === "undefined") return null;

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    try {
      const snapshot: SessionSnapshot = JSON.parse(raw);
      const isExpired = Date.now() - snapshot.timestamp > 30 * 60 * 1000;

      // Si on cherche une session spécifique ou juste la dernière
      if (currentSessionId && snapshot.sessionId !== currentSessionId)
        return null;
      if (isExpired) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }

      return snapshot;
    } catch {
      return null;
    }
  },

  /**
   * Nettoie la mémoire après une session terminée proprement.
   */
  clear: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  },
};
