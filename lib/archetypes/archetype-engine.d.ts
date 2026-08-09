import { CareerArchetype } from "./career-archetypes";
export interface ScoreProfile {
    clarity: number;
    specificity: number;
    confidence: number;
    ownership: number;
    technical: number;
    verbosity: number;
}
/**
 * Moteur de détermination d'archétype basé sur les scores.
 */
export declare function determineArchetype(scores: _ScoreProfile): CareerArchetype;
/**
 * Calcule l'évolution narrative.
 */
export declare function generateEvolutionNarrative(prev: CareerArchetype, current: CareerArchetype): string;
//# sourceMappingURL=archetype-engine.d.ts.map