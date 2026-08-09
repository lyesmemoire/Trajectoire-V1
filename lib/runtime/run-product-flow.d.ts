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
import { type ProductInput, type ProductOutput } from "./product-contract";
/** Options internes (ex. désactiver l'enrichissement LLM dans les tests). */
export interface RunProductFlowOptions {
    /** Si false, on reste 100% déterministe (utile pour les tests/CI). */
    enableEnrichment?: boolean;
}
export declare function runProductFlow(input: ProductInput, options?: RunProductFlowOptions): Promise<ProductOutput>;
//# sourceMappingURL=run-product-flow.d.ts.map