/**
 * Gère la mise en pause automatique de la session lors d'événements système.
 */
export function initializeSessionPauseEngine(callbacks) {
    const handleVisibilityChange = () => {
        if (document.visibilityState === "hidden") {
            callbacks.onPause("TAB_HIDDEN");
        }
    };
    const handlePageHide = () => {
        callbacks.onPause("PAGE_HIDE");
    };
    // Événement spécifique mobile : perte de focus de la fenêtre
    window.addEventListener("blur", () => callbacks.onPause("WINDOW_BLUR"));
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", handlePageHide);
    return () => {
        window.removeEventListener("blur", () => callbacks.onPause("WINDOW_BLUR"));
        document.removeEventListener("visibilitychange", handleVisibilityChange);
        window.removeEventListener("pagehide", handlePageHide);
    };
}
//# sourceMappingURL=session-pause-engine.js.map