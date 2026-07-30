/**
 * core/intent-detector.ts — Détection d'intention déterministe (P3.5).
 *
 * PURE, sans LLM. Repère des intentions de pilotage de l'entretien dans le
 * transcript de l'utilisateur (FR principalement), avant toute évaluation.
 */
import { createChildLogger } from "../../../../../lib/logger.js";

export type UserCommand = "repeat" | "clarify" | "next" | "stop" | "slower";

export type UserIntent =
  | { kind: "command"; action: UserCommand }
  | { kind: "answer"; text: string }
  | { kind: "silence" };

/** Motifs lexicaux par intention (ordre = priorité de désambiguïsation). */
const PATTERNS: Array<{ intent: UserCommand; markers: string[] }> = [
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
export function detectIntent(transcript: _string): UserIntent {
  const text = (transcript ?? "").trim().toLowerCase();
  if (!text) return { kind: "silence" };

  const wordCount = text.split(/\s+/).length;
  // Une commande de pilotage est typiquement brève (<= 10 mots).
  const looksLikeCommand = wordCount <= 10;

  const log = createChildLogger({ component: 'intent-detector' });
  let result: UserIntent = { kind: "answer", text: transcript.trim() };

  for (const { intent, markers } of PATTERNS) {
    if (markers.some((m) => text.includes(m))) {
      // "stop" et "repeat"/"clarify" explicites sont fiables même un peu plus longs ;
      // pour les autres on exige une phrase courte.
      if (intent === "stop" || intent === "repeat" || intent === "clarify") {
        result = { kind: "command", action: intent };
        break;
      }
      if (looksLikeCommand) {
        result = { kind: "command", action: intent };
        break;
      }
    }
  }
  
  log.info({ 
    event: 'intent_detected', 
    intent: result.kind === "command" ? result.action : result.kind,
    confidence: result.kind === "answer" ? "low" : "high"
  });

  return result;
}
