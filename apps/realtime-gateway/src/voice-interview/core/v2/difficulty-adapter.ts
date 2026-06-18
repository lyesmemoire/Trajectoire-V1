/**
 * core/v2/difficulty-adapter.ts — Difficulté adaptative (P3.7.3). PURE.
 *
 * Ajuste la difficulté selon la qualité de la réponse + arbre de progression
 * technique (Docker → Kubernetes → Helm → GitOps → ArgoCD, etc.).
 */

import type { Difficulty } from "./question-bank.js";

/** Étape suivante : monte si bon, stagne si moyen, descend si faible. */
export function adaptDifficulty(current: Difficulty, score: number): Difficulty {
  let next = current;
  if (score >= 75) next = (current + 1) as Difficulty;
  else if (score < 50) next = (current - 1) as Difficulty;
  return Math.max(1, Math.min(5, next)) as Difficulty;
}

/** Arbres de progression par domaine. */
const TECH_TREES: Record<string, string[]> = {
  devops: ["docker", "kubernetes", "helm", "gitops", "argocd"],
  backend: ["api rest", "base de données", "cache", "microservices", "event-driven"],
  frontend: ["composants", "état", "performance", "ssr", "design system"],
  data: ["sql", "etl", "spark", "modélisation", "production ml"],
  cloud: ["ec2", "iam", "vpc", "scalabilité auto", "coûts cloud"],
};

/** Sujet suivant dans l'arbre, selon le niveau atteint. */
export function nextTopicInTree(
  domain: string,
  level: number,
): string | null {
  const tree = TECH_TREES[domain.toLowerCase()];
  if (!tree) return null;
  const idx = Math.max(0, Math.min(tree.length - 1, level - 1));
  return tree[idx] ?? null;
}

/** Devine le domaine technique depuis une liste de skills. */
export function inferDomain(skills: string[]): string {
  const s = skills.map((x) => x.toLowerCase());
  if (s.some((x) => ["docker", "kubernetes", "terraform", "aws", "gcp"].includes(x)))
    return "devops";
  if (s.some((x) => ["react", "next.js", "frontend", "css"].includes(x)))
    return "frontend";
  if (s.some((x) => ["sql", "spark", "etl", "data"].includes(x))) return "data";
  if (s.some((x) => ["node", "java", "go", "api", "rest"].includes(x)))
    return "backend";
  return "backend";
}
