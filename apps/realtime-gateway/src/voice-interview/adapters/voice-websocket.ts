/**
 * adapters/voice-websocket.ts — Transport WebSocket conversationnel (P3.2 + P3.4).
 *
 * Étend P3.1/P3.2 SANS casser le core.
 * Boucle : audio_chunk -> STT -> end_speech -> orchestrator -> TTS -> audio.
 *
 * P3.4 (transport/UX runtime only) :
 *   - barge-in : event client { type: "interrupt" } -> ack { type: "interrupted" }
 *   - reprise de session : input.resumeSessionId
 *   - eventId sur les messages serveur (déduplication client)
 *   - logs structurés (turn_latency_ms, tts_provider_used) via hook optionnel
 *
 * Events :
 *   client -> server : audio binaire | { type: "end_speech" | "interrupt" }
 *   server -> client : ready | transcript | feedback_text | next_question_audio
 *                      | interrupted | error
 */

import { SessionManager } from "../sessions/session-manager.js";
import { DeepgramAdapter } from "./deepgram.js";
import type { TTSAdapter } from "./tts/index.js";
import { DefaultTTSAdapter } from "./tts/index.js";
import { openingTurn, processVoiceTurn } from "../core/voice-orchestrator.js";
import { now, logMetrics, type VoiceMetrics } from "../core/metrics.js";
import { interviewRepository as repository } from "../persistence/singleton.js";
import { finalizeInterview } from "../core/post-interview-processor.js";

/** Socket minimal supportant l'envoi binaire (audio). */
export interface VoiceWsLike {
  send(data: string | ArrayBuffer | Uint8Array): void;
  close(code?: number, reason?: string): void;
  on(event: "message", cb: (data: unknown, isBinary?: boolean) => void): void;
  on(event: "close", cb: () => void): void;
}

/** Messages serveur -> client (P3.2 + P3.4). */
export type VoiceServerMessage =
  | { type: "ready"; sessionId: string; question: string; eventId: string }
  | { type: "transcript"; text: string; final: boolean; eventId: string }
  | {
      type: "feedback_text";
      feedback: string;
      score: number;
      question: string;
      signal: string;
      finished: boolean;
      eventId: string;
    }
  | { type: "next_question_audio"; available: boolean; eventId: string }
  | { type: "interrupted"; eventId: string }
  | {
      type: "summary";
      summary: import("../core/interview-summary.js").InterviewSummary;
      eventId: string;
    }
  | { type: "error"; message: string; eventId: string };

/** Logger structuré optionnel (observabilité légère, pas d'infra). */
export interface VoiceMetricsLogger {
  (event: string, fields: Record<string, unknown>): void;
}

export interface VoiceConnectionDeps {
  sessions: SessionManager;
  tts?: TTSAdapter;
  createStt?: (cb: {
    onTranscript: (t: string) => void;
    onFinalTranscript: (t: string) => void;
    onError: (e: unknown) => void;
  }) => DeepgramAdapter;
  /** Hook de logs structurés (turn_latency_ms, etc.). */
  log?: VoiceMetricsLogger;
}

export interface VoiceConnectionInput {
  jobGap?: string;
  initialQuestion?: string;
  /** Reprise d'une session existante (resilience WS). */
  resumeSessionId?: string;
  /** Identifiant utilisateur issu du token (P3). */
  userId?: string;
  /** Rôle ciblé par l'entretien (pour le scoring pondéré). */
  targetRole?: string;
}

/** Omit distributif : préserve le discriminant `type` sur les unions. */
type DistributiveOmit<T, K extends keyof T> = T extends unknown
  ? Omit<T, K>
  : never;

/** Message serveur sans l'eventId (ajouté à l'envoi). */
type VoiceServerMessageInput = DistributiveOmit<VoiceServerMessage, "eventId">;

let eventSeq = 0;
function nextEventId(): string {
  eventSeq += 1;
  return `e${Date.now().toString(36)}_${eventSeq}`;
}

/**
 * Branche une connexion sur une session vocale conversationnelle complète.
 * Retourne l'id de session.
 */
export async function handleVoiceConnectionV2(
  ws: _VoiceWsLike,
  deps: VoiceConnectionDeps,
  input: VoiceConnectionInput = {},
): Promise<string> {
  const tts = deps.tts ?? new DefaultTTSAdapter();
  const log: VoiceMetricsLogger = deps.log ?? (() => {});

  const sendJson = (msg: VoiceServerMessageInput) => {
    try {
      ws.send(JSON.stringify({ ...msg, eventId: nextEventId() }));
    } catch (error) {
      /* socket fermé */
    }
  };
  const sendAudio = (audio: ArrayBuffer) => {
    try {
      ws.send(audio);
    } catch (error) {
      /* socket fermé */
    }
  };

  // 1) Session : reprise si demandée et encore valide, sinon création.
  let session =
    (input.resumeSessionId
      ? deps.sessions.getSession(input.resumeSessionId)
      : undefined) ?? undefined;
  const resumed = !!session;
  if (!session) {
    const createInput: { jobGap?: string; initialQuestion?: string } = {};
    if (input.jobGap !== undefined) createInput.jobGap = input.jobGap;
    if (input.initialQuestion !== undefined)
      createInput.initialQuestion = input.initialQuestion;
    session = deps.sessions.createSession(createInput);
  }
  const sessionId = session.id;
  log("session_open", { sessionId, resumed });

  let turnMetrics: VoiceMetrics = { sessionId };

  // Ouverture : nouvelle question seulement si session neuve.
  if (!resumed) {
    void repository.create({
      sessionId,
      userId: input.userId || "anonymous",
      targetRole: input.targetRole ?? "generic",
      startedAt: Date.now(),
      transcript: []
    }).catch(console.error);

    const opening = await openingTurn(session.state, tts);
    deps.sessions.updateSession(sessionId, opening.state);

    const existing = await repository.get(sessionId);
    if (existing) {
      repository.update(sessionId, { transcript: [...existing.transcript, `AI: ${opening.question}`] }).catch(console.error);
    }

    sendJson({ type: "ready", sessionId, question: opening.question });
    sendJson({ type: "next_question_audio", available: !!opening.audio });
    if (opening.audio) sendAudio(opening.audio);
  } else {
    const lastQuestion =
      session.state.askedQuestions[session.state.askedQuestions.length - 1] ??
      "";
    sendJson({ type: "ready", sessionId, question: lastQuestion });
  }

  // 2) STT : transcripts partiels (interim -> latence) + final.
  let lastFinalTranscript = "";
  const stt = (deps.createStt ?? ((cb) => new DeepgramAdapter(cb)))({
    onTranscript: (t) => sendJson({ type: "transcript", text: t, final: false }),
    onFinalTranscript: async (t) => {
      try {
        lastFinalTranscript = t;
        turnMetrics.sttEnd = now();
        sendJson({ type: "transcript", text: t, final: true });

        const existing = await repository.get(sessionId);
        if (existing && t.trim()) {
          repository.update(sessionId, { transcript: [...existing.transcript, `User: ${t.trim()}`] }).catch(console.error);
        }
      } catch (error) {
        console.error("Error in onFinalTranscript:", e);
      }
    },
    onError: (e) =>
      sendJson({
        type: "error",
        message: e instanceof Error ? e.message : "Erreur STT",
      }),
  });
  stt.start();

  // Traite la fin de prise de parole = un tour complet.
  const handleEndSpeech = async () => {
    const current = deps.sessions.getSession(sessionId);
    if (!current) {
      sendJson({ type: "error", message: "Session expirée." });
      return;
    }
    const startedAt = Date.now();
    turnMetrics.llmStart = now();

    const wrappedTts: TTSAdapter = {
      isConfigured: () => tts.isConfigured(),
      synthesize: async (text: string) => {
        turnMetrics.llmEnd = now();
        turnMetrics.ttsStart = now();
        const res = await tts.synthesize(text);
        turnMetrics.ttsEnd = now();
        return res;
      },
    };

    const turn = await processVoiceTurn(
      current.state,
      lastFinalTranscript,
      wrappedTts,
      current.history,
    );
    if (!turnMetrics.llmEnd) turnMetrics.llmEnd = now();

    const existing = await repository.get(sessionId);
    if (existing && turn.nextQuestion) {
      repository.update(sessionId, { transcript: [...existing.transcript, `AI: ${turn.nextQuestion}`] }).catch(console.error);
    }

    deps.sessions.recordTurn(sessionId, {
      state: turn.state,
      transcript: turn.transcript,
      score: turn.score,
      question: turn.nextQuestion,
      ...(turn.audio ? { audio: turn.audio } : {}),
    });
    sendJson({
      type: "feedback_text",
      feedback: turn.feedback,
      score: turn.score,
      question: turn.nextQuestion,
      signal: turn.signal,
      finished: turn.finished,
    });
    sendJson({ type: "next_question_audio", available: !!turn.audio });
    if (turn.audio) sendAudio(turn.audio);
    // P3.5 : synthèse finale (stop ou fin naturelle).
    if (turn.summary) {
      sendJson({ type: "summary", summary: turn.summary });
    }
    log("turn_completed", {
      sessionId,
      turn_latency_ms: Date.now() - startedAt,
      score: turn.score,
      signal: turn.signal,
      tts_provider_used: turn.audioFallback ? "fallback" : "real",
      finished: turn.finished,
    });
    
    logMetrics(turnMetrics);
    turnMetrics = { sessionId };

    lastFinalTranscript = "";
  };

  // Barge-in : l'utilisateur interrompt -> on acquitte (le client coupe le TTS).
  const handleInterrupt = () => {
    log("interrupt", { sessionId });
    sendJson({ type: "interrupted" });
  };

  // 3) Routage des messages entrants.
  ws.on("message", (data: unknown, isBinary?: boolean) => {
    if (isBinary || data instanceof Uint8Array || data instanceof ArrayBuffer) {
      if (!turnMetrics.sttStart) turnMetrics.sttStart = now();
      const chunk =
        data instanceof Uint8Array
          ? data
          : data instanceof ArrayBuffer
            ? new Uint8Array(data)
            : null;
      if (chunk) stt.sendAudio(chunk);
      return;
    }
    if (typeof data === "string") {
      let msg: { type?: string } = {};
      try {
        msg = JSON.parse(data);
      } catch (error) {
        return;
      }
      if (msg.type === "end_speech") void handleEndSpeech();
      else if (msg.type === "interrupt") handleInterrupt();
    }
  });

  ws.on("close", () => {
    stt.stop();
    log("session_close", { sessionId });
    repository.update(sessionId, { endedAt: Date.now() }).catch(console.error);

    // Scoring async post-session (fire and forget)
    finalizeInterview(sessionId, log).catch(console.error);
  });

  return sessionId;
}

