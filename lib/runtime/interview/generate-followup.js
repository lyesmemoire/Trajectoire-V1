/**
 * generate-followup.ts — Question de relance déterministe (P3, léger).
 *
 * Module isolé, sans LLM. Dérive une question de follow-up à partir du gap
 * visé, pour prolonger l'entraînement après une première réponse.
 */
export function generateFollowUp(question, gap) {
    if (gap && gap.trim()) {
        return `Peux-tu illustrer concrètement ton expérience sur « ${gap.trim()} » ?`;
    }
    // Fallback générique mais utile.
    void question; // la question d'origine peut servir à varier les relances plus tard
    return "Peux-tu détailler avec un exemple précis et un résultat mesurable ?";
}
//# sourceMappingURL=generate-followup.js.map