/**
 * product-contract.ts — Contrat produit UNIQUE de StudioEntretien.
 *
 * Toute la logique métier (ATS, matching, futurs moteurs) doit, in fine,
 * produire un `ProductOutput`. L'UI ne consomme QUE ce contrat.
 *
 * Règle d'or (P0.5) :
 *   CV + Job  ->  runProductFlow  ->  ProductOutput  ->  UI
 * Aucun module ne renvoie directement à l'UI : tout passe par ProductOutput.
 */
/** Construit un ProductOutput vide mais valide (jamais de champ manquant). */
export function emptyProductOutput() {
    return {
        matchScore: 0,
        strengths: [],
        gaps: [],
        risks: [],
        explanation: [],
        actions: [],
    };
}
/**
 * Garde-fou de validation : garantit qu'un objet respecte le contrat.
 * Utilisé par l'API et les tests pour bloquer toute dérive de forme.
 */
export function isProductOutput(value) {
    if (typeof value !== "object" || value === null)
        return false;
    const v = value;
    const isStringArray = (x) => Array.isArray(x) && x.every((i) => typeof i === "string");
    return (typeof v.matchScore === "number" &&
        v.matchScore >= 0 &&
        v.matchScore <= 100 &&
        isStringArray(v.strengths) &&
        isStringArray(v.gaps) &&
        isStringArray(v.risks) &&
        isStringArray(v.explanation) &&
        isStringArray(v.actions));
}
//# sourceMappingURL=product-contract.js.map