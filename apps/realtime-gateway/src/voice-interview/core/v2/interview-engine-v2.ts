// @ts-nocheck
/**
 * core/v2/interview-engine-v2.ts â€” CÅ“ur dÃ©terministe de l'entretien rÃ©aliste (P3.6).
 *
 * Assemble : CandidateProfile + persona + plan + banque + signaux + piÃ¨ges + mÃ©moire.
 * PURE FUNCTION DESIGN : nextV2Step(state, transcript) -> { question, updatedState, ... }
 * Aucune I/O, aucun LLM. IndÃ©pendant du moteur V1 (P3.1â†’P3.5 inchangÃ©).
 */

import { type CandidateProfile } from "./candidate-profile.js";
// Step A (prÃ©-P4) : V2 dÃ©pend UNIQUEMENT de ses contrats, jamais de la simulation.
import {
  // interviewer-brain
  type InterviewerPersona,
  getPersona,
  applyTone,
  type PersonaName,
  type InterviewPlan,
  buildInterviewPlan,
  type V2Phase,
  nextV2Phase,
  PHASE_CATEGORIES,
  byCategory,
  renderQuestion,
  type Question,
  type Difficulty,
  pickTrapQuestion,
  // perception
  extractSignals,
  type AnswerSignals,
  extractCandidateFacts,
  detectContradiction,
  type CandidateFacts,
  type Contradiction,
  detectBluff,
  type BluffSignals,
  // adaptive
  adaptDifficulty,
  // evaluation
  evaluateTranscript,
  buildHiringRecommendation,
  type AnsweredTurn,
  type HiringRecommendation,
  buildRecruiterReport,
  type RecruiterReport,
} from "./contracts/index.js";
import { detectIntent } from "../intent-detector.js";
import { handlePilotCommand, extractPilotAction } from "../strategies/pilot-commands.js";

/** MÃ©moire conversationnelle (Bloc 9). */
export interface InterviewMemory {
  askedQuestions: string[];
  answeredTopics: string[];
  detectedStrengths: string[];
  detectedWeaknesses: string[];
  contradictions: string[];
}

export interface InterviewStateV2 {
  profile: CandidateProfile;
  persona: InterviewerPersona;
  plan: InterviewPlan;
  phase: V2Phase;
  /** Questions posÃ©es dans la phase courante. */
  phaseCount: number;
  memory: InterviewMemory;
  /** Historique enrichi pour le rapport final. */
  answered: AnsweredTurn[];
  finished: boolean;
  // â”€â”€ P3.7 (rÃ©alisme) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  /** Faits extraits du CV (contradictions). */
  facts: CandidateFacts;
  /** DifficultÃ© courante (adaptative). */
  difficulty: Difficulty;
  /** Signaux accumulÃ©s (crÃ©dibilitÃ©). */
  signalsList: AnswerSignals[];
  /** Signaux de bluff accumulÃ©s. */
  bluffList: BluffSignals[];
  /** Contradictions CV â†” rÃ©ponses dÃ©tectÃ©es. */
  contradictionList: Contradiction[];
}

export interface InitV2Input {
  profile: CandidateProfile;
  persona?: PersonaName;
  /** Texte CV pour l'extraction de faits (contradictions). Optionnel. */
  cvText?: string;
}

export function initInterviewV2(input: _InitV2Input): {
  state: InterviewStateV2;
  question: string;
} {
  const persona = getPersona(input.persona ?? "neutral");
  const plan = buildInterviewPlan(input.profile, persona);
  const state: InterviewStateV2 = {
    profile: input.profile,
    persona,
    plan,
    phase: "warmup",
    phaseCount: 0,
    memory: {
      askedQuestions: [],
      answeredTopics: [],
      detectedStrengths: [],
      detectedWeaknesses: [],
      contradictions: [],
    },
    answered: [],
    finished: false,
    facts: extractCandidateFacts(input.cvText ?? ""),
    difficulty: 2,
    signalsList: [],
    bluffList: [],
    contradictionList: [],
  };
  const question = selectQuestion(state);
  return { state: recordAsked(state, question), question };
}

export interface NextV2Result {
  question: string;
  updatedState: InterviewStateV2;
  evaluationScore: number;
  signals: AnswerSignals;
  bluff: BluffSignals;
  /** Contradiction CV â†” rÃ©ponse dÃ©tectÃ©e ce tour (si prÃ©sente). */
  contradiction?: Contradiction;
  finished: boolean;
  recommendation?: HiringRecommendation;
  /** Rapport recruteur complet (P3.7.6), prÃ©sent en fin d'entretien. */
  recruiterReport?: RecruiterReport;
}

/** Calcule l'Ã©tape suivante Ã  partir du transcript de la rÃ©ponse. */
export function nextV2Step(state: InterviewStateV2, transcript: string, ): NextV2Result {
  // 0) DÃ©tection d'intention (interception des commandes de pilotage)
  const intent = detectIntent(transcript);
  const pilotAction = extractPilotAction(intent);

  if (pilotAction) {
    const lastQuestion = state.memory.askedQuestions[state.memory.askedQuestions.length - 1] ?? "";
    const result = handlePilotCommand(pilotAction, lastQuestion);
    
    console.info("[interview-engine-v2] pilot_command_handled", {
      phase: state.phase,
      command: pilotAction
    });

    return {
      question: result.speakText ?? "",
      updatedState: state, // Pas de mutation d'Ã©tat pour Ã©viter de pÃ©naliser
      evaluationScore: 0,
      signals: { specificity: 0, quantifiedResults: 0, ownership: 0, technicalDepth: 0 },
      bluff: { bluffProbability: 0, flags: [] },
      finished: !!result.finished,
    };
  }

  // 1) Ã‰valuer la rÃ©ponse prÃ©cÃ©dente.
  const evaluation = evaluateTranscript(transcript, state.profile.gaps[0]);
  const signals = extractSignals(transcript);
  const bluff = detectBluff(transcript, signals);
  const contradiction = detectContradiction(state.facts, transcript) ?? undefined;
  const lastCategory = currentCategory(state);

  // 2) MÃ©moire + accumulateurs rÃ©alisme.
  let memory = updateMemory(state.memory, transcript, evaluation.score, signals);
  if (contradiction) {
    memory = { ...memory, contradictions: [...memory.contradictions, contradiction.message] };
  }
  const answered: AnsweredTurn[] = [
    ...state.answered,
    { category: lastCategory, score: evaluation.score, signals },
  ];
  const signalsList = [...state.signalsList, signals];
  const bluffList = [...state.bluffList, bluff];
  const contradictionList = contradiction
    ? [...state.contradictionList, contradiction]
    : state.contradictionList;

  // 2b) DifficultÃ© adaptative (P3.7.3).
  const difficulty = adaptDifficulty(state.difficulty, evaluation.score);

  // 3) DÃ©cider relance (rÃ©ponse faible/vague/contradiction/bluff) vs avancer.
  const weak =
    !!contradiction ||
    bluff.bluffProbability >= 0.55 ||
    evaluation.score < 55 ||
    signals.specificity < 0.25;
  let phase = state.phase;
  let phaseCount = state.phaseCount + 1;

  const quota = state.plan.questionsPerPhase[phase];
  const quotaReached = !weak && phaseCount >= quota;

  // Fin d'entretien : quota de la phase closing atteint.
  const finished = phase === "closing" && quotaReached;

  // Avancer de phase si quota atteint et pas encore en closing terminal.
  if (quotaReached && phase !== "closing") {
    phase = nextV2Phase(phase);
    phaseCount = 0;
  }

  let next: InterviewStateV2 = {
    ...state,
    phase,
    phaseCount,
    memory,
    answered,
    finished,
    difficulty,
    signalsList,
    bluffList,
    contradictionList,
  };

  if (finished) {
    return {
      question: "",
      updatedState: next,
      evaluationScore: evaluation.score,
      signals,
      bluff,
      ...(contradiction ? { contradiction } : {}),
      finished: true,
      recommendation: buildHiringRecommendation(answered),
      recruiterReport: buildRecruiterReport({
        answered,
        signalsList,
        bluffList,
        contradictions: contradictionList,
      }),
    };
  }

  // 4) Choisir la prochaine question (DÃ‰CISION V2, inchangÃ©e).
  //    PrioritÃ© : recadrage contradiction > relance (faible/bluff) > banque.
  let question: string;
  if (contradiction) {
    question = applyTone(contradiction.message, state.persona);
  } else if (weak) {
    question = buildFollowup(state, transcript, evaluation.score, signals);
  } else {
    question = selectQuestion(next);
  }

  next = recordAsked(next, question);

  return {
    question,
    updatedState: next,
    evaluationScore: evaluation.score,
    signals,
    bluff,
    ...(contradiction ? { contradiction } : {}),
    finished: false,
  };
}

// â”€â”€ SÃ©lection de questions â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function currentCategory(state: InterviewStateV2): string {
  return PHASE_CATEGORIES[state.phase][0] ?? "experience";
}

function selectQuestion(state: InterviewStateV2): string {
  const { profile, persona, phase } = state;
  const role = profile.targetRole;

  // Phase technique : tenter une question piÃ¨ge ciblÃ©e d'abord (si persona technique).
  if (phase === "technical" && persona.technicalFocus >= 4) {
    const trap = pickTrapQuestion(profile, state.memory.askedQuestions);
    if (trap) return applyTone(trap, persona);
  }

  // Phase challenge : prioriser les gaps.
  const categories = PHASE_CATEGORIES[phase];
  for (const cat of categories) {
    const candidates: Question[] = byCategory(cat);
    for (const q of candidates) {
      // triggers : si {skill}, on cible une compÃ©tence/gap pertinente.
      const skill =
        cat === "gap"
          ? profile.gaps[0]
          : q.triggers.includes("{skill}")
            ? profile.technicalSkills[0]
            : undefined;
      const rendered = applyTone(
        renderQuestion(q, { skill: skill ?? "", role }),
        persona,
      );
      const triggersOk =
        q.triggers.length === 0 ||
        q.triggers.includes("{skill}") ||
        q.triggers.some((t) =>
          [...profile.technicalSkills, ...profile.softSkills].includes(t),
        );
      if (triggersOk && !state.memory.askedQuestions.includes(rendered)) {
        return rendered;
      }
    }
  }
  // Fallback : question d'expÃ©rience gÃ©nÃ©rique non rÃ©pÃ©tÃ©e.
  const fb = applyTone("Peux-tu dÃ©velopper avec un exemple concret et chiffrÃ© ?", persona);
  return fb;
}

/** Relance contextuelle (Bloc 5) : cible la faiblesse STAR / le sujet. */
function buildFollowup(state: InterviewStateV2, transcript: string, _score: number, signals: AnswerSignals, ): string {
  void transcript;
  const p = state.persona;
  if (signals.quantifiedResults < 1)
    return applyTone("Quel rÃ©sultat concret as-tu obtenu ? Donne un chiffre.", p);
  if (signals.ownership < 0.4)
    return applyTone("Et toi prÃ©cisÃ©ment, qu'as-tu fait dans cette situation ?", p);
  if (signals.technicalDepth < 0.34 && state.phase === "technical")
    return applyTone("Peux-tu dÃ©tailler les choix techniques et leurs compromis ?", p);
  return applyTone("Peux-tu approfondir avec un exemple plus prÃ©cis ?", p);
}

// â”€â”€ MÃ©moire â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function recordAsked(state: InterviewStateV2, question: string): InterviewStateV2 {
  if (!question) return state;
  return {
    ...state,
    memory: {
      ...state.memory,
      askedQuestions: [...state.memory.askedQuestions, question],
    },
  };
}

function updateMemory(memory: InterviewMemory, transcript: string, score: number, signals: AnswerSignals, ): InterviewMemory {
  const detectedStrengths = [...memory.detectedStrengths];
  const detectedWeaknesses = [...memory.detectedWeaknesses];
  if (score >= 75 && !detectedStrengths.includes("rÃ©ponse structurÃ©e"))
    detectedStrengths.push("rÃ©ponse structurÃ©e");
  if (signals.ownership >= 0.7 && !detectedStrengths.includes("ownership"))
    detectedStrengths.push("ownership");
  if (score < 50 && !detectedWeaknesses.includes("structure faible"))
    detectedWeaknesses.push("structure faible");
  if (signals.quantifiedResults < 1 && !detectedWeaknesses.includes("peu de rÃ©sultats chiffrÃ©s"))
    detectedWeaknesses.push("peu de rÃ©sultats chiffrÃ©s");

  return {
    ...memory,
    answeredTopics: [...memory.answeredTopics, transcript.slice(0, 40)],
    detectedStrengths,
    detectedWeaknesses,
  };
}
