/**
 * core/voice-orchestrator-handlers.ts — Handlers purs pour le routage de tours (P3.5).
 */
// @ts-nocheck


import { type InterviewState } from "./state.js";

import { nextStep, type FeedbackSignal } from "./interview-engine.js";
import { buildFeedbackText } from "./feedback-text.js";
import { rephraseQuestion } from "./question-generator.js";
import { buildInterviewSummary, type InterviewSummary } from "./interview-summary.js";
import type { VoiceTurnRecord } from "../sessions/session-manager.js";
import type { UserCommand } from "./intent-detector.js";

export interface TurnContext {
  state: InterviewState;
  transcript: string;
  history: VoiceTurnRecord[];
}

export interface TurnPlan {
  speakText: string;
  feedback: string;
  score: number;
  nextQuestion: string;
  signal: FeedbackSignal;
  finished: boolean;
  statePatch: Partial<InterviewState>;
  summary?: InterviewSummary;
}

export function handleStop(ctx: TurnContext): TurnPlan {
  const summary = buildInterviewSummary(ctx.history);
  const closing = "Très bien, terminons ici. Voici ta synthèse.";
  return {
    speakText: closing,
    feedback: closing,
    score: 0,
    nextQuestion: "",
    signal: "move-on",
    finished: true,
    statePatch: { phase: "wrap" },
    summary,
  };
}

function lastQuestion(state: InterviewState): string {
  return state.askedQuestions[state.askedQuestions.length - 1] ?? "";
}

export function handleRepeat(ctx: TurnContext): TurnPlan {
  const nextQuestion = rephraseQuestion(lastQuestion(ctx.state), ctx.state.jobGap);
  const feedback = "Bien sûr, je reformule plus simplement.";
  return {
    speakText: nextQuestion,
    feedback,
    score: 0,
    nextQuestion,
    signal: "probe",
    finished: false,
    statePatch: {
      askedQuestions: [...ctx.state.askedQuestions, nextQuestion],
    },
  };
}

export function handleClarify(ctx: TurnContext): TurnPlan {
  const nextQuestion = `Pour clarifier : je cherche un exemple concret de ta part lié à « ${
    ctx.state.jobGap || "ton expérience"
  } ». ${lastQuestion(ctx.state)}`.trim();
  const feedback = "Pas de souci, voici une explication.";
  return {
    speakText: nextQuestion,
    feedback,
    score: 0,
    nextQuestion,
    signal: "probe",
    finished: false,
    statePatch: {
      askedQuestions: [...ctx.state.askedQuestions, nextQuestion],
    },
  };
}

export function handleSlower(ctx: TurnContext): TurnPlan {
  const nextQuestion = lastQuestion(ctx.state);
  const feedback = "D'accord, je ralentis. Reprenons tranquillement.";
  return {
    speakText: nextQuestion,
    feedback,
    score: 0,
    nextQuestion,
    signal: "probe",
    finished: false,
    statePatch: {
      askedQuestions: [...ctx.state.askedQuestions, nextQuestion],
    },
  };
}

export function handleNext(ctx: TurnContext): TurnPlan {
  const step = nextStep(ctx.state, "");
  const feedback = "D'accord, passons à la question suivante.";
  return {
    speakText: step.nextQuestion,
    feedback,
    score: 0,
    nextQuestion: step.nextQuestion,
    signal: "move-on",
    finished: step.finished,
    statePatch: step.updatedState,
    ...(step.finished ? { summary: buildInterviewSummary(ctx.history) } : {}),
  };
}

export function handleCommand(action: UserCommand, ctx: TurnContext): TurnPlan {
  switch (action) {
    case "stop": return handleStop(ctx);
    case "repeat": return handleRepeat(ctx);
    case "clarify": return handleClarify(ctx);
    case "slower": return handleSlower(ctx);
    case "next": return handleNext(ctx);
  }
}

export function handleAnswer(text: string, ctx: TurnContext): TurnPlan {
  const step = nextStep(ctx.state, text);
  const feedback = buildFeedbackText(step.feedbackSignal, step.evaluation);
  return {
    speakText: step.nextQuestion,
    feedback,
    score: step.evaluation.score,
    nextQuestion: step.nextQuestion,
    signal: step.feedbackSignal,
    finished: step.finished,
    statePatch: step.updatedState,
    ...(step.finished ? { summary: buildInterviewSummary(ctx.history) } : {}),
  };
}

export function handleSilence(ctx: TurnContext): TurnPlan {
  // If silence, just act as if it's an answer that is empty, the engine will prompt again
  return handleAnswer("", ctx);
}
