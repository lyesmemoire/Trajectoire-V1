/**
 * Moteur de Présence Conversationnelle (Perceived Speed Layer)
 * Masque la latence LLM avec des signaux de pensée humains.
 */
export declare const THINKING_CUES: string[];
export declare function getRandomThinkingCue(): string;
/**
 * Gère l'état de "Vitesse Perçue"
 */
export declare function usePerceivedSpeed(): {
    isThinking: boolean;
    currentCue: string;
    startThinking: () => void;
    stopThinking: () => void;
};
//# sourceMappingURL=perceived-speed.d.ts.map