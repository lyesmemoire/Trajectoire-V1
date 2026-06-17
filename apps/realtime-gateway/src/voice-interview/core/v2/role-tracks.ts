/**
 * core/v2/role-tracks.ts — Parcours d'entretien par métier (P3.7.5). PURE.
 *
 * Chaque rôle a sa propre séquence de thèmes (ordonnée), utilisée pour
 * structurer un entretien réaliste spécifique au poste.
 */

export type RoleTrackName =
  | "devops"
  | "backend"
  | "frontend"
  | "fullstack"
  | "data"
  | "product"
  | "engineering_manager";

export interface RoleTrack {
  name: RoleTrackName;
  /** Thèmes ordonnés du parcours. */
  themes: string[];
}

export const ROLE_TRACKS: Record<RoleTrackName, RoleTrack> = {
  devops: { name: "devops", themes: ["warmup", "aws", "terraform", "ci/cd", "incident critique", "scalabilité", "leadership", "closing"] },
  backend: { name: "backend", themes: ["warmup", "api", "base de données", "performance", "architecture", "incident", "closing"] },
  frontend: { name: "frontend", themes: ["warmup", "composants", "état", "performance", "accessibilité", "design system", "closing"] },
  fullstack: { name: "fullstack", themes: ["warmup", "frontend", "backend", "api", "déploiement", "architecture", "closing"] },
  data: { name: "data", themes: ["warmup", "sql", "etl", "spark", "architecture", "performance", "production", "closing"] },
  product: { name: "product", themes: ["warmup", "discovery", "priorisation", "stakeholders", "métriques", "case study", "closing"] },
  engineering_manager: { name: "engineering_manager", themes: ["warmup", "leadership", "priorisation", "conflits", "delivery", "vision", "closing"] },
};

/** Devine le parcours à partir du rôle ciblé (texte libre). */
export function inferRoleTrack(targetRole: string): RoleTrack {
  const r = (targetRole ?? "").toLowerCase();
  if (/devops|sre|infra|cloud|platform/.test(r)) return ROLE_TRACKS.devops;
  if (/front/.test(r)) return ROLE_TRACKS.frontend;
  if (/full ?stack/.test(r)) return ROLE_TRACKS.fullstack;
  if (/data|ml|machine learning/.test(r)) return ROLE_TRACKS.data;
  if (/product|pm|po\b/.test(r)) return ROLE_TRACKS.product;
  if (/manager|lead|head|em\b/.test(r)) return ROLE_TRACKS.engineering_manager;
  if (/back/.test(r)) return ROLE_TRACKS.backend;
  return ROLE_TRACKS.fullstack;
}

export function getRoleTrack(name: RoleTrackName): RoleTrack {
  return ROLE_TRACKS[name] ?? ROLE_TRACKS.fullstack;
}
