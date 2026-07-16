// @ts-nocheck
import { track } from "../analytics";

/**
 * Moteur de capture de la charge cognitive (Invisible Tracking).
 * Utilisé pour détecter les hésitations et les moments de confusion.
 */
export const CognitiveLoadTracker = {
  // 1. Mesure le temps de réaction initial (Landing -> Action)
  trackTimeToFirstAction: (timeMs: number) => {
    track("time_to_first_action", {
      duration_ms: timeMs,
      status:
        timeMs < 5000
          ? "excellent"
          : timeMs < 12000
            ? "acceptable"
            : "confusion",
    });
  },

  // 2. Détecte les hésitations sur les boutons critiques
  trackCTAHesitation: (ctaId: string, hoverDurationMs: number) => {
    if (hoverDurationMs > 3000) {
      track("cta_hesitation", { ctaId, duration_ms: hoverDurationMs });
    }
  },

  // 3. Détecte les boucles de confusion (Back navigation rapide)
  trackNavigationConfusion: (from: string, to: string) => {
    track("navigation_confusion", { from, to, timestamp: Date.now() });
  },

  // 4. Analyse de la complétion du Replay
  trackReplayFlow: (lastStepSeen: number, totalSteps: number) => {
    const completionRate = (lastStepSeen / totalSteps) * 100;
    track("replay_flow_progress", {
      completion_rate: Math.round(completionRate),
      is_completed: completionRate >= 90,
    });
  },

  // 5. Détecte les "Rage Quits" (Sortie brutale)
  trackSessionExit: (step: string, timeSpentSeconds: number) => {
    if (timeSpentSeconds < 120) {
      track("rage_quit_detected", { step, duration_seconds: timeSpentSeconds });
    }
  },
};
