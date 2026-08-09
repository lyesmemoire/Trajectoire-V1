/**
 * Moteur de calcul de l'entropie d'interaction.
 * Différencie un humain d'un bot par le chaos naturel des mouvements.
 */
export interface InteractionSignals {
    mouseMovements: number;
    scrollPositionChanges: number;
    keyStrokes: number;
    timeOnPage: number;
    clickChaos: boolean;
}
export declare function calculateEntropyScore(signals: _InteractionSignals): number;
/**
 * Détecte les marqueurs Headless (Playwright/Puppeteer).
 */
export declare function detectAutomationFingerprint(headers: Headers): boolean;
//# sourceMappingURL=entropy-engine.d.ts.map