import {
  generateText,
} from "ai";

import {
  PersonaConfig,
} from "../personas/persona-config";

import {
  InterviewState,
} from "../orchestration/interview-state-machine";

import {
  getReasoningAIModel,
  isRemoteAIAvailable,
} from "@/lib/ai/ai-models";

interface PromptInputs {
  persona: PersonaConfig;
  state: InterviewState;
  analysis: any;
  strategy: string;
  userAnswer: string;
}

const STRATEGY_DIRECTIVES:
  Record<
    string,
    string
  > = {
    clarification:
      "Le candidat est trop vague. Demande un exemple concret, une action précise ou un résultat mesurable.",

    pressure:
      "Challenge la réponse avec professionnalisme. Demande au candidat de défendre sa décision ou son résultat.",

    deep_dive:
      "Creuse la méthodologie, les décisions prises et les arbitrages effectués.",

    supportive:
      "Encourage brièvement le candidat puis explore une compétence comportementale pertinente.",

    transition:
      "Passe à une autre compétence ou dimension importante de l'entretien.",
  };

export async function generateRecruiterPrompt({
  persona,
  state,
  analysis,
  strategy,
  userAnswer,
}: PromptInputs): Promise<string> {
  if (
    !isRemoteAIAvailable()
  ) {
    return generateLocalRecruiterPrompt({
      persona,
      state,
      analysis,
      strategy,
      userAnswer,
    });
  }

  const strategyDirective =
    STRATEGY_DIRECTIVES[
      strategy
    ] ??
    "Poursuis l'entretien normalement en t'appuyant sur la réponse précédente.";

  const systemPrompt = `
Tu es ${persona.name}, ${persona.title}.

Ton profil :
${persona.description}

Phase de l'entretien :
${String(state).toUpperCase()}

Niveau de pression :
${persona.pressureLevel}/100

DIRECTIVE STRATÉGIQUE :
${strategyDirective}

RÈGLES :
1. Réponds uniquement en français.
2. Agis comme un recruteur humain, jamais comme un assistant IA.
3. Ne fais pas de liste.
4. Maximum 2 phrases courtes.
5. Si verbosity > 70, recadre le candidat.
6. Si specificity < 60, demande une preuve ou un exemple.
7. Si ownership < 60, demande précisément ce que le candidat a fait lui-même.
`.trim();

  try {
    const {
      text,
    } =
      await generateText({
        model:
          getReasoningAIModel(),

        temperature:
          getTemperatureForStrategy(
            strategy,
          ),

        system:
          systemPrompt,

        prompt: [
          `Dernière réponse du candidat : "${userAnswer}"`,
          "",
          `Clarté : ${readScore(
            analysis?.clarity,
          )}`,
          `Spécificité : ${readScore(
            analysis?.specificity,
          )}`,
          `Ownership : ${readScore(
            analysis?.ownership,
          )}`,
          `Pertinence : ${readScore(
            analysis?.relevanceScore,
          )}`,
          `Verbosity : ${readScore(
            analysis?.verbosity,
          )}`,
          "",
          "Quelle est ta prochaine intervention ?",
        ].join("\n"),
      });

    const cleaned =
      text.trim();

    if (!cleaned) {
      return generateLocalRecruiterPrompt({
        persona,
        state,
        analysis,
        strategy,
        userAnswer,
      });
    }

    return cleaned;
  } catch {
    return generateLocalRecruiterPrompt({
      persona,
      state,
      analysis,
      strategy,
      userAnswer,
    });
  }
}

function generateLocalRecruiterPrompt({
  persona,
  state,
  analysis,
  strategy,
  userAnswer,
}: PromptInputs): string {
  const specificity =
    readScore(
      analysis?.specificity,
    );

  const ownership =
    readScore(
      analysis?.ownership,
    );

  const relevance =
    readScore(
      analysis?.relevanceScore,
    );

  const verbosity =
    readScore(
      analysis?.verbosity,
    );

  const trimmedAnswer =
    userAnswer
      .replace(
        /\s+/g,
        " ",
      )
      .trim();

  if (
    verbosity >= 75
  ) {
    return "Merci. Je vais vous demander d'être plus synthétique : quel est le point principal à retenir de cette expérience ?";
  }

  if (
    relevance < 55
  ) {
    return "Je voudrais revenir précisément à ma question. Pouvez-vous y répondre directement avec un exemple concret ?";
  }

  if (
    specificity < 55
  ) {
    return "Pouvez-vous me donner un exemple précis, avec votre action personnelle et le résultat obtenu ?";
  }

  if (
    ownership < 55
  ) {
    return "Dans cette situation, qu'avez-vous personnellement décidé ou réalisé, indépendamment du reste de l'équipe ?";
  }

  switch (strategy) {
    case "clarification":
      return "Pouvez-vous préciser ce point avec une situation réelle et un résultat mesurable ?";

    case "pressure":
      return "Qu'est-ce qui me prouve que ce résultat vient réellement de votre contribution et pas principalement de votre équipe ?";

    case "deep_dive":
      return "Expliquez-moi votre raisonnement : quelles options aviez-vous et pourquoi avez-vous choisi cette approche ?";

    case "supportive":
      return "C'est clair. Qu'avez-vous appris de cette expérience et qu'est-ce que vous feriez différemment aujourd'hui ?";

    case "transition":
      return generateTransitionQuestion(
        state,
      );

    default:
      break;
  }

  if (
    trimmedAnswer.length <
    80
  ) {
    return "Pouvez-vous développer avec un exemple concret et expliquer le résultat obtenu ?";
  }

  return generateTransitionQuestion(
    state,
  );
}

function generateTransitionQuestion(
  state: InterviewState,
): string {
  const normalizedState =
    String(state)
      .toLowerCase();

  if (
    normalizedState.includes(
      "technical",
    )
  ) {
    return "Passons à un autre sujet : quelle décision technique récente a été la plus difficile pour vous, et pourquoi ?";
  }

  if (
    normalizedState.includes(
      "closing",
    )
  ) {
    return "Pour terminer, quel élément de votre parcours souhaitez-vous absolument que je retienne ?";
  }

  return "Très bien. Parlez-moi maintenant d'une situation où vous avez dû gérer une difficulté importante ou un désaccord.";
}

function getTemperatureForStrategy(
  strategy: string,
): number {
  switch (strategy) {
    case "pressure":
      return 0.35;

    case "deep_dive":
      return 0.3;

    case "supportive":
      return 0.55;

    default:
      return 0.4;
  }
}

function readScore(
  value: unknown,
): number {
  const parsed =
    Number(value);

  if (
    !Number.isFinite(
      parsed,
    )
  ) {
    return 50;
  }

  return Math.max(
    0,
    Math.min(
      100,
      Math.round(
        parsed,
      ),
    ),
  );
}