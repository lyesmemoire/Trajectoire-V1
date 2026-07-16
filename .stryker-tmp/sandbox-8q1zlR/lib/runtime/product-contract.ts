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
// @ts-nocheck


/** Entrée produit : du texte brut, rien d'autre. Pas d'auth, pas de DB. */
export interface ProductInput {
  cvText: string;
  jobText: string;
}

/** Sortie produit normalisée et stable, consommée telle quelle par l'UI. */
export interface ProductOutput {
  /** Score de correspondance CV ↔ offre, 0–100. */
  matchScore: number;
  /** Points forts identifiés (compétences/atouts présents). */
  strengths: string[];
  /** Manques par rapport à l'offre (compétences attendues absentes). */
  gaps: string[];
  /** Risques / signaux d'alerte pour une candidature. */
  risks: string[];
  /** Explication du raisonnement (lignes lisibles par un humain). */
  explanation: string[];
  /** Actions concrètes recommandées pour améliorer la candidature. */
  actions: string[];

  // ── Champs P1 (optionnels, non-breaking) ──────────────────────────
  /** Phrase d'interprétation humaine du score (anti-stress). */
  interpretation?: string;
  /** Gain de chances estimé (%) si les actions sont suivies. */
  estimatedImpact?: number;
  /** Préparation d'entretien dérivée du profil (déterministe). */
  interviewPrep?: InterviewPrep;
}

/** Bloc de préparation d'entretien (écran 6). */
export interface InterviewPrep {
  /** Question d'entretien probable, dérivée du gap principal. */
  question: string;
  /** Canevas de réponse recommandé (méthode STAR). */
  structure: string[];
}

/** Construit un ProductOutput vide mais valide (jamais de champ manquant). */
export function emptyProductOutput(): ProductOutput {
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
export function isProductOutput(value: unknown): value is ProductOutput {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  const isStringArray = (x: unknown): x is string[] =>
    Array.isArray(x) && x.every((i) => typeof i === "string");
  return (
    typeof v.matchScore === "number" &&
    v.matchScore >= 0 &&
    v.matchScore <= 100 &&
    isStringArray(v.strengths) &&
    isStringArray(v.gaps) &&
    isStringArray(v.risks) &&
    isStringArray(v.explanation) &&
    isStringArray(v.actions)
  );
}
