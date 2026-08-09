import { AnswerAnalysis } from "../behavior/answer-analysis";
import { PersonaConfig } from "../personas/persona-config";
/**
 * Calcule le nouveau niveau de pression basé sur la performance et le persona.
 */
export declare function calculatePressureImpact(currentLevel: number, analysis: AnswerAnalysis, persona: PersonaConfig): number;
export declare function shouldTriggerInterruption(pressureLevel: number, persona: PersonaConfig): boolean;
//# sourceMappingURL=pressure-engine.d.ts.map