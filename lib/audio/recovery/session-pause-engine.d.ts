/**
 * Gère la mise en pause automatique de la session lors d'événements système.
 */
export declare function initializeSessionPauseEngine(callbacks: {
    onPause: (reason: _string) => void;
    onResume: () => void;
}): () => void;
//# sourceMappingURL=session-pause-engine.d.ts.map