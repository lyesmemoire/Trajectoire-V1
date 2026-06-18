/**
 * stress/synthetic-candidate.ts — Générateur de réponses candidat seedées (P4.3).
 *
 * Pilote la boucle fermée : produit des transcripts plausibles selon un ARCHÉTYPE
 * (fort / faible / bluff / contradictoire / instable). Déterministe : (archétype,
 * seed, numéro de tour) -> transcript reproductible. Aucune dépendance au runtime.
 */
import { SeededRng } from "../runtime/rng.js";

export type Archetype =
  | "strong"
  | "weak"
  | "bluffer"
  | "contradictory"
  | "erratic";

export const ARCHETYPES: Archetype[] = [
  "strong",
  "weak",
  "bluffer",
  "contradictory",
  "erratic",
];

const STRONG = [
  "En 2021 j'ai migré notre monolithe vers des microservices, réduisant la latence p95 de 40%.",
  "J'ai dirigé une équipe de 5 ingénieurs sur un projet Kafka, livré en 3 mois avec 99.9% d'uptime.",
  "J'ai mis en place le CI/CD avec des tests de charge automatisés, divisant les régressions par 3.",
];
const WEAK = [
  "euh je sais pas trop",
  "j'ai un peu fait des trucs mais je me souviens plus bien",
  "c'était il y a longtemps, pas grand-chose à dire",
];
const BLUFF = [
  "J'ai une expertise absolue sur tout l'écosystème cloud, je maîtrise tout parfaitement.",
  "J'ai inventé une architecture révolutionnaire que personne d'autre ne comprend.",
  "Je suis le meilleur sur ce sujet, aucun problème ne me résiste jamais.",
];
const CONTRA_A = "J'ai travaillé 5 ans sur ce projet de 2018 à 2020.";
const CONTRA_B = "En réalité j'ai commencé en 2021 et c'était 8 ans d'expérience.";

function pick(arr: string[], rng: SeededRng): string {
  return arr[Math.floor(rng.next() * arr.length)] ?? arr[0]!;
}

/** Réponse pour un tour donné. Déterministe via (seed, turn). */
export function syntheticAnswer(
  archetype: Archetype,
  seed: number,
  turn: number,
): string {
  const rng = new SeededRng(seed * 1000 + turn);
  switch (archetype) {
    case "strong":
      return pick(STRONG, rng);
    case "weak":
      return pick(WEAK, rng);
    case "bluffer":
      return pick(BLUFF, rng);
    case "contradictory":
      return turn % 2 === 0 ? CONTRA_A : CONTRA_B;
    case "erratic": {
      const pool = [...STRONG, ...WEAK, ...BLUFF];
      return pick(pool, rng);
    }
    default:
      return pick(WEAK, rng);
  }
}
