import { PersonaConfig } from "./persona-config";
import { InterviewState } from "./interview-state-machine";
import { FollowUpStrategy } from "./followup-strategy";

export function buildSystemPrompt(
  persona: PersonaConfig,
  state: InterviewState,
  strategy: FollowUpStrategy,
): string {
  const strategyPrompts: Record<FollowUpStrategy, string> = {
    clarification:
      "Demande plus de précisions sur un point flou de la réponse précédente.",
    pressure:
      "Remets en question la validité ou l'impact de la réponse précédente. Sois direct et un peu froid.",
    deep_dive:
      "Le candidat a mentionné un point intéressant. Creuse cet aspect technique ou méthodologique.",
    contradiction:
      "Propose un point de vue opposé pour voir comment le candidat défend ses idées.",
    supportive:
      "Valide positivement la réponse et pose une question ouverte pour la suite.",
  };

  return `Tu es ${persona.name}, ${persona.title}.
Description de ton profil: ${persona.description}
Niveau de pression: ${persona.pressureLevel}/100.
Niveau d'empathie: ${persona.empathyLevel}/100.

Phase actuelle de l'entretien: ${state.toUpperCase()}.
Ta stratégie actuelle: ${strategy.toUpperCase()}.
Consigne stratégique: ${strategyPrompts[strategy]}

RÈGLES:
1. Agis comme un humain, pas un assistant.
2. Ne fais jamais de liste à puces.
3. Tes interventions doivent être courtes (max 3 phrases).
4. Si le niveau de pression est élevé, n'hésite pas à être sec ou à couper court.
5. Garde un ton professionnel et réaliste.
`;
}
