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
export declare const SessionRecovery: {
    /**
     * Sauvegarde un instantané de la session pour permettre une reprise immédiate.
     */
    saveSnapshot: (snapshot: SessionSnapshot) => void;
    /**
     * Récupère la session interrompue si elle a moins de 30 minutes.
     */
    getValidSnapshot: (currentSessionId?: string) => SessionSnapshot | null;
    /**
     * Nettoie la mémoire après une session terminée proprement.
     */
    clear: () => void;
};
//# sourceMappingURL=recovery-logic.d.ts.map