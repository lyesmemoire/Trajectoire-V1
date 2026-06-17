/**
 * core/simulation — Couche de simulation comportementale (refactor P3.7).
 *
 * Réorganise la logique réaliste en 4 couches transverses :
 *   - perception        : ce que le recruteur perçoit (signaux, bluff, contradictions)
 *   - interviewer-brain : personnalité + stratégie de questions (personas, banque, parcours, plan)
 *   - adaptive          : adaptation dynamique (difficulté, arbre technique)
 *   - evaluation-layer  : scores, crédibilité, rapport recruteur
 *
 * Le moteur V2 (interview-engine-v2) DÉLÈGUE à ces couches. API publique inchangée.
 * FAÇADE iso-comportement : aucune logique métier modifiée.
 */
export * from "./perception";
export * from "./interviewer-brain";
export * from "./adaptive";
export * from "./evaluation-layer";
// P3.8 — Interview Simulation Engine (comportement temps réel)
export * from "./pressure";
export * from "./memory";
export * from "./cross-session";
export * from "./hidden-eval";
export * from "./persona-reactivity";
export * from "./simulation-state";
export * from "./integration";
// P3.10 — pipeline d'orchestration explicite (V2 pur → simulation externe).
export * from "./pipeline";
// P3.11 — Recruiter Mind Model (état mental unifié, dérivé).
export * from "./recruiter-mind";
// Step B (pré-P4) — invariants de stabilité comportementale.
export * from "./stability";
// P4 — Perceptual Engine : projection UX (mise en scène, pas de logique).
export * from "./perception-ux";
// P4.1 — Emotional UX Control System (gouvernance : contraintes globales).
export * from "./governor/index";
