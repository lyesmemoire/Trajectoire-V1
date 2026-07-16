/**
 * core/evaluation.ts — Évaluation déterministe d'une réponse (P3.1).
 *
 * Reprend la logique du moteur texte P3 (lib/runtime/interview), mais ENCAPSULÉE
 * ici pour respecter le principe "core sans dépendance externe / cross-package".
 * Pure function, testable, sans LLM.
 */
// @ts-nocheck


export type FeedbackLevel = "faible" | "moyen" | "fort";

export interface AnswerEvaluation {
  score: number; // 0–100
  level: FeedbackLevel;
  star: {
    situation: boolean;
    task: boolean;
    action: boolean;
    result: boolean;
  };
  quantified: boolean;
  gapCovered: boolean;
}

const STAR_MARKERS = {
  situation: [
    "contexte", "situation", "projet", "lorsque", "quand", "dans le cadre",
    "client", "entreprise", "équipe", "equipe",
  ],
  task: [
    "objectif", "mission", "devais", "responsable", "tâche", "tache", "but",
    "il fallait", "rôle", "role",
  ],
  action: [
    "j'ai", "nous avons", "mis en place", "j'ai décidé", "j'ai proposé",
    "développé", "organisé", "géré", "choisi", "action",
  ],
  result: [
    "résultat", "resultat", "impact", "grâce à", "permis de", "augment",
    "réduit", "reduit", "gain", "économis", "livré", "succès", "abouti",
  ],
};

function hasAny(text: string, markers: string[]): boolean {
  return markers.some((m) => text.includes(m));
}

function hasQuantifiedResult(text: string): boolean {
  return /\d+\s*(%|k€|€|x|fois|jours?|semaines?|mois|heures?|h\b|points?)/i.test(
    text,
  );
}

export function evaluateTranscript(
  transcript: string,
  gap?: string,
): AnswerEvaluation {
  const answer = (transcript ?? "").trim();
  const text = answer.toLowerCase();

  if (!text) {
    return {
      score: 0,
      level: "faible",
      star: { situation: false, task: false, action: false, result: false },
      quantified: false,
      gapCovered: false,
    };
  }

  const star = {
    situation: hasAny(text, STAR_MARKERS.situation),
    task: hasAny(text, STAR_MARKERS.task),
    action: hasAny(text, STAR_MARKERS.action),
    result: hasAny(text, STAR_MARKERS.result),
  };
  const starCount = Object.values(star).filter(Boolean).length;
  const quantified = hasQuantifiedResult(text);
  const gapCovered = !!gap && text.includes(gap.toLowerCase());

  let score = 30;
  if (answer.length > 200) score += 8;
  if (answer.length > 450) score += 7;
  if (answer.length > 900) score += 5;
  score += starCount * 10;
  if (quantified) score += 8;
  if (gapCovered) score += 7;
  score = Math.max(0, Math.min(100, score));

  const level: FeedbackLevel =
    score >= 80 ? "fort" : score >= 60 ? "moyen" : "faible";

  return { score, level, star, quantified, gapCovered };
}
