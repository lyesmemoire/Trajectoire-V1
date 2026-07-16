// @ts-nocheck
import {
  InterruptionSignals,
  InterruptionDecision,
  InterruptionType,
} from "../types/pressure.types";
import { PersonaConfig } from "../personas/persona-config";

/**
 * Analyse les signaux comportementaux pour décider si une interruption est nécessaire.
 */
export function evaluateInterruption(
  signals: InterruptionSignals,
  currentPressure: number,
  persona: PersonaConfig,
): InterruptionDecision {
  // 1. Calcul du score d'agacement (Impatience Score)
  // Plus le ramblingScore est haut et la spécificité est basse, plus l'IA "s'impatiente"
  let impatienceScore =
    signals.ramblingScore * 0.6 + (100 - signals.specificity) * 0.4;

  // Pondération par le niveau de pression du Persona
  // Victor (stress) s'impatiente plus vite que Clara (supportive)
  impatienceScore =
    impatienceScore * (persona.pressureLevel / 100) + currentPressure / 5;

  // 2. Seuil de décision
  // On ne coupe pas systématiquement, on ajoute une part d'aléa contrôlé
  const baseThreshold = 75;
  const shouldInterrupt =
    impatienceScore > baseThreshold &&
    Math.random() * 100 > 100 - persona.interruptionRate;

  if (!shouldInterrupt) {
    return { shouldInterrupt: false, type: null, reason: null };
  }

  // 3. Choix du type d'interruption
  let type: InterruptionType = "clarify";

  if (signals.ramblingScore > 80) {
    type = "redirect";
  } else if (signals.verbosity > 80 && currentPressure > 50) {
    type = "speed_up";
  } else if (signals.specificity < 30) {
    type = "skeptical";
  } else if (currentPressure > 80) {
    type = "pressure";
  }

  return {
    shouldInterrupt: true,
    type,
    reason: `Impatience élevée (${Math.round(impatienceScore)}) due à un score de rambling de ${signals.ramblingScore}`,
  };
}

/**
 * Formate le texte de l'interruption selon le style du persona.
 */
export function getInterruptionPhrase(
  type: InterruptionType,
  persona: PersonaConfig,
): string {
  const styles: Record<string, Record<InterruptionType, string[]>> = {
    stress: {
      clarify: [
        "Soyez plus concret.",
        "Donnez-moi des chiffres.",
        "C'est flou.",
      ],
      pressure: [
        "Allez droit au but.",
        "Je n'ai pas la journée.",
        "Répondez directement.",
      ],
      redirect: [
        "Vous déviez.",
        "Revenons à ma question.",
        "Ce n'est pas le sujet.",
      ],
      skeptical: [
        "C'est théorique tout ça.",
        "Tout le monde dit ça.",
        "Je n'y crois pas.",
      ],
      speed_up: ["Abrégez.", "En une phrase ?", "Plus vite."],
    },
    faang: {
      clarify: [
        "Quel était l'impact mesurable ?",
        "Pouvez-vous quantifier ?",
        "Manque de data.",
      ],
      pressure: [
        "Quel était *votre* rôle exact ?",
        "Concentrez-vous sur l'action.",
      ],
      redirect: [
        "Quel rapport avec l'objectif ?",
        "Recentrons sur le problème.",
      ],
      skeptical: ["Comment validez-vous ce point ?", "C'est un signal faible."],
      speed_up: ["On avance.", "Passons à la suite.", "Ok, j'ai compris."],
    },
    supportive: {
      clarify: [
        "Pourriez-vous illustrer avec un exemple ?",
        "Je veux bien plus de détails.",
      ],
      pressure: [
        "Et concrètement, qu'avez-vous fait ?",
        "Dites-m'en plus sur votre action.",
      ],
      redirect: [
        "C'est intéressant, mais sur le point initial ?",
        "Pour revenir à ma question...",
      ],
      skeptical: [
        "Comment vous êtes-vous senti alors ?",
        "C'est un peu général, non ?",
      ],
      speed_up: [
        "On va devoir avancer un peu.",
        "Juste pour conclure sur ce point ?",
      ],
    },
  };

  const personaStyle = styles[persona.id] || styles["faang"]!;
  const options = personaStyle[type]!;
  return options[Math.floor(Math.random() * options.length)]!;
}
