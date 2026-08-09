import { track } from "../analytics";
/**
 * Moteur de mesure du "Time to Wow".
 * Calcule le temps nécessaire pour qu'un utilisateur ressente la valeur réelle.
 */
export const WowTracker = {
    // Démarre le chrono (généralement sur la landing page)
    start: () => {
        if (typeof window !== "undefined") {
            sessionStorage.setItem("wow_start_time", Date.now().toString());
            track("landing_view", { timestamp: Date.now() });
        }
    },
    // Marque un événement comme un "Wow Moment"
    trackWow: (type) => {
        if (typeof window === "undefined")
            return;
        const startTime = sessionStorage.getItem("wow_start_time");
        const now = Date.now();
        if (startTime) {
            const timeToWowMs = now - parseInt(startTime);
            track("wow_moment_hit", {
                type,
                duration_ms: timeToWowMs,
                duration_seconds: Math.round(timeToWowMs / 1000),
                timestamp: now,
            });
            // On ne supprime pas le start_time pour permettre de traquer plusieurs wow successifs
        }
        // Événement spécifique pour le funnel
        track(type, { timestamp: now });
    },
    // Traque l'abandon (Drop-off)
    trackDropOff: (step) => {
        track("wow_drop_off", {
            step,
            timestamp: Date.now(),
        });
    },
};
//# sourceMappingURL=time-to-wow.js.map