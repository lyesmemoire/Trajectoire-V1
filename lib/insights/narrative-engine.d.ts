/**
 * Moteur Narratif : Transforme les signaux bruts en vérités humaines.
 * Le socle du positionnement premium de StudioEntretien.
 */
export interface RawSignals {
    confidence: number;
    clarity: number;
    recoverySpeed: number;
    specificity: number;
}
export interface HumanVerdict {
    observation: string;
    turningPoint: string;
    nextStep: string;
}
export declare function translateSignalsToNarrative(signals: _RawSignals): HumanVerdict;
//# sourceMappingURL=narrative-engine.d.ts.map