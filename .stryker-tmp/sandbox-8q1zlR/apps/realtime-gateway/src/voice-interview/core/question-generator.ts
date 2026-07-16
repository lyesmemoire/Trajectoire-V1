/**
 * core/question-generator.ts — Génération déterministe de questions (P3.1).
 *
 * PURE, sans LLM. Produit UNE question à la fois (1 idée = 1 question = 1 intention),
 * ton calme et non jugeant. Sélection basée sur la phase + le gap + les faiblesses STAR.
 */
// @ts-nocheck


import type { InterviewPhase, InterviewerStyle } from "./state.js";
import type { AnswerEvaluation } from "./evaluation.js";

/** Applique le ton du recruteur à une question (P3.5). Le sens reste identique. */
export function applyStyle(question: string, style: InterviewerStyle): string {
  switch (style) {
    case "supportive":
      return `Prends ton temps. ${question}`;
    case "challenging":
      return `Soyons précis. ${question}`;
    case "neutral":
    default:
      return question;
  }
}

/**
 * Reformule la dernière question en version plus courte et plus simple (P3.5),
 * pour répondre à une intention "repeat". Déterministe.
 */
export function rephraseQuestion(question: string, gap: string): string {
  const g = gap && gap.trim() ? gap.trim() : "ton expérience";
  // Version simplifiée et raccourcie, sans jargon.
  return `Reformulons simplement : donne-moi un exemple concret lié à « ${g} ».`;
}

/** Banque de questions par phase, paramétrée par le gap visé. */
function bankFor(phase: InterviewPhase, gap: string): string[] {
  const g = gap && gap.trim() ? gap.trim() : "ton parcours";
  switch (phase) {
    case "intro":
      return [
        `Pour commencer, peux-tu me parler de ton expérience autour de « ${g} » ?`,
        `Qu'est-ce qui t'attire dans un poste qui demande « ${g} » ?`,
      ];
    case "deep":
      return [
        `Raconte-moi une situation concrète où tu as utilisé « ${g} ».`,
        `Quel a été ton rôle exact sur un projet impliquant « ${g} » ?`,
      ];
    case "pressure":
      return [
        `Une fois, qu'est-ce qui n'a pas fonctionné comme prévu avec « ${g} » ? Comment as-tu réagi ?`,
        `Si on te confiait demain un défi « ${g} » sans préparation, comment t'y prendrais-tu ?`,
      ];
    case "wrap":
    default:
      return [
        "Pour conclure, qu'aimerais-tu améliorer en priorité dans ta préparation ?",
      ];
  }
}

/** Relances ciblées selon la dimension STAR manquante. */
function probeForWeakness(evaluation: AnswerEvaluation): string | null {
  if (!evaluation.star.result)
    return "Et concrètement, quel résultat as-tu obtenu ? Un chiffre si possible.";
  if (!evaluation.star.action)
    return "Qu'as-tu fait toi, précisément, dans cette situation ?";
  if (!evaluation.star.situation)
    return "Peux-tu situer le contexte : où, quand, avec qui ?";
  if (!evaluation.star.task)
    return "Quel était l'objectif que tu devais atteindre ?";
  return null;
}

export interface GenerateQuestionInput {
  phase: InterviewPhase;
  gap: string;
  askedQuestions: string[];
  /** Évaluation de la dernière réponse (si on est en relance). */
  lastEvaluation?: AnswerEvaluation;
  /** Veut-on une relance ciblée plutôt qu'une nouvelle question ? */
  probe?: boolean;
  /** Style du recruteur (P3.5), applique un ton sans changer le sens. */
  style?: InterviewerStyle;
}

/**
 * Sélectionne une question non encore posée. Déterministe :
 * pour un même état d'entrée, renvoie toujours la même question.
 */
export function generateQuestion(input: GenerateQuestionInput): string {
  const style = input.style ?? "neutral";

  // Relance ciblée sur une faiblesse STAR.
  if (input.probe && input.lastEvaluation) {
    const probe = probeForWeakness(input.lastEvaluation);
    if (probe && !input.askedQuestions.includes(probe)) {
      return applyStyle(probe, style);
    }
  }

  const candidates = bankFor(input.phase, input.gap);
  const fresh = candidates.find((q) => !input.askedQuestions.includes(q));
  if (fresh) return applyStyle(fresh, style);

  // Toutes posées : relance générique non répétée, sinon dernière candidate.
  const fallback = "Peux-tu développer avec un exemple plus précis ?";
  if (!input.askedQuestions.includes(fallback)) return applyStyle(fallback, style);
  return applyStyle(candidates[candidates.length - 1] ?? fallback, style);
}
