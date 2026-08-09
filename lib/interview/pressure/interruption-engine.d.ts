import { InterruptionDecision, InterruptionType } from "../types/pressure.types";
import { PersonaConfig } from "../personas/persona-config";
/**
 * Analyse les signaux comportementaux pour décider si une interruption est nécessaire.
 */
export declare function evaluateInterruption(signals: _InterruptionSignals, currentPressure: number, persona: PersonaConfig): InterruptionDecision;
/**
 * Formate le texte de l'interruption selon le style du persona.
 */
export declare function getInterruptionPhrase(type: InterruptionType, persona: PersonaConfig): string;
//# sourceMappingURL=interruption-engine.d.ts.map