import AIClient from "./client";
import { AI_MODELS } from "./models";
import { RetryManager } from "./retry/RetryManager";
import { ExternalServiceError } from "@/core/errors";

/**
 * CV Rewriter Service
 * Real implementation using AIClient and RetryManager
 */

export async function improveExperience(content: string, signal?: AbortSignal): Promise<string> {
  const client = AIClient.getInstance();
  const systemPrompt = "Tu es un expert RH de haut niveau. Améliore la description de l'expérience professionnelle suivante pour la rendre plus percutante, orientée résultats et professionnelle. Ne rajoute pas d'informations fausses.";

  const result = await RetryManager.execute(
    async () => {
      const response = await client.chatCompletion({
        model: AI_MODELS.INTERVIEW, // We reuse the text model
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content },
        ],
        temperature: 0.7,
        signal,
      });
      return response.content;
    },
    { maxRetries: 3, initialDelay: 2000 }
  );

  if (!result.success || !result.data) {
    throw new ExternalServiceError(result.error || "Failed to improve experience", "CVRewriter");
  }

  return result.data;
}

export async function rewriteSummary(content: string, signal?: AbortSignal): Promise<string> {
  const client = AIClient.getInstance();
  const systemPrompt = "Tu es un expert RH. Réécris ce résumé de CV pour le rendre concis, accrocheur et mettre en valeur les compétences clés du candidat en 3 ou 4 phrases maximum.";

  const result = await RetryManager.execute(
    async () => {
      const response = await client.chatCompletion({
        model: AI_MODELS.INTERVIEW,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content },
        ],
        temperature: 0.7,
        signal,
      });
      return response.content;
    },
    { maxRetries: 3, initialDelay: 2000 }
  );

  if (!result.success || !result.data) {
    throw new ExternalServiceError(result.error || "Failed to rewrite summary", "CVRewriter");
  }

  return result.data;
}

export async function generateImpactMetrics(role: string, context: string, signal?: AbortSignal): Promise<string> {
  const client = AIClient.getInstance();
  const systemPrompt = "En tant qu'expert métier, suggère 3 métriques d'impact quantitatives (KPIs) pertinentes que ce candidat pourrait ajouter à son CV pour ce rôle, basées sur le contexte fourni. Limite-toi à une liste à puces.";

  const result = await RetryManager.execute(
    async () => {
      const response = await client.chatCompletion({
        model: AI_MODELS.INTERVIEW,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Rôle: ${role}\nContexte: ${context}` },
        ],
        temperature: 0.7,
        signal,
      });
      return response.content;
    },
    { maxRetries: 3, initialDelay: 2000 }
  );

  if (!result.success || !result.data) {
    throw new ExternalServiceError(result.error || "Failed to generate metrics", "CVRewriter");
  }

  return result.data;
}
