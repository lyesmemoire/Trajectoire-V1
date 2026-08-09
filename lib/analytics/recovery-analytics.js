import { track } from "../analytics";
const RECOVERY_MIN_DELTA = 10;
export const RecoveryAnalytics = {
    /**
     * Enregistre un événement de conversion (recovery) si la progression de score
     * est supérieure ou égale au seuil minimum.
     *
     * @param payload L'objet contenant les métriques avant/après.
     */
    trackConversion: (payload) => {
        const scoreDelta = payload.scoreAfter - payload.scoreBefore;
        if (scoreDelta >= RECOVERY_MIN_DELTA) {
            track("recovery_conversion", {
                ...payload,
                scoreDelta,
            });
        }
    },
};
//# sourceMappingURL=recovery-analytics.js.map