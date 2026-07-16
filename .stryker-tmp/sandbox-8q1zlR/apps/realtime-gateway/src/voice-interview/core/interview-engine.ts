/**
 * core/interview-engine.ts — Cerveau pur de l'entretien vocal (P3.1).
 *
 * PURE FUNCTION DESIGN : nextStep(state, transcript) -> { nextQuestion, updatedState, feedbackSignal }
 * Aucune I/O. Réutilise l'évaluation + le générateur de questions déterministes.
 *
 * Décision :
 *  - réponse faible (< 60) et phase non finale -> "probe" (relance ciblée STAR)
 *  - réponse moyenne (60–79)                    -> "deepen" (creuser le sujet)
 *  - réponse forte (>= 80)                      -> "move-on" (avancer de phase)
 */
// @ts-nocheck


import {
  type InterviewState,
  applyPatch,
  nextPhase,
  turnCount,
  isFinished,
} from "./state.js";
import { evaluateTranscript, type AnswerEvaluation } from "./evaluation.js";
import { generateQuestion } from "./question-generator.js";
import { selectNextMunition, formatMunitionQuestion } from "./strategies/munition-selector.js";

export type FeedbackSignal = "probe" | "deepen" | "move-on";

export interface NextStepResult {
  nextQuestion: string;
  updatedState: InterviewState;
  feedbackSignal: FeedbackSignal;
  evaluation: AnswerEvaluation;
  finished: boolean;
}

/** Nombre max de tours avant de forcer la clôture (anti-boucle infinie). */
const MAX_TURNS = 8;

/**
 * Calcule l'étape suivante de l'entretien à partir de l'état courant et du
 * transcript de la réponse de l'utilisateur. Déterministe.
 */
export function nextStep(
  state: InterviewState,
  transcript: string,
): NextStepResult {
  const evaluation = evaluateTranscript(transcript, state.jobGap);

  // Détermine l'intention pédagogique.
  let signal: FeedbackSignal;
  if (evaluation.score >= 80) signal = "move-on";
  else if (evaluation.score >= 60) signal = "deepen";
  else signal = "probe";

  // Enregistre le signal de score.
  const scoreSignals = [...state.scoreSignals, evaluation.score];

  // Décide la phase suivante.
  const reachedMax = turnCount(state) + 1 >= MAX_TURNS;
  const shouldAdvancePhase = signal === "move-on";
  const phase = reachedMax
    ? "wrap"
    : shouldAdvancePhase
      ? nextPhase(state.phase)
      : state.phase;

  // Track candidate response to current munition
  let munitionsUsage = state.munitionsUsage;
  let currentMunitionId = state.currentMunitionId;

  const isSilence = transcript.trim().length === 0;
  const responseType = isSilence ? "silence" : (signal === "probe" ? "deflected" : "engaged");

  if (currentMunitionId) {
     const usage = munitionsUsage[currentMunitionId];
     if (usage) {
       munitionsUsage = {
         ...munitionsUsage,
         [currentMunitionId]: { ...usage, lastResponse: responseType }
       };
     }
     
     if (signal !== "probe" || phase !== state.phase) {
       currentMunitionId = undefined;
     }
  }

  // Génère la question suivante.
  const probe = signal === "probe";
  let nextQuestion = "";
  
  if (probe && currentMunitionId) {
    nextQuestion = generateQuestion({
      phase,
      gap: state.jobGap,
      askedQuestions: state.askedQuestions,
      lastEvaluation: evaluation,
      probe,
      style: state.interviewerStyle,
    });
  } else if (!currentMunitionId && phase === "pressure") {
    const munition = selectNextMunition({
      state: { ...state, munitionsUsage },
      currentPhase: phase,
      currentTurnNumber: turnCount(state)
    });
    
    if (munition) {
      nextQuestion = formatMunitionQuestion(munition);
      currentMunitionId = munition.id;
      munitionsUsage = {
        ...munitionsUsage,
        [munition.id]: {
          firstUsedAtTurn: munitionsUsage[munition.id]?.firstUsedAtTurn ?? turnCount(state),
          attempts: (munitionsUsage[munition.id]?.attempts ?? 0) + 1,
          lastResponse: null
        }
      };
    }
  }
  
  if (!nextQuestion) {
    nextQuestion = generateQuestion({
      phase,
      gap: state.jobGap,
      askedQuestions: state.askedQuestions,
      lastEvaluation: evaluation,
      probe,
      style: state.interviewerStyle,
    });
  }

  const updatedState = applyPatch(state, {
    phase,
    scoreSignals,
    askedQuestions: [...state.askedQuestions, nextQuestion],
    currentTopic: state.jobGap || state.currentTopic,
    munitionsUsage,
    currentMunitionId,
  });

  return {
    nextQuestion,
    updatedState,
    feedbackSignal: signal,
    evaluation,
    finished: isFinished(updatedState),
  };
}

/**
 * Première question d'ouverture (avant tout transcript).
 * Met à jour l'état avec la question posée.
 */
export function openingStep(state: InterviewState): {
  question: string;
  updatedState: InterviewState;
} {
  const question = generateQuestion({
    phase: state.phase,
    gap: state.jobGap,
    askedQuestions: state.askedQuestions,
    style: state.interviewerStyle,
  });
  return {
    question,
    updatedState: applyPatch(state, {
      askedQuestions: [...state.askedQuestions, question],
    }),
  };
}
