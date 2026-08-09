import type { LanguageModel } from "ai";
/**
 * On exporte le modèle mistral par défaut pour le projet.
 * Mistral Small est excellent pour l'ATS (vitesse/coût).
 * Mistral Large est préférable pour les entretiens complexes.
 * Cast needed: @ai-sdk/mistral returns LanguageModelV1, ai SDK expects LanguageModel.
 */
export declare const mistralModel: LanguageModel;
export declare const mistralSmallModel: LanguageModel;
//# sourceMappingURL=mistral.d.ts.map