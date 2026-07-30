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

import { type InterviewState, applyPatch } from "./state.js";
import { openingStep, type FeedbackSignal } from "./interview-engine.js";
import { type InterviewSummary } from "./interview-summary.js";
import type { VoiceTurnRecord } from "../sessions/session-manager.js";
import type { TTSAdapter } from "../adapters/tts/index.js";
import { detectIntent, type UserIntent } from "./intent-detector.js";
import { 
  handleCommand, 
  handleAnswer, 
  handleSilence, 
  type TurnContext 
} from "./voice-orchestrator-handlers.js";

export class UnexpectedTurnError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnexpectedTurnError";
  }
}


/** Sortie canonique d'un tour vocal (P3.2 + P3.5). */
export interface VoiceTurnResult {
  transcript: string;
  score: number;
  feedback: string;
  nextQuestion: string;
  signal: FeedbackSignal;
  finished: boolean;
  /** Intention de pilotage détectée (P3.5). */
  intent: UserIntent;
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
  tts: TTSAdapter | _undefined,
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

function assertExhaustive(x: never): never {
  throw new UnexpectedTurnError(`Unhandled intent: ${JSON.stringify(x)}`);
}

/**
 * Traite un tour complet à partir du transcript final de l'utilisateur.
 *
 * Utilise une architecture de type "Command Pattern" :
 * 1. Détecte l'intention
 * 2. Route vers un handler pur qui génère un "TurnPlan"
 * 3. Applique les effets de bord (TTS) et retourne le résultat final
 */
export async function processVoiceTurn(
  state: InterviewState,
  transcript: string,
  tts?: TTSAdapter,
  history: VoiceTurnRecord[] = [],
): Promise<VoiceTurnResult> {
  const intent = detectIntent(transcript);
  const ctx: TurnContext = { state, transcript, history };

  const plan = (() => {
    switch (intent.kind) {
      case "command": return handleCommand(intent.action, ctx);
      case "answer": return handleAnswer(intent.text, ctx);
      case "silence": return handleSilence(ctx);
      default: return assertExhaustive(intent);
    }
  })();

  const { audio, fallback } = await safeSynthesize(tts, plan.speakText);

  const result: VoiceTurnResult = {
    transcript: (transcript ?? "").trim(),
    score: plan.score,
    feedback: plan.feedback,
    nextQuestion: plan.nextQuestion,
    signal: plan.signal,
    finished: plan.finished,
    intent,
    audioFallback: fallback,
    state: applyPatch(state, plan.statePatch),
  };
  
  if (audio) result.audio = audio;
  if (plan.summary) result.summary = plan.summary;

  return result;
}
