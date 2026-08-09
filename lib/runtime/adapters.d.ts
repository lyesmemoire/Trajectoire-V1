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
import type { ProductOutput, InterviewPrep } from "./product-contract";
/** Tokenise un texte en mots significatifs (>3 caractères, dédupliqués). */
export declare function extractKeywords(text: string): string[];
/**
 * Analyse déterministe CV ↔ Job basée sur la couverture de mots-clés.
 * Aucune dépendance externe : fonctionne hors-ligne, idéal pour le socle produit.
 */
export interface KeywordAnalysis {
    score: number;
    matched: string[];
    missing: string[];
}
export declare function analyzeKeywords(cvText: string, jobText: string): KeywordAnalysis;
/** Convertit une analyse déterministe de mots-clés en ProductOutput. */
export declare function mapKeywordAnalysisToProductOutput(analysis: KeywordAnalysis): ProductOutput;
/**
 * Interprétation humaine du score (microcopy anti-stress).
 * Volontairement bienveillante : on parle de progression, pas d'échec.
 */
export declare function interpretScore(score: number): string;
/**
 * Estime un gain de chances (%) si les actions recommandées sont suivies.
 * Heuristique simple et bornée : plus il y a de manques comblables et plus le
 * score de départ est bas, plus la marge de progression estimée est grande.
 */
export declare function estimateImpact(score: number, gapCount: number): number;
/**
 * Construit une question d'entretien probable + canevas STAR, à partir du
 * principal manque détecté. 100 % déterministe (aucune dépendance externe).
 */
export declare function buildInterviewPrep(gaps: string[]): InterviewPrep;
/** Forme attendue d'un feedback LLM (best-effort, optionnel). */
export interface LlmFeedback {
    matched_keywords?: string[];
    missing_keywords?: string[];
    strengths?: string[];
    weaknesses?: string[];
    recommendations?: string[];
}
/**
 * Fusionne un feedback LLM par-dessus une base déterministe.
 * Le LLM enrichit mais ne remplace jamais la base (robustesse).
 */
export declare function mergeLlmFeedback(base: ProductOutput, llm: LlmFeedback): ProductOutput;
//# sourceMappingURL=adapters.d.ts.map