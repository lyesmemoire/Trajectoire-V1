/**
 * core/simulation/adaptive.ts — Couche ADAPTATION (refactor P3.7).
 *
 * Regroupe l'adaptation dynamique : difficulté qui monte/descend, arbre de
 * progression technique, déduction du domaine. (Pression temporelle viendra en P3.8.)
 *
 * FAÇADE iso-comportement : réexporte la logique existante, sans la modifier.
 */

export {
  adaptDifficulty,
  nextTopicInTree,
  inferDomain,
} from "../v2/difficulty-adapter";
