/**
 * Mesure l'effort mental de l'utilisateur (Invisible Analytics).
 */
// @ts-nocheck

export function trackCognitiveLoad(events: {
  timeBeforeAction: number;
  backNavigation: number;
  modalCloses: number;
  rageClicks: number;
}): { loadLevel: "low" | "medium" | "high"; risk: string | null } {
  if (events.timeBeforeAction > 15000 || events.backNavigation > 2) {
    return {
      loadLevel: "high",
      risk: "L'utilisateur semble perdu ou hésitant sur l'action à mener.",
    };
  }

  if (events.rageClicks > 0) {
    return {
      loadLevel: "high",
      risk: "Friction technique ou frustration détectée.",
    };
  }

  return { loadLevel: "low", risk: null };
}
