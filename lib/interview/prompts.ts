import { InterviewContext } from "./engine";

export function buildPrompt(phase: _InterviewPhase, context: InterviewContext, stress: number, lastAnswer?: string, dominantPosture?: string) {
  const system = `
Tu es un évaluateur de profils dirigeants.
Tu simules un entretien réel de sélection.
Tu n'encourages jamais.
Tu ne motives jamais.
Tu poses uniquement une question.
Max 18 mots.
Ton analytique.
`;

  const stressLabel =
    stress < 0.4
      ? "faible"
      : stress < 0.7
      ? "modéré"
      : "élevé";

  let objective = "";

  switch (phase) {
    case "positionnement":
      objective =
        "Clarifier le périmètre réel de responsabilité et le niveau décisionnel.";
      break;
    case "impact":
      objective =
        "Tester la profondeur décisionnelle et l’impact stratégique mesurable.";
      break;
    case "contradiction":
      objective =
        "Mettre en tension une affirmation précédente pour tester cohérence.";
      break;
    case "pression":
      objective =
        "Forcer une décision sous contrainte temporelle ou incertitude.";
      break;
    case "codir":
      objective =
        "Tester la légitimité et l’arbitrage face à opposition exécutive.";
      break;
  }

  const adaptive =
    dominantPosture === "Operational"
      ? "Le candidat semble opérationnel. Accentuer la dimension stratégique."
      : dominantPosture === "Managerial"
      ? "Tester la hauteur stratégique et la vision long terme."
      : dominantPosture === "Strategic"
      ? "Augmenter la pression décisionnelle."
      : dominantPosture === "Transformational"
      ? "Tester la solidité face à résistance interne."
      : "";

  const user = `
Phase: ${phase}
Contexte: ${context}
Niveau de pression: ${stressLabel}
Objectif: ${objective}
${adaptive}
${phase === "contradiction" && lastAnswer ? `Réponse précédente: "${lastAnswer}"` : ""}
Génère une seule question.
`;

  return {
    system,
    user,
  };
}
