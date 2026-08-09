/**
 * Mesure l'effort mental de l'utilisateur (Invisible Analytics).
 */
export function trackCognitiveLoad(events) {
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
//# sourceMappingURL=hesitation-tracker.js.map