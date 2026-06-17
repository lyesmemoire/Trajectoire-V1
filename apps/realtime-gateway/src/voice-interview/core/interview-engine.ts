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

import {
  type InterviewState,
  applyPatch,
  nextPhase,
  turnCount,
  isFinished,
} from "./state";
import { evaluateTranscript, type AnswerEvaluation } from "./evaluation";
import { generateQuestion } from "./question-generator";

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

  // Génère la question suivante.
  const probe = signal === "probe";
  const nextQuestion = generateQuestion({
    phase,
    gap: state.jobGap,
    askedQuestions: state.askedQuestions,
    lastEvaluation: evaluation,
    probe,
    style: state.interviewerStyle,
  });

  const updatedState = applyPatch(state, {
    phase,
    scoreSignals,
    askedQuestions: [...state.askedQuestions, nextQuestion],
    currentTopic: state.jobGap || state.currentTopic,
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
