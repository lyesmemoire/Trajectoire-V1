/**
 * adapters.ts — Adaptateurs vers le contrat produit unique (ProductOutput).
 *
 * Règle stricte (P0.5) : aucun module métier ne retourne directement à l'UI.
 * Chaque source de résultat est convertie ici en `ProductOutput`.
 *
 * Sources branchées :
 *  - ATS déterministe (mots-clés)  -> mapKeywordAnalysisToProductOutput()
 *  - Feedback LLM (best-effort)    -> mapLlmFeedbackToProductOutput()
 */
import { computeKeywordScore } from "@/lib/local-ats";
/**
 * Stop-words FR/EN minimaux : mots de liaison/contexte d'offre qui ne sont
 * pas des compétences (évite le bruit dans gaps/actions). Liste volontairement
 * courte (P0.5) — extensible plus tard.
 */
const STOP_WORDS = new Set([
    // FR
    "recherche", "recherchons", "apprecie", "appreciee", "appreciée",
    "poste", "profil", "candidat", "candidate", "equipe", "équipe",
    "entreprise", "mission", "missions", "experience", "expérience",
    "annees", "années", "connaissance", "connaissances", "maitrisant",
    "maîtrisant", "nous", "vous", "votre", "notre", "avec", "dans", "pour",
    "sont", "etre", "être", "plus", "tres", "très", "ainsi", "cette",
    // EN
    "looking", "seeking", "experience", "knowledge", "skills", "team",
    "company", "role", "with", "have", "must", "should", "this", "that",
    "candidate", "position", "appreciated", "preferred",
]);
/** Tokenise un texte en mots significatifs (>3 caractères, dédupliqués). */
export function extractKeywords(text) {
    return [
        ...new Set(text
            .toLowerCase()
            .split(/\W+/)
            .filter((w) => w.length > 3 && !STOP_WORDS.has(w))),
    ];
}
export function analyzeKeywords(cvText, jobText) {
    const cvLower = cvText.toLowerCase();
    const jobKeywords = extractKeywords(jobText);
    const matched = [];
    const missing = [];
    for (const kw of jobKeywords) {
        if (cvLower.includes(kw))
            matched.push(kw);
        else
            missing.push(kw);
    }
    // Réutilise la logique de scoring ATS existante (source de vérité).
    const score = computeKeywordScore(cvText, jobText);
    return { score, matched, missing };
}
/** Convertit une analyse déterministe de mots-clés en ProductOutput. */
export function mapKeywordAnalysisToProductOutput(analysis) {
    const { score, matched, missing } = analysis;
    // On limite à des listes courtes et lisibles (P0.5 : simplicité).
    const strengths = matched.slice(0, 8);
    const gaps = missing.slice(0, 8);
    const risks = [];
    if (score < 40) {
        risks.push("Correspondance faible : la candidature risque d'être filtrée par un ATS.");
    }
    if (matched.length === 0) {
        risks.push("Aucun mot-clé de l'offre détecté dans le CV.");
    }
    if (gaps.length > matched.length) {
        risks.push("Plus de compétences manquantes que de compétences présentes.");
    }
    const explanation = [
        `Score de correspondance calculé à ${score}% (couverture des mots-clés de l'offre).`,
        `${matched.length} mot(s)-clé(s) de l'offre retrouvé(s) dans le CV.`,
        `${missing.length} mot(s)-clé(s) attendu(s) mais absent(s) du CV.`,
    ];
    const actions = [];
    for (const gap of gaps.slice(0, 5)) {
        actions.push(`Mettre en avant ou ajouter une expérience liée à « ${gap} ».`);
    }
    if (actions.length === 0) {
        actions.push("Reformuler les expériences pour mieux refléter l'offre visée.");
    }
    return {
        matchScore: score,
        strengths,
        gaps,
        risks,
        explanation,
        actions,
        interpretation: interpretScore(score),
        estimatedImpact: estimateImpact(score, gaps.length),
        interviewPrep: buildInterviewPrep(gaps),
    };
}
/**
 * Interprétation humaine du score (microcopy anti-stress).
 * Volontairement bienveillante : on parle de progression, pas d'échec.
 */
export function interpretScore(score) {
    if (score >= 80)
        return "Excellent : ton profil colle vraiment à ce poste.";
    if (score >= 65)
        return "Très bon : tu es un candidat sérieux pour ce poste.";
    if (score >= 45)
        return "Tu es proche, mais pas encore prêt — quelques ajustements suffisent.";
    if (score >= 25)
        return "Le potentiel est là : il manque encore des éléments clés.";
    return "Écart important pour l'instant — voici par où commencer.";
}
/**
 * Estime un gain de chances (%) si les actions recommandées sont suivies.
 * Heuristique simple et bornée : plus il y a de manques comblables et plus le
 * score de départ est bas, plus la marge de progression estimée est grande.
 */
export function estimateImpact(score, gapCount) {
    const room = 100 - score; // marge disponible
    const perGap = 6; // gain moyen estimé par manque comblé
    const raw = Math.min(room, gapCount * perGap);
    // On garde une estimation prudente (pas de promesse irréaliste).
    return Math.max(0, Math.min(30, Math.round(raw)));
}
/**
 * Construit une question d'entretien probable + canevas STAR, à partir du
 * principal manque détecté. 100 % déterministe (aucune dépendance externe).
 */
export function buildInterviewPrep(gaps) {
    const topGap = gaps[0];
    const question = topGap
        ? `Parle-moi d'une expérience concrète où tu as utilisé « ${topGap} » (ou une compétence proche).`
        : "Parle-moi d'un projet complexe dont tu es particulièrement fier.";
    const structure = [
        "Contexte : situe rapidement le projet et ton rôle.",
        "Problème : quel défi concret devais-tu résoudre ?",
        "Solution : qu'as-tu fait, avec quels choix techniques ?",
        "Résultat : quel impact mesurable (chiffres, délais, qualité) ?",
    ];
    return { question, structure };
}
/**
 * Fusionne un feedback LLM par-dessus une base déterministe.
 * Le LLM enrichit mais ne remplace jamais la base (robustesse).
 */
export function mergeLlmFeedback(base, llm) {
    const dedupe = (arr) => [...new Set(arr.filter(Boolean))];
    return {
        ...base, // préserve les champs P1 (interpretation, estimatedImpact, interviewPrep)
        matchScore: base.matchScore,
        strengths: dedupe([...(llm.strengths ?? []), ...base.strengths]).slice(0, 8),
        gaps: dedupe([...(llm.missing_keywords ?? []), ...base.gaps]).slice(0, 8),
        risks: dedupe([...(llm.weaknesses ?? []), ...base.risks]).slice(0, 8),
        explanation: base.explanation,
        actions: dedupe([
            ...(llm.recommendations ?? []),
            ...base.actions,
        ]).slice(0, 8),
    };
}
//# sourceMappingURL=adapters.js.map