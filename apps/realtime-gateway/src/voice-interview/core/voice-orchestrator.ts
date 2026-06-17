/**
 * core/voice-orchestrator.ts — Cœur conversationnel P3.2.
 *
 * Orchestre UN tour d'entretien vocal :
 *   transcript utilisateur
 *     -> évaluation STAR (engine pur)
 *     -> nextStep (décision + question suivante)
 *     -> synthèse vocale de la question (TTS, avec fallback)
 *   = VoiceTurnResult (sortie canonique P3.2)
 *
 * L'engine reste 100% pur ; seul le TTS est une dépendance injectée (abstraction).
 * Fallback obligatoire : si TTS KO -> réponse texte seule, jamais de crash.
 */

import { type InterviewState, applyPatch } from "./state";
import { nextStep, openingStep, type FeedbackSignal } from "./interview-engine";
import { buildFeedbackText } from "./feedback-text";
import { detectIntent, type Intent } from "./intent-detector";
import { rephraseQuestion } from "./question-generator";
import {
  buildInterviewSummary,
  type InterviewSummary,
} from "./interview-summary";
import type { VoiceTurnRecord } from "../sessions/session-manager";
import type { TTSAdapter } from "../adapters/tts";

/** Sortie canonique d'un tour vocal (P3.2 + P3.5). */
export interface VoiceTurnResult {
  transcript: string;
  score: number;
  feedback: string;
  nextQuestion: string;
  signal: FeedbackSignal;
  finished: boolean;
  /** Intention de pilotage détectée (P3.5). */
  intent: Intent;
  /** Présent si l'entretien est clôturé (intent "stop" ou fin naturelle). */
  summary?: InterviewSummary;
  /** Audio de la question suivante (undefined si TTS indisponible). */
  audio?: ArrayBuffer;
  /** True si on a dû retomber sur du texte seul (TTS silencieux/KO). */
  audioFallback: boolean;
  state: InterviewState;
}

/** Résultat d'ouverture (avant tout transcript). */
export interface VoiceOpeningResult {
  question: string;
  audio?: ArrayBuffer;
  audioFallback: boolean;
  state: InterviewState;
}

/**
 * Synthétise un texte en audio de façon sûre.
 * Retourne { audio?, fallback } — ne rejette jamais.
 */
async function safeSynthesize(
  tts: TTSAdapter | undefined,
  text: string,
): Promise<{ audio?: ArrayBuffer; fallback: boolean }> {
  if (!tts) return { fallback: true };
  try {
    const audio = await tts.synthesize(text);
    // Si le TTS n'est pas configuré, il renvoie un buffer silencieux -> fallback logique.
    return { audio, fallback: !tts.isConfigured() };
  } catch {
    return { fallback: true };
  }
}

/** Première question (ouverture de l'entretien) + audio optionnel. */
export async function openingTurn(
  state: InterviewState,
  tts?: TTSAdapter,
): Promise<VoiceOpeningResult> {
  const { question, updatedState } = openingStep(state);
  const { audio, fallback } = await safeSynthesize(tts, question);
  const result: VoiceOpeningResult = {
    question,
    audioFallback: fallback,
    state: updatedState,
  };
  if (audio) result.audio = audio;
  return result;
}

/** Dernière question posée (pour repeat/clarify). */
function lastQuestion(state: InterviewState): string {
  return state.askedQuestions[state.askedQuestions.length - 1] ?? "";
}

/**
 * Traite un tour complet à partir du transcript final de l'utilisateur.
 *
 * P3.5 : on détecte d'abord une intention de pilotage. Si c'en est une
 * (repeat/clarify/next/stop), on NE pénalise PAS le candidat (pas d'évaluation),
 * et on agit en conséquence. Sinon, comportement standard (P3.2).
 */
export async function processVoiceTurn(
  state: InterviewState,
  transcript: string,
  tts?: TTSAdapter,
  history: VoiceTurnRecord[] = [],
): Promise<VoiceTurnResult> {
  const intent = detectIntent(transcript);

  // ── Intentions de pilotage : pas d'évaluation, pas de pénalité ──────
  if (intent !== "none") {
    // STOP -> clôture propre + résumé.
    if (intent === "stop") {
      const summary = buildInterviewSummary(history);
      const closing = "Très bien, terminons ici. Voici ta synthèse.";
      const { audio, fallback } = await safeSynthesize(tts, closing);
      const wrapped = applyPatch(state, { phase: "wrap" });
      const result: VoiceTurnResult = {
        transcript: (transcript ?? "").trim(),
        score: 0,
        feedback: closing,
        nextQuestion: "",
        signal: "move-on",
        finished: true,
        intent,
        summary,
        audioFallback: fallback,
        state: wrapped,
      };
      if (audio) result.audio = audio;
      return result;
    }

    // REPEAT -> reformulation simplifiée de la dernière question.
    // CLARIFY -> explication, phase inchangée, pas de pénalité.
    // NEXT/SLOWER -> on enchaîne sans pénaliser.
    let nextQuestion: string;
    let feedback: string;
    if (intent === "repeat") {
      nextQuestion = rephraseQuestion(lastQuestion(state), state.jobGap);
      feedback = "Bien sûr, je reformule plus simplement.";
    } else if (intent === "clarify") {
      nextQuestion = `Pour clarifier : je cherche un exemple concret de ta part lié à « ${
        state.jobGap || "ton expérience"
      } ». ${lastQuestion(state)}`.trim();
      feedback = "Pas de souci, voici une explication.";
    } else if (intent === "slower") {
      nextQuestion = lastQuestion(state);
      feedback = "D'accord, je ralentis. Reprenons tranquillement.";
    } else {
      // next : on génère réellement la question suivante via le moteur,
      // mais sans évaluer la "réponse" (transcript vide pour ne pas pénaliser).
      const step = nextStep(state, "");
      nextQuestion = step.nextQuestion;
      feedback = "D'accord, passons à la question suivante.";
      const { audio, fallback } = await safeSynthesize(tts, nextQuestion);
      const r: VoiceTurnResult = {
        transcript: (transcript ?? "").trim(),
        score: 0,
        feedback,
        nextQuestion,
        signal: "move-on",
        finished: step.finished,
        intent,
        audioFallback: fallback,
        state: step.updatedState,
      };
      if (audio) r.audio = audio;
      return r;
    }

    const { audio, fallback } = await safeSynthesize(tts, nextQuestion);
    const updatedState = applyPatch(state, {
      askedQuestions: [...state.askedQuestions, nextQuestion],
    });
    const result: VoiceTurnResult = {
      transcript: (transcript ?? "").trim(),
      score: 0,
      feedback,
      nextQuestion,
      signal: "probe",
      finished: false,
      intent,
      audioFallback: fallback,
      state: updatedState,
    };
    if (audio) result.audio = audio;
    return result;
  }

  // ── Réponse normale (P3.2) ──────────────────────────────────────────
  const step = nextStep(state, transcript);
  const feedback = buildFeedbackText(step.feedbackSignal, step.evaluation);
  const { audio, fallback } = await safeSynthesize(tts, step.nextQuestion);

  const result: VoiceTurnResult = {
    transcript: (transcript ?? "").trim(),
    score: step.evaluation.score,
    feedback,
    nextQuestion: step.nextQuestion,
    signal: step.feedbackSignal,
    finished: step.finished,
    intent,
    audioFallback: fallback,
    state: step.updatedState,
  };
  if (audio) result.audio = audio;
  // Fin naturelle -> attache aussi un résumé.
  if (step.finished) result.summary = buildInterviewSummary(history);
  return result;
}
