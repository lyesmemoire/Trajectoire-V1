/**
 * Moteur Narratif : Transforme les signaux bruts en vérités humaines.
 * Le socle du positionnement premium de StudioEntretien.
 */
// @ts-nocheck


export interface RawSignals {
  confidence: number;
  clarity: number;
  recoverySpeed: number;
  specificity: number;
}

export interface HumanVerdict {
  observation: string;
  turningPoint: string;
  nextStep: string;
}

export function translateSignalsToNarrative(signals: RawSignals): HumanVerdict {
  // 1. Détection du pattern dominant
  if (signals.recoverySpeed > 75 && signals.clarity < 50) {
    return {
      observation:
        "Vous récupérez vite après interruption, mais votre message se dilue sous la tension.",
      turningPoint:
        "Victor a cessé de vous écouter quand vous avez commencé à vous justifier sans donner de chiffres.",
      nextStep: "Session recommandée : Précision sous tension (6 min).",
    };
  }

  if (signals.confidence > 80 && signals.specificity < 40) {
    return {
      observation:
        "Votre assurance est excellente, mais elle risque de passer pour de l'arrogance sans preuves concrètes.",
      turningPoint:
        "Le doute s'est installé lorsque vous n'avez pas su quantifier l'impact de votre dernier projet.",
      nextStep: "Session recommandée : Méthode STAR & Metrics (8 min).",
    };
  }

  return {
    observation:
      "Votre structure est stable. Vous commencez à maîtriser le flux de l'échange.",
    turningPoint:
      "Même face au scepticisme, vous avez su garder votre calme et recentrer le débat.",
    nextStep: "Session recommandée : Défense de Vision (10 min).",
  };
}
