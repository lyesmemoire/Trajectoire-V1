import { mistralModel } from "@/lib/mistral";
import { generateText } from "ai";
export async function improveExperience(originalText) {
    const prompt = `En tant qu'expert RH senior, améliore cette expérience professionnelle pour la rendre plus percutante et orientée résultats (impact). Ne retourne QUE le texte réécrit, sans introduction, sans guillemets.\n\nExpérience originale :\n${originalText}`;
    const { text } = await generateText({
        model: mistralModel,
        prompt,
        temperature: 0.3,
    });
    return text.trim();
}
export async function rewriteSummary(originalText) {
    const prompt = `En tant qu'expert RH senior, réécris ce résumé de CV (profil) pour le rendre plus professionnel, accrocheur et concis. Ne retourne QUE le texte réécrit, sans introduction.\n\nRésumé original :\n${originalText}`;
    const { text } = await generateText({
        model: mistralModel,
        prompt,
        temperature: 0.4,
    });
    return text.trim();
}
export async function generateImpactMetrics(role, context) {
    const prompt = `Pour le rôle de "${role}" dans le contexte suivant :\n"${context}"\n\nGénère 3 suggestions de métriques d'impact quantitatives que le candidat pourrait ajouter à son CV. Sois très concis, sous forme de liste à puces.`;
    const { text } = await generateText({
        model: mistralModel,
        prompt,
        temperature: 0.5,
    });
    return text.trim();
}
//# sourceMappingURL=cv-rewriter.js.map