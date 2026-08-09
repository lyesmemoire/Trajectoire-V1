import { createMistral } from "@ai-sdk/mistral";
const mistral = createMistral({
    apiKey: envServer.MISTRAL_API_KEY || "",
});
/**
 * On exporte le modèle mistral par défaut pour le projet.
 * Mistral Small est excellent pour l'ATS (vitesse/coût).
 * Mistral Large est préférable pour les entretiens complexes.
 * Cast needed: @ai-sdk/mistral returns LanguageModelV1, ai SDK expects LanguageModel.
 */
export const mistralModel = mistral("mistral-large-latest");
export const mistralSmallModel = mistral("mistral-small-latest");
//# sourceMappingURL=mistral.js.map