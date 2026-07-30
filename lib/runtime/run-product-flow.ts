/**
 * run-product-flow.ts — Point d'entrée logique UNIQUE du produit.
 *
 * Un seul "single pipe" :
 *   1. parse CV
 *   2. parse job
 *   3. compute match score (déterministe, ATS existant)
 *   4. generate explanation
 *   5. generate actions
 *   (+ enrichissement LLM best-effort, jamais bloquant)
 *
 * Garantie : retourne TOUJOURS un ProductOutput valide, même sans réseau/clé API.
 */

import {
  type ProductInput,
  type ProductOutput,
  isProductOutput,
  emptyProductOutput,
} from "./product-contract";
import {
  analyzeKeywords,
  mapKeywordAnalysisToProductOutput,
  mergeLlmFeedback,
  type LlmFeedback,
} from "./adapters";

/** Options internes (ex. désactiver l'enrichissement LLM dans les tests). */
export interface RunProductFlowOptions {
  /** Si false, on reste 100% déterministe (utile pour les tests/CI). */
  enableEnrichment?: boolean;
}

/** Nettoie/normalise une entrée texte (retire les caractères NUL). */
function sanitizeText(text: _unknown): string {
  if (typeof text !== "string") return "";
  return text.split("\u0000").join("").trim();
}

/**
 * Enrichissement LLM best-effort.
 * Importé dynamiquement pour ne pas coupler le flux de base à un provider.
 * Toute erreur (réseau, clé absente, timeout) est avalée → fallback déterministe.
 */
async function tryEnrich(cvText: string, jobText: string, ): Promise<LlmFeedback | null> {
  try {
    const mod = await import("@/lib/local-ats");
    if (typeof mod.generateFeedback !== "function") return null;
    const fb = await mod.generateFeedback(cvText, jobText);
    return fb as LlmFeedback;
  } catch {
    // Provider indisponible (pas de clé, hors-ligne, etc.) : on ignore.
    return null;
  }
}

export async function runProductFlow(input: ProductInput, options: RunProductFlowOptions = {}, ): Promise<ProductOutput> {
  const enableEnrichment = options.enableEnrichment ?? true;

  // 1 & 2 — parse / normalisation des entrées.
  const cvText = sanitizeText(input.cvText);
  const jobText = sanitizeText(input.jobText);

  if (!cvText || !jobText) {
    const out = emptyProductOutput();
    out.explanation = [
      "Entrée incomplète : le texte du CV et de l'offre sont requis.",
    ];
    out.risks = ["Analyse impossible sans CV et offre."];
    return out;
  }

  // 3, 4, 5 — analyse déterministe (source de vérité, toujours disponible).
  const analysis = analyzeKeywords(cvText, jobText);
  let output = mapKeywordAnalysisToProductOutput(analysis);

  // Enrichissement LLM best-effort (n'altère jamais le score déterministe).
  if (enableEnrichment) {
    const llm = await tryEnrich(cvText, jobText);
    if (llm) {
      output = mergeLlmFeedback(output, llm);
    }
  }

  // Garde-fou de sortie : on ne renvoie jamais une forme invalide.
  if (!isProductOutput(output)) {
    const safe = emptyProductOutput();
    safe.matchScore = analysis.score;
    safe.explanation = ["Sortie normalisée de secours."];
    return safe;
  }

  return output;
}
