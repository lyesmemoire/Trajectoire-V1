import { createMistral } from "@ai-sdk/mistral";
import type { LanguageModel } from "ai";

const mistral = createMistral({
  apiKey: envServer.MISTRAL_API_KEY || "",
});

/**
 * On exporte le modèle mistral par défaut pour le projet.
 * Mistral Small est excellent pour l'ATS (vitesse/coût).
 * Mistral Large est préférable pour les entretiens complexes.
 * Cast needed: @ai-sdk/mistral returns LanguageModelV1, ai SDK expects LanguageModel.
 */
export const mistralModel = mistral("mistral-large-latest") as unknown as LanguageModel;
export const mistralSmallModel = mistral(
  "mistral-small-latest",
) as unknown as LanguageModel;
