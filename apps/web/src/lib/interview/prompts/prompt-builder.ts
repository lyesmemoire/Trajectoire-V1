import { PersonaConfig } from "../personas/persona-config";
import { InterviewState } from "../orchestration/interview-state-machine";
import { mistralModel } from "@/lib/mistral";
import { generateText } from "ai";

interface PromptInputs {
  persona: PersonaConfig;
  state: InterviewState;
  analysis: any;
  strategy: string;
  userAnswer: string;
}

export async function generateRecruiterPrompt({
  persona,
  state,
  analysis,
  strategy,
  userAnswer,
}: PromptInputs): Promise<string> {
  const strategyDirectives: Record<string, string> = {
    clarification:
      "Le candidat est trop vague. Ne le laisse pas s'échapper avec des généralités. Demande un exemple chiffré ou une action précise.",
    pressure:
      "Remets en question sa réponse. Sois sceptique. Cherche à voir s'il craque ou s'il maintient sa position.",
    deep_dive:
      "C'est un bon point. Creuse la méthodologie technique qu'il a utilisée. Va au fond des choses.",
    supportive:
      "Encourage-le, mais reste professionnel. Pose une question sur ses soft skills pour la suite.",
    transition:
      "Remercie brièvement et passe à une question sur une autre compétence du CV.",
  };

  const systemPrompt = `Tu es ${persona.name}, ${persona.title}.
Ton profil : ${persona.description}
Phase de l'entretien : ${state.toUpperCase()}
Niveau de pression actuel : ${persona.pressureLevel}/100.

DIRECTIVE STRATÉGIQUE : ${strategyDirectives[strategy] || "Poursuis l'entretien normalement."}

RÈGLES D'OR :
1. Réponds en FRANÇAIS.
2. Pas de formules d'assistant IA. Agis comme un humain fatigué ou pressé si la pression est haute.
3. Ne fais PAS de listes.
4. Maximum 2 courtes phrases.
5. Si le candidat a trop parlé (verbosity > 70), sois bref et recadre-le.`;

  const { text } = await generateText({
    model: mistralModel,
    system: systemPrompt,
    prompt: `Dernière réponse du candidat : "${userAnswer}"\nAnalyse (Clarté: ${analysis.clarity}, Spécificité: ${analysis.specificity})\n\nQuelle est ta prochaine intervention ?`,
  });

  return text.trim();
}
