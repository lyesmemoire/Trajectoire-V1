import type {
  UnifiedInterviewContext,
} from "@/application/interview-context/UnifiedInterviewContextService";

export type InterviewPhase =
  | "opening"
  | "exploration"
  | "deep_dive"
  | "challenge"
  | "closing";

export type InterviewFocus =
  | "experience"
  | "skill"
  | "motivation"
  | "behavior"
  | "technical"
  | "impact"
  | "clarification"
  | "closing";

export type ChallengeLevel =
  | "low"
  | "medium"
  | "high";

export interface StrategyConversationMessage {
  role: "assistant" | "user";
  content: string;
}

export interface RecruiterBehavior {
  challengeLevel: ChallengeLevel;
  followUpDepth: number;
  requireConcreteExample: boolean;
  requireMetrics: boolean;
  allowTopicChange: boolean;
}

export interface InterviewStrategy {
  phase: InterviewPhase;
  objective: string;
  focus: InterviewFocus;

  targetSkill: string | null;

  expectedEvidence: string[];

  recruiterBehavior: RecruiterBehavior;

  instructions: string[];

  reasoning: string[];

  turnNumber: number;
}

export interface BuildInterviewStrategyInput {
  context: UnifiedInterviewContext;

  messages?: StrategyConversationMessage[];

  lastCandidateAnswer?: string;
}

const SHORT_ANSWER_THRESHOLD = 80;
const MEDIUM_ANSWER_THRESHOLD = 220;

const QUANTIFIED_PATTERN =
  /\b(\d+(?:[.,]\d+)?\s?(?:%|€|k€|m€|jours?|heures?|mois|ans?|utilisateurs?|clients?|projets?|personnes?))\b/i;

const CONCRETE_EXAMPLE_PATTERN =
  /\b(exemple|situation|projet|mission|contexte|équipe|client|résultat|objectif|problème|incident|livraison|migration|déploiement)\b/i;

const IMPACT_PATTERN =
  /\b(résultat|impact|amélior|réduit|augment|gagn|économ|optimis|accélér|performance|conversion|revenu|coût|délai)\b/i;

function normalize(
  value: string | null | undefined,
): string {
  return (value ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

function unique(
  values: string[],
): string[] {
  return Array.from(
    new Set(
      values
        .map((value) => value.trim())
        .filter(Boolean),
    ),
  );
}

function getCandidateAnswers(
  messages: StrategyConversationMessage[],
): StrategyConversationMessage[] {
  return messages.filter(
    (message) => message.role === "user",
  );
}

function getTurnNumber(
  messages: StrategyConversationMessage[],
): number {
  return getCandidateAnswers(messages).length + 1;
}

function determinePhase(
  turnNumber: number,
): InterviewPhase {
  if (turnNumber <= 1) {
    return "opening";
  }

  if (turnNumber <= 3) {
    return "exploration";
  }

  if (turnNumber <= 7) {
    return "deep_dive";
  }

  if (turnNumber <= 9) {
    return "challenge";
  }

  return "closing";
}

function answerHasMetrics(
  answer: string,
): boolean {
  return QUANTIFIED_PATTERN.test(answer);
}

function answerHasConcreteExample(
  answer: string,
): boolean {
  return CONCRETE_EXAMPLE_PATTERN.test(answer);
}

function answerHasImpact(
  answer: string,
): boolean {
  return IMPACT_PATTERN.test(answer);
}

function isShortAnswer(
  answer: string,
): boolean {
  return normalize(answer).length < SHORT_ANSWER_THRESHOLD;
}
function selectTargetSkill(
  context: UnifiedInterviewContext,
  turnNumber: number,
): string | null {
  const missing =
    context.matching.missingSkills;

  if (missing.length > 0) {
    const index =
      Math.max(
        0,
        turnNumber - 2,
      ) % missing.length;

    return missing[index] ?? null;
  }

  const matched =
    context.matching.matchedSkills;

  if (matched.length > 0) {
    const index =
      Math.max(
        0,
        turnNumber - 2,
      ) % matched.length;

    return matched[index] ?? null;
  }

  return null;
}

function determineFocus(
  context: UnifiedInterviewContext,
  phase: InterviewPhase,
  targetSkill: string | null,
  lastAnswer: string,
): InterviewFocus {
  if (phase === "closing") {
    return "closing";
  }

  if (
    lastAnswer &&
    isShortAnswer(lastAnswer)
  ) {
    return "clarification";
  }

  if (
    lastAnswer &&
    !answerHasConcreteExample(lastAnswer)
  ) {
    return "experience";
  }

  if (
    lastAnswer &&
    answerHasConcreteExample(lastAnswer) &&
    !answerHasImpact(lastAnswer)
  ) {
    return "impact";
  }

  const interviewType =
    normalize(
      context.job.interviewType,
    ).toLowerCase();

  if (
    interviewType.includes("technique")
  ) {
    return targetSkill
      ? "technical"
      : "skill";
  }

  if (
    interviewType.includes("manager")
  ) {
    return "behavior";
  }

  if (phase === "opening") {
    return "motivation";
  }

  return targetSkill
    ? "skill"
    : "experience";
}

function buildObjective(
  params: {
    phase: InterviewPhase;
    focus: InterviewFocus;
    targetSkill: string | null;
    context: UnifiedInterviewContext;
  },
): string {
  const {
    phase,
    focus,
    targetSkill,
    context,
  } = params;

  if (phase === "opening") {
    return `Établir le contexte du candidat et vérifier sa compréhension du poste ${context.job.title}.`;
  }

  if (phase === "closing") {
    return "Conclure l'entretien en vérifiant la motivation finale et les éléments importants non encore couverts.";
  }

  if (focus === "clarification") {
    return "Obtenir une réponse plus précise et exploitable avant de changer de sujet.";
  }

  if (focus === "impact") {
    return "Faire préciser l'impact réel, les résultats et la contribution personnelle du candidat.";
  }

  if (
    focus === "technical" &&
    targetSkill
  ) {
    return `Vérifier le niveau opérationnel réel du candidat sur ${targetSkill}.`;
  }

  if (
    focus === "skill" &&
    targetSkill
  ) {
    return `Évaluer la maîtrise concrète de ${targetSkill} et rechercher des preuves issues d'expériences réelles.`;
  }

  if (focus === "behavior") {
    return "Évaluer le comportement du candidat dans une situation réelle de décision, collaboration ou difficulté.";
  }

  if (focus === "motivation") {
    return "Évaluer la motivation réelle du candidat et la cohérence entre son parcours et le poste.";
  }

  return "Approfondir une expérience pertinente et obtenir des éléments concrets permettant d'évaluer le candidat.";
}

function buildExpectedEvidence(
  focus: InterviewFocus,
  targetSkill: string | null,
): string[] {
  const base = [
    "contexte précis",
    "rôle personnel",
    "actions réalisées",
  ];

  if (focus === "technical") {
    return unique([
      ...(targetSkill
        ? [
            `utilisation réelle de ${targetSkill}`,
          ]
        : []),
      "niveau de complexité",
      "choix techniques",
      "contraintes rencontrées",
      "résultat observable",
    ]);
  }

  if (focus === "behavior") {
    return [
      "situation réelle",
      "décision prise",
      "raisonnement",
      "conséquence",
      "apprentissage",
    ];
  }

  if (focus === "impact") {
    return [
      ...base,
      "résultat mesurable",
      "ordre de grandeur ou métrique",
    ];
  }

  if (focus === "motivation") {
    return [
      "raison spécifique liée au poste",
      "compréhension de l'entreprise ou du rôle",
      "cohérence avec le projet professionnel",
    ];
  }

  return [
    ...base,
    "résultat obtenu",
  ];
}
function buildRecruiterBehavior(
  params: {
    phase: InterviewPhase;
    lastAnswer: string;
  },
): RecruiterBehavior {
  const {
    phase,
    lastAnswer,
  } = params;

  const short =
    Boolean(lastAnswer) &&
    normalize(lastAnswer).length <
      MEDIUM_ANSWER_THRESHOLD;

  const hasExample =
    !lastAnswer ||
    answerHasConcreteExample(lastAnswer);

  const hasMetrics =
    !lastAnswer ||
    answerHasMetrics(lastAnswer);

  let challengeLevel:
    ChallengeLevel = "medium";

  if (phase === "opening") {
    challengeLevel = "low";
  }

  if (phase === "challenge") {
    challengeLevel = "high";
  }

  return {
    challengeLevel,

    followUpDepth:
      phase === "deep_dive" ||
      phase === "challenge"
        ? 2
        : 1,

    requireConcreteExample:
      !hasExample ||
      phase === "deep_dive" ||
      phase === "challenge",

    requireMetrics:
      !hasMetrics &&
      phase !== "opening",

    allowTopicChange:
      !short,
  };
}

function buildInstructions(
  params: {
    phase: InterviewPhase;
    focus: InterviewFocus;
    targetSkill: string | null;
    behavior: RecruiterBehavior;
  },
): string[] {
  const {
    phase,
    focus,
    targetSkill,
    behavior,
  } = params;

  const instructions = [
    "Poser une seule question à la fois.",
    "Ne jamais donner la réponse au candidat.",
    "Ne pas faire de coaching pendant la simulation.",
    "Rester professionnel, naturel et crédible.",
    "Ne pas inventer d'informations absentes du CV, de l'offre ou de la conversation.",
  ];

  if (
    behavior.requireConcreteExample
  ) {
    instructions.push(
      "Exiger un exemple concret issu d'une expérience réelle.",
    );
  }

  if (
    behavior.requireMetrics
  ) {
    instructions.push(
      "Demander un résultat, un ordre de grandeur ou une métrique lorsque cela est pertinent.",
    );
  }

  if (targetSkill) {
    instructions.push(
      `Tester explicitement la maîtrise de ${targetSkill} sans annoncer au candidat que cette compétence provient du matching.`,
    );
  }

  if (focus === "clarification") {
    instructions.push(
      "Ne pas changer de sujet tant que la réponse précédente reste trop vague.",
    );
  }

  if (phase === "challenge") {
    instructions.push(
      "Challenger poliment une affirmation trop générale ou insuffisamment démontrée.",
    );
  }

  if (phase === "closing") {
    instructions.push(
      "Ne pas ouvrir un nouveau sujet technique majeur.",
      "Préparer une conclusion courte et naturelle.",
    );
  }

  return instructions;
}

function buildReasoning(
  params: {
    context: UnifiedInterviewContext;
    phase: InterviewPhase;
    targetSkill: string | null;
    lastAnswer: string;
  },
): string[] {
  const {
    context,
    phase,
    targetSkill,
    lastAnswer,
  } = params;

  const reasoning: string[] = [
    `Phase actuelle : ${phase}.`,
  ];

  if (targetSkill) {
    reasoning.push(
      `Compétence prioritaire : ${targetSkill}.`,
    );
  }

  if (
    context.matching.score !== null
  ) {
    reasoning.push(
      `Score de matching disponible : ${context.matching.score}/100.`,
    );
  }

  if (
    context.history.averageScore !== null
  ) {
    reasoning.push(
      `Score moyen des simulations précédentes : ${context.history.averageScore}/100.`,
    );
  }

  if (lastAnswer) {
    if (isShortAnswer(lastAnswer)) {
      reasoning.push(
        "La dernière réponse est courte : approfondissement nécessaire.",
      );
    }

    if (
      !answerHasConcreteExample(lastAnswer)
    ) {
      reasoning.push(
        "Aucun exemple concret détecté dans la dernière réponse.",
      );
    }

    if (
      !answerHasMetrics(lastAnswer)
    ) {
      reasoning.push(
        "Aucune métrique claire détectée dans la dernière réponse.",
      );
    }
  }

  return reasoning;
}

export class InterviewStrategyService {
  static build(
    input: BuildInterviewStrategyInput,
  ): InterviewStrategy {
    const messages =
      input.messages ?? [];

    const lastCandidateAnswer =
      normalize(
        input.lastCandidateAnswer ??
          [...messages]
            .reverse()
            .find(
              (message) =>
                message.role === "user",
            )
            ?.content,
      );

    const turnNumber =
      getTurnNumber(messages);

    const phase =
      determinePhase(turnNumber);

    const targetSkill =
      selectTargetSkill(
        input.context,
        turnNumber,
      );

    const focus =
      determineFocus(
        input.context,
        phase,
        targetSkill,
        lastCandidateAnswer,
      );

    const objective =
      buildObjective({
        phase,
        focus,
        targetSkill,
        context: input.context,
      });

    const behavior =
      buildRecruiterBehavior({
        phase,
        lastAnswer:
          lastCandidateAnswer,
      });

    return {
      phase,
      objective,
      focus,
      targetSkill,

      expectedEvidence:
        buildExpectedEvidence(
          focus,
          targetSkill,
        ),

      recruiterBehavior:
        behavior,

      instructions:
        buildInstructions({
          phase,
          focus,
          targetSkill,
          behavior,
        }),

      reasoning:
        buildReasoning({
          context:
            input.context,
          phase,
          targetSkill,
          lastAnswer:
            lastCandidateAnswer,
        }),

      turnNumber,
    };
  }
}