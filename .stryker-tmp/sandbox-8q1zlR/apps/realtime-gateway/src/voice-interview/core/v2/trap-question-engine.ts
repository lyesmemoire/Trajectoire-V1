/**
 * core/v2/trap-question-engine.ts — Questions pièges ciblées (P3.6, Bloc 7). PURE.
 *
 * Déclenchées UNIQUEMENT si le candidat revendique la compétence (claimsSkill),
 * pour vérifier la profondeur réelle. Déterministe.
 */
// @ts-nocheck


import { type CandidateProfile, claimsSkill } from "./candidate-profile.js";

interface TrapDef {
  skill: string;
  question: string;
}

const TRAPS: TrapDef[] = [
  { skill: "kubernetes", question: "Tu indiques Kubernetes : quelle différence entre un Deployment et un StatefulSet ?" },
  { skill: "aws", question: "Tu mentionnes AWS : comment sécuriserais-tu un bucket S3 exposé publiquement ?" },
  { skill: "docker", question: "Tu dis maîtriser Docker : comment réduirais-tu la taille d'une image en production ?" },
  { skill: "react", question: "Tu indiques React : quand et pourquoi utiliser useMemo plutôt que useCallback ?" },
  { skill: "node", question: "Tu mentionnes Node.js : comment éviterais-tu de bloquer l'event loop sur une tâche lourde ?" },
  { skill: "postgresql", question: "Tu indiques PostgreSQL : comment diagnostiquerais-tu une requête lente ?" },
  { skill: "typescript", question: "Tu dis maîtriser TypeScript : à quoi sert un type conditionnel et quand l'utiliser ?" },
  { skill: "graphql", question: "Tu mentionnes GraphQL : comment gérerais-tu le problème N+1 ?" },
];

/** Renvoie une question piège pertinente non encore posée, sinon null. */
export function pickTrapQuestion(
  profile: CandidateProfile,
  askedQuestions: string[],
): string | null {
  for (const trap of TRAPS) {
    if (claimsSkill(profile, trap.skill) && !askedQuestions.includes(trap.question)) {
      return trap.question;
    }
  }
  return null;
}

/** Liste des compétences couvertes par une question piège. */
export function trapSkills(): string[] {
  return TRAPS.map((t) => t.skill);
}
