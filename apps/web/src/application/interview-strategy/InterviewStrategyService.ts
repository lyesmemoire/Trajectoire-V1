import type {
  UnifiedInterviewContext,
} from "@/application/interview-context/UnifiedInterviewContextService";
import type { AnswerEvaluation } from "@/lib/ai/schemas/answer-evaluation.schema";

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
  | "closing"
  | "follow_up";

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
  evaluation?: AnswerEvaluation;
}

export interface BuildInterviewStrategyInput {
  context: UnifiedInterviewContext;
  messages?: StrategyConversationMessage[];
  lastCandidateAnswer?: string;
  evaluation?: AnswerEvaluation;
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
  if (turnNumber <= 1) return "opening";
  if (turnNumber <= 3) return "exploration";
  if (turnNumber <= 7) return "deep_dive";
  if (turnNumber <= 9) return "challenge";
  return "closing";
}

function answerHasMetrics(answer: string): boolean {
  return QUANTIFIED_PATTERN.test(answer);
}

function answerHasConcreteExample(answer: string): boolean {
  return CONCRETE_EXAMPLE_PATTERN.test(answer);
}

function answerHasImpact(answer: string): boolean {
  return IMPACT_PATTERN.test(answer);
}

function isShortAnswer(answer: string): boolean {
  return normalize(answer).length < SHORT_ANSWER_THRESHOLD;
}

export function selectTargetSkill(
  context: UnifiedInterviewContext,
  turnNumber: number,
): string | null {
  const missing = context.matching.missingSkills;
  if (missing.length > 0) {
    const index = Math.max(0, turnNumber - 2) % missing.length;
    return missing[index] ?? null;
  }
  const matched = context.matching.matchedSkills;
  if (matched.length > 0) {
    const index = Math.max(0, turnNumber - 2) % matched.length;
    return matched[index] ?? null;
  }
  return null;
}

function determineFocus(
  context: UnifiedInterviewContext,
  phase: InterviewPhase,
  targetSkill: string | null,
  lastAnswer: string,
  evaluation?: AnswerEvaluation,
): InterviewFocus {
  if (phase === "closing") return "closing";

  if (evaluation) {
    if (evaluation.recommendedAction === "FOLLOW_UP") {
      if (evaluation.followUpType === "CLARIFY") return "clarification";
      return "follow_up";
    }
  } else {
    // Fallback if no evaluation provided
    if (lastAnswer && isShortAnswer(lastAnswer)) return "clarification";
    if (lastAnswer && !answerHasConcreteExample(lastAnswer)) return "experience";
    if (lastAnswer && answerHasConcreteExample(lastAnswer) && !answerHasImpact(lastAnswer)) return "impact";
  }

  const interviewType = normalize(context.job.interviewType).toLowerCase();
  if (interviewType.includes("technique")) return targetSkill ? "technical" : "skill";
  if (interviewType.includes("manager")) return "behavior";
  if (phase === "opening") return "motivation";

  return targetSkill ? "skill" : "experience";
}

function buildObjective(
  params: {
    phase: InterviewPhase;
    focus: InterviewFocus;
    targetSkill: string | null;
    context: UnifiedInterviewContext;
    evaluation?: AnswerEvaluation;
  },
): string {
  const { phase, focus, targetSkill, context, evaluation } = params;

  if (evaluation && evaluation.recommendedAction === "FOLLOW_UP") {
    switch (evaluation.followUpType) {
      case "CLARIFY": return "Obtenir une réponse claire car la précédente était trop vague ou hors sujet.";
      case "ASK_EXAMPLE": return "Forcer le candidat à donner un exemple réel vécu, car la réponse était trop théorique.";
      case "ASK_PERSONAL_ROLE": return "Isoler l'action personnelle du candidat par rapport au reste de son équipe.";
      case "ASK_METRIC": return "Obtenir un ordre de grandeur ou une métrique chiffrée pour évaluer l'impact.";
      case "ASK_RESULT": return "Comprendre quel a été le résultat final de l'action décrite.";
      case "DEEPEN": return "Challenger le candidat pour vérifier la profondeur de son expertise.";
    }
  }

  if (phase === "opening") return `Établir le contexte du candidat et vérifier sa compréhension du poste \${context.job.title}.`;
  if (phase === "closing") return "Conclure l'entretien en vérifiant la motivation finale et les éléments importants non encore couverts.";
  if (focus === "clarification") return "Obtenir une réponse plus précise et exploitable avant de changer de sujet.";
  if (focus === "impact") return "Faire préciser l'impact réel, les résultats et la contribution personnelle du candidat.";
  if (focus === "technical" && targetSkill) return `Vérifier le niveau opérationnel réel du candidat sur \${targetSkill}.`;
  if (focus === "skill" && targetSkill) return `Évaluer la maîtrise concrète de \${targetSkill} et rechercher des preuves issues d'expériences réelles.`;
  if (focus === "behavior") return "Évaluer le comportement du candidat dans une situation réelle de décision, collaboration ou difficulté.";
  if (focus === "motivation") return "Évaluer la motivation réelle du candidat et la cohérence entre son parcours et le poste.";

  return "Approfondir une expérience pertinente et obtenir des éléments concrets permettant d'évaluer le candidat.";
}

function buildExpectedEvidence(
  focus: InterviewFocus,
  targetSkill: string | null,
  evaluation?: AnswerEvaluation
): string[] {
  if (evaluation && evaluation.recommendedAction === "FOLLOW_UP") {
    return evaluation.missingEvidence.map(e => e.replace("_", " "));
  }

  const base = ["contexte précis", "rôle personnel", "actions réalisées"];
  if (focus === "technical") {
    return unique([...(targetSkill ? [`utilisation réelle de \${targetSkill}`] : []), "niveau de complexité", "choix techniques", "contraintes rencontrées", "résultat observable"]);
  }
  if (focus === "behavior") return ["situation réelle", "décision prise", "raisonnement", "conséquence", "apprentissage"];
  if (focus === "impact") return [...base, "résultat mesurable", "ordre de grandeur ou métrique"];
  if (focus === "motivation") return ["raison spécifique liée au poste", "compréhension de l'entreprise ou du rôle", "cohérence avec le projet professionnel"];
  return [...base, "résultat obtenu"];
}

function buildRecruiterBehavior(
  params: {
    phase: InterviewPhase;
    lastAnswer: string;
    evaluation?: AnswerEvaluation;
  },
): RecruiterBehavior {
  const { phase, lastAnswer, evaluation } = params;

  let requireConcreteExample = false;
  let requireMetrics = false;
  let allowTopicChange = true;

  if (evaluation) {
    requireConcreteExample = evaluation.missingEvidence.includes("example");
    requireMetrics = evaluation.missingEvidence.includes("metrics");
    allowTopicChange = evaluation.recommendedAction === "NEXT_QUESTION";
  } else {
    const short = Boolean(lastAnswer) && normalize(lastAnswer).length < MEDIUM_ANSWER_THRESHOLD;
    const hasExample = !lastAnswer || answerHasConcreteExample(lastAnswer);
    const hasMetrics = !lastAnswer || answerHasMetrics(lastAnswer);

    requireConcreteExample = !hasExample || phase === "deep_dive" || phase === "challenge";
    requireMetrics = !hasMetrics && phase !== "opening";
    allowTopicChange = !short;
  }

  let challengeLevel: ChallengeLevel = "medium";
  if (phase === "opening") challengeLevel = "low";
  if (phase === "challenge") challengeLevel = "high";
  if (evaluation?.followUpType === "DEEPEN") challengeLevel = "high";

  return {
    challengeLevel,
    followUpDepth: phase === "deep_dive" || phase === "challenge" ? 2 : 1,
    requireConcreteExample,
    requireMetrics,
    allowTopicChange,
  };
}

function buildInstructions(
  params: {
    phase: InterviewPhase;
    focus: InterviewFocus;
    targetSkill: string | null;
    behavior: RecruiterBehavior;
    evaluation?: AnswerEvaluation;
  },
): string[] {
  const { phase, focus, targetSkill, behavior, evaluation } = params;

  const instructions = [
    "Poser une seule question à la fois.",
    "Ne jamais donner la réponse au candidat.",
    "Ne pas faire de coaching pendant la simulation.",
    "Rester professionnel, naturel et crédible.",
    "Ne pas inventer d'informations absentes du CV, de l'offre ou de la conversation.",
  ];

  if (evaluation && evaluation.recommendedAction === "FOLLOW_UP") {
    if (evaluation.followUpType === "CLARIFY") instructions.push("Demander au candidat de clarifier sa réponse de façon spécifique.");
    if (evaluation.followUpType === "ASK_EXAMPLE") instructions.push("Insister fermement pour obtenir un exemple concret tiré d'une expérience passée.");
    if (evaluation.followUpType === "ASK_PERSONAL_ROLE") instructions.push("Demander explicitement quel a été son rôle individuel par rapport à l'équipe.");
    if (evaluation.followUpType === "ASK_METRIC") instructions.push("Demander des métriques ou des ordres de grandeur mesurables.");
    if (evaluation.followUpType === "ASK_RESULT") instructions.push("S'enquérir du résultat final ou de l'impact métier de son action.");
    if (evaluation.followUpType === "DEEPEN") instructions.push("Poser une question plus pointue pour challenger sa compréhension approfondie.");
  }

  if (behavior.requireConcreteExample && (!evaluation || !evaluation.missingEvidence.includes("example"))) {
    instructions.push("Exiger un exemple concret issu d'une expérience réelle.");
  }
  if (behavior.requireMetrics && (!evaluation || !evaluation.missingEvidence.includes("metrics"))) {
    instructions.push("Demander un résultat, un ordre de grandeur ou une métrique lorsque cela est pertinent.");
  }

  if (targetSkill && (!evaluation || evaluation.recommendedAction === "NEXT_QUESTION")) {
    instructions.push(`Tester explicitement la maîtrise de \${targetSkill} sans annoncer au candidat que cette compétence provient du matching.`);
  }

  if (!behavior.allowTopicChange) {
    instructions.push("Ne pas changer de sujet tant que la réponse précédente reste incomplète ou évasive.");
  }

  if (phase === "closing") {
    instructions.push("Ne pas ouvrir un nouveau sujet technique majeur.", "Préparer une conclusion courte et naturelle.");
  }

  return instructions;
}

function buildReasoning(
  params: {
    context: UnifiedInterviewContext;
    phase: InterviewPhase;
    targetSkill: string | null;
    lastAnswer: string;
    evaluation?: AnswerEvaluation;
  },
): string[] {
  const { context, phase, targetSkill, lastAnswer, evaluation } = params;
  const reasoning: string[] = [`Phase actuelle : \${phase}.`];

  if (targetSkill) reasoning.push(`Compétence prioritaire : \${targetSkill}.`);
  if (context.matching.score !== null) reasoning.push(`Score de matching disponible : \${context.matching.score}/100.`);

  if (evaluation) {
    reasoning.push(`Évaluation IA (Score global pertinent: \${evaluation.relevanceScore}/100).`);
    reasoning.push(`Décision: \${evaluation.recommendedAction}`);
    if (evaluation.shortReason) reasoning.push(`Motif: \${evaluation.shortReason}`);
  } else if (lastAnswer) {
    if (isShortAnswer(lastAnswer)) reasoning.push("La dernière réponse est courte : approfondissement nécessaire.");
    if (!answerHasConcreteExample(lastAnswer)) reasoning.push("Aucun exemple concret détecté dans la dernière réponse.");
    if (!answerHasMetrics(lastAnswer)) reasoning.push("Aucune métrique claire détectée dans la dernière réponse.");
  }

  return reasoning;
}

export class InterviewStrategyService {
  static build(input: BuildInterviewStrategyInput): InterviewStrategy {
    const messages = input.messages ?? [];
    const lastCandidateAnswer = normalize(
      input.lastCandidateAnswer ?? [...messages].reverse().find((m) => m.role === "user")?.content
    );

    const turnNumber = getTurnNumber(messages);
    const phase = determinePhase(turnNumber);
    const targetSkill = selectTargetSkill(input.context, turnNumber);

    const focus = determineFocus(input.context, phase, targetSkill, lastCandidateAnswer, input.evaluation);
    const objective = buildObjective({ phase, focus, targetSkill, context: input.context, evaluation: input.evaluation });
    const behavior = buildRecruiterBehavior({ phase, lastAnswer: lastCandidateAnswer, evaluation: input.evaluation });

    return {
      phase,
      objective,
      focus,
      targetSkill,
      expectedEvidence: buildExpectedEvidence(focus, targetSkill, input.evaluation),
      recruiterBehavior: behavior,
      instructions: buildInstructions({ phase, focus, targetSkill, behavior, evaluation: input.evaluation }),
      reasoning: buildReasoning({ context: input.context, phase, targetSkill, lastAnswer: lastCandidateAnswer, evaluation: input.evaluation }),
      turnNumber,
      evaluation: input.evaluation,
    };
  }
}

