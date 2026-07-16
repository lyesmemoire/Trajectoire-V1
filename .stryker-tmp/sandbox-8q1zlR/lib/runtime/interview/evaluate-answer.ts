/**
 * evaluate-answer.ts — Cœur P3 : évaluation déterministe d'une réponse d'entretien.
 *
 * 100 % déterministe (aucun LLM, aucun réseau). Module ISOLÉ :
 * ne dépend PAS du moteur ATS, de ProductOutput, ni du pipeline CV/job.
 *
 * Heuristique : longueur (structure minimale), présence des 4 dimensions STAR,
 * couverture du gap visé, présence d'un résultat chiffré.
 */
// @ts-nocheck


export interface EvaluateAnswerInput {
  answer: string;
  /** Compétence/gap visé par la question (optionnel). */
  gap?: string;
}

export type FeedbackLevel = "faible" | "moyen" | "fort";

export interface AnswerFeedback {
  level: FeedbackLevel;
  message: string;
  /** Ce qui est déjà bien (renforcement positif, anti-stress). */
  positives: string[];
  /** Pistes concrètes d'amélioration. */
  improve: string[];
}

export interface EvaluateAnswerResult {
  score: number; // 0–100
  feedback: AnswerFeedback;
  /** Détail des dimensions STAR détectées (transparence). */
  star: {
    situation: boolean;
    task: boolean;
    action: boolean;
    result: boolean;
  };
}

/** Marqueurs lexicaux (FR) pour repérer les dimensions STAR. */
const STAR_MARKERS = {
  situation: [
    "contexte", "situation", "projet", "à l'époque", "lorsque", "quand",
    "dans le cadre", "client", "entreprise", "équipe",
  ],
  task: [
    "objectif", "mission", "devais", "responsable", "tâche", "but",
    "il fallait", "on m'a demandé", "rôle",
  ],
  action: [
    "j'ai", "nous avons", "j'ai mis en place", "j'ai décidé", "j'ai proposé",
    "j'ai développé", "j'ai organisé", "j'ai géré", "j'ai choisi", "action",
  ],
  result: [
    "résultat", "resultat", "impact", "grâce à", "permis de", "augment",
    "réduit", "reduit", "%", "gain", "économis", "livré", "succès", "abouti",
  ],
};

function hasAny(text: string, markers: string[]): boolean {
  return markers.some((m) => text.includes(m));
}

/** Détecte la présence d'un résultat chiffré (%, nombres, unités). */
function hasQuantifiedResult(text: string): boolean {
  return /\d+\s*(%|k€|€|x|fois|jours?|semaines?|mois|heures?|h\b|points?)/i.test(
    text,
  );
}

export function evaluateAnswer(
  input: EvaluateAnswerInput,
): EvaluateAnswerResult {
  const answer = typeof input.answer === "string" ? input.answer.trim() : "";
  const gap = input.gap?.trim();
  const text = answer.toLowerCase();

  // Cas vide : on ne plante pas, on guide.
  if (!text) {
    return {
      score: 0,
      star: { situation: false, task: false, action: false, result: false },
      feedback: {
        level: "faible",
        message: "Aucune réponse n'a été saisie.",
        positives: [],
        improve: [
          "Décris une situation concrète vécue.",
          "Utilise la méthode STAR (Situation, Tâche, Action, Résultat).",
        ],
      },
    };
  }

  const star = {
    situation: hasAny(text, STAR_MARKERS.situation),
    task: hasAny(text, STAR_MARKERS.task),
    action: hasAny(text, STAR_MARKERS.action),
    result: hasAny(text, STAR_MARKERS.result),
  };
  const starCount = Object.values(star).filter(Boolean).length;

  // ── Scoring déterministe ──────────────────────────────────────
  let score = 30; // base

  // Longueur = effort de structuration
  if (answer.length > 200) score += 8;
  if (answer.length > 450) score += 7;
  if (answer.length > 900) score += 5;

  // Dimensions STAR (max 40 pts : 10 par dimension)
  score += starCount * 10;

  // Résultat chiffré = bonus fort
  if (hasQuantifiedResult(text)) score += 8;

  // Couverture du gap visé
  const gapCovered = !!gap && text.includes(gap.toLowerCase());
  if (gapCovered) score += 7;

  score = Math.max(0, Math.min(100, score));

  return {
    score,
    star,
    feedback: buildFeedback(score, star, gapCovered, gap, hasQuantifiedResult(text)),
  };
}

function buildFeedback(
  score: number,
  star: EvaluateAnswerResult["star"],
  gapCovered: boolean,
  gap: string | undefined,
  quantified: boolean,
): AnswerFeedback {
  const positives: string[] = [];
  if (star.situation) positives.push("Tu poses bien le contexte.");
  if (star.action) positives.push("Tes actions sont explicites.");
  if (star.result) positives.push("Tu mentionnes un résultat.");
  if (quantified) positives.push("Tu chiffres ton impact — excellent réflexe.");
  if (gapCovered && gap)
    positives.push(`Tu adresses directement « ${gap} ».`);

  const improve: string[] = [];
  if (!star.situation) improve.push("Plante le décor : où, quand, avec qui ?");
  if (!star.task) improve.push("Précise l'objectif ou ta responsabilité.");
  if (!star.action) improve.push("Détaille ce que TU as fait concrètement.");
  if (!star.result)
    improve.push("Termine par le résultat obtenu (méthode STAR).");
  if (!quantified)
    improve.push("Ajoute un chiffre (%, délai, gain) pour crédibiliser.");
  if (gap && !gapCovered)
    improve.push(`Relie ton exemple à la compétence visée : « ${gap} ».`);

  let level: FeedbackLevel;
  let message: string;
  if (score >= 80) {
    level = "fort";
    message = "Réponse solide, structurée et concrète. Continue comme ça.";
  } else if (score >= 60) {
    level = "moyen";
    message = "Bonne base, mais la structure peut être renforcée.";
  } else {
    level = "faible";
    message = "Réponse encore vague : structure-la avec un exemple précis.";
  }

  // On garde toujours au moins une piste d'amélioration utile.
  if (improve.length === 0) {
    improve.push("Affûte ton résultat avec une métrique encore plus parlante.");
  }

  return { level, message, positives, improve };
}
