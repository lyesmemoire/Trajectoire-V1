/**
 * core/intent-detector.ts — Détection d'intention déterministe (P3.5).
 *
 * PURE, sans LLM. Repère des intentions de pilotage de l'entretien dans le
 * transcript de l'utilisateur (FR principalement), avant toute évaluation.
 */

export type Intent = "repeat" | "clarify" | "next" | "stop" | "slower" | "none";

/** Motifs lexicaux par intention (ordre = priorité de désambiguïsation). */
const PATTERNS: Array<{ intent: Intent; markers: string[] }> = [
  {
    intent: "stop",
    markers: [
      "on arrête", "on arrete", "j'arrête", "j'arrete", "arrêtons", "arretons",
      "stop", "terminer l'entretien", "on s'arrête", "fin de l'entretien",
      "je veux arrêter", "j'aimerais arrêter",
    ],
  },
  {
    intent: "repeat",
    markers: [
      "peux-tu répéter", "peux tu repeter", "répéter", "repeter", "répète",
      "repete", "redis", "tu peux répéter", "encore une fois la question",
    ],
  },
  {
    intent: "clarify",
    markers: [
      "je n'ai pas compris", "j'ai pas compris", "pas compris", "comprends pas",
      "c'est-à-dire", "que veux-tu dire", "qu'est-ce que tu entends",
      "tu peux expliquer", "peux-tu clarifier", "clarifier", "reformuler la question",
    ],
  },
  {
    intent: "slower",
    markers: [
      "plus lentement", "moins vite", "doucement", "ralentis", "tu vas trop vite",
    ],
  },
  {
    intent: "next",
    markers: [
      "question suivante", "passe à la suite", "passons à la suite", "suivant",
      "on continue", "question d'après", "autre question", "passe à autre chose",
    ],
  },
];

/**
 * Détecte l'intention de pilotage. Renvoie "none" si la phrase est une vraie
 * réponse d'entretien (cas le plus fréquent).
 *
 * Heuristique de sûreté : on n'active une intention que si la phrase est COURTE
 * (commande), pour éviter de confondre une vraie réponse mentionnant un mot-clé.
 */
export function detectIntent(transcript: string): Intent {
  const text = (transcript ?? "").trim().toLowerCase();
  if (!text) return "none";

  const wordCount = text.split(/\s+/).length;
  // Une commande de pilotage est typiquement brève (<= 10 mots).
  const looksLikeCommand = wordCount <= 10;

  for (const { intent, markers } of PATTERNS) {
    if (markers.some((m) => text.includes(m))) {
      // "stop" et "repeat"/"clarify" explicites sont fiables même un peu plus longs ;
      // pour les autres on exige une phrase courte.
      if (intent === "stop" || intent === "repeat" || intent === "clarify") {
        return intent;
      }
      if (looksLikeCommand) return intent;
    }
  }
  return "none";
}
