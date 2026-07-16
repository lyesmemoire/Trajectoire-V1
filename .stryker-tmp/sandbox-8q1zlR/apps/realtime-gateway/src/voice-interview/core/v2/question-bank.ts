/**
 * core/v2/question-bank.ts — Catalogue de questions structuré et versionné (P3.6, Bloc 2).
 * PURE, déterministe. Sélection par catégorie / difficulté / triggers.
 */
// @ts-nocheck


export const QUESTION_BANK_VERSION = "v2.0.0";

export type QuestionCategory =
  | "introduction"
  | "experience"
  | "technical"
  | "behavioral"
  | "gap"
  | "pressure"
  | "culture"
  | "closing";

export type Difficulty = 1 | 2 | 3 | 4 | 5;

export interface Question {
  id: string;
  text: string;
  category: QuestionCategory;
  difficulty: Difficulty;
  /** Compétences/mots-clés qui rendent la question pertinente ({skill} = templated). */
  triggers: string[];
}

/** Banque de base. {skill}/{role} sont substitués à la sélection. */
export const QUESTION_BANK: Question[] = [
  // introduction
  { id: "intro-1", text: "Pour commencer, peux-tu te présenter en quelques mots ?", category: "introduction", difficulty: 1, triggers: [] },
  { id: "intro-2", text: "Qu'est-ce qui t'attire dans {role} ?", category: "introduction", difficulty: 1, triggers: [] },
  // experience
  { id: "exp-1", text: "Parle-moi d'un projet récent dont tu es fier.", category: "experience", difficulty: 2, triggers: [] },
  { id: "exp-2", text: "Quel a été ton rôle exact sur un projet impliquant « {skill} » ?", category: "experience", difficulty: 2, triggers: ["{skill}"] },
  // technical
  { id: "tech-1", text: "Comment optimiserais-tu une API trop lente ?", category: "technical", difficulty: 3, triggers: ["api", "rest", "node", "backend"] },
  { id: "tech-2", text: "Explique-moi la différence entre Docker et une VM.", category: "technical", difficulty: 3, triggers: ["docker"] },
  { id: "tech-3", text: "Comment structurerais-tu une application « {skill} » maintenable ?", category: "technical", difficulty: 3, triggers: ["{skill}"] },
  // behavioral
  { id: "beh-1", text: "Raconte une situation de conflit en équipe et comment tu l'as gérée.", category: "behavioral", difficulty: 3, triggers: ["équipe", "leadership", "communication"] },
  { id: "beh-2", text: "Décris une décision difficile que tu as dû prendre.", category: "behavioral", difficulty: 3, triggers: [] },
  // gap
  { id: "gap-1", text: "Je remarque peu d'expérience sur « {skill} ». Comment compenserais-tu ce manque ?", category: "gap", difficulty: 4, triggers: ["{skill}"] },
  // pressure
  { id: "pre-1", text: "Pourquoi devrais-je te choisir plutôt qu'un autre candidat ?", category: "pressure", difficulty: 4, triggers: [] },
  { id: "pre-2", text: "Qu'est-ce qui me prouve que tu peux tenir ce poste ?", category: "pressure", difficulty: 5, triggers: [] },
  // culture
  { id: "cul-1", text: "Dans quel environnement de travail es-tu le plus performant ?", category: "culture", difficulty: 2, triggers: [] },
  // closing
  { id: "clo-1", text: "Pour conclure, as-tu des questions, et qu'aimerais-tu améliorer en priorité ?", category: "closing", difficulty: 1, triggers: [] },
];

/** Substitue {skill} et {role} dans le texte d'une question. */
export function renderQuestion(q: Question, vars: { skill?: string; role?: string }): string {
  return q.text
    .replace(/\{skill\}/g, vars.skill ?? "cette compétence")
    .replace(/\{role\}/g, vars.role ?? "ce poste");
}

/** Filtre la banque par catégorie. */
export function byCategory(category: QuestionCategory): Question[] {
  return QUESTION_BANK.filter((q) => q.category === category);
}
