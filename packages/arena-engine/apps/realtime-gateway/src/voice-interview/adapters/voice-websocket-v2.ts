/**
 * adapters/voice-websocket-v2.ts — Transport WebSocket branché sur le moteur V2 (P3.6.1).
 *
 * Active l'Interview Engine V2 (core/v2) dans le runtime, en OPT-IN.
 * V1 (handleVoiceConnection / handleVoiceConnectionV2) reste inchangé.
 *
 * Flux : profil (params) -> initInterviewV2 -> STT final -> nextV2Step -> TTS -> audio
 *        -> à la fin : message {type:"summary_v2", report, recommendation}.
 *
 * État V2 conservé dans un store in-memory + TTL local (pas de DB).
 */

import { DeepgramAdapter } from "./deepgram.js";
import type { TTSAdapter } from "./tts/index.js";
import { DefaultTTSAdapter } from "./tts/index.js";
import type { VoiceWsLike, VoiceMetricsLogger } from "./voice-websocket.js";
import {
  buildCandidateProfile,
  type BuildProfileInput,
} from "../core/v2/candidate-profile.js";
import {
  initInterviewV2,
  nextV2Step,
  type InterviewStateV2,
} from "../core/v2/interview-engine-v2.js";
import type { PersonaName } from "../core/v2/personas.js";
import { WsMessageThrottler } from "../../../../../lib/security/ws-message-throttler.js";

/** Store minimal d'états V2 (in-memory + TTL). */
class V2SessionStore {
  private map = new Map<string, { state: InterviewStateV2; updatedAt: number }>();
  private seq = 0;
  constructor(private readonly ttlMs = 30 * 60 * 1000) {}
  create(state: InterviewStateV2): string {
    this.evict();
    this.seq += 1;
    const id = `v2_${Date.now().toString(36)}_${this.seq}`;
    this.map.set(id, { state, updatedAt: Date.now() });
    return id;
  }
  get(id: string): InterviewStateV2 | undefined {
    const e = this.map.get(id);
    if (!e) return undefined;
    if (Date.now() - e.updatedAt > this.ttlMs) {
      this.map.delete(id);
      return undefined;
    }
    return e.state;
  }
  update(id: string, state: InterviewStateV2): void {
    const e = this.map.get(id);
    if (e) {
      e.state = state;
      e.updatedAt = Date.now();
    }
  }
  delete(id: string): void {
    this.map.delete(id);
  }
  private evict() {
    for (const [id, e] of this.map) {
      if (Date.now() - e.updatedAt > this.ttlMs) this.map.delete(id);
    }
  }
}

const store = new V2SessionStore();

export interface V2ServerMessage {
  type:
    | "ready"
    | "transcript"
    | "feedback_text"
    | "next_question_audio"
    | "interrupted"
    | "summary_v2"
    | "error";
  [key: string]: unknown;
}

export interface VoiceV2Deps {
  tts?: TTSAdapter;
  createStt?: (cb: {
    onTranscript: (t: string) => void;
    onFinalTranscript: (t: string) => void;
    onError: (e: unknown) => void;
  }) => DeepgramAdapter;
  log?: VoiceMetricsLogger;
}

export interface VoiceV2Input extends BuildProfileInput {
  persona?: PersonaName;
}

let evSeq = 0;
const eid = () => `e${Date.now().toString(36)}_${++evSeq}`;

/**
 * Branche une connexion sur le moteur V2. Retourne l'id de session V2.
 */
export async function handleVoiceConnectionV2Engine(
  ws: VoiceWsLike,
  deps: VoiceV2Deps,
  input: VoiceV2Input = {},
): Promise<string> {
  const tts = deps.tts ?? new DefaultTTSAdapter();
  const log: VoiceMetricsLogger = deps.log ?? (() => {});

  const sendJson = (msg: V2ServerMessage) => {
    try {
      ws.send(JSON.stringify({ ...msg, eventId: eid() }));
    } catch {
      /* socket fermé */
    }
  };
  const sendAudio = (a: ArrayBuffer) => {
    try {
      ws.send(a);
    } catch {
      /* socket fermé */
    }
  };

  const safeSynthesize = async (text: string) => {
    try {
      const audio = await tts.synthesize(text);
      return { audio, fallback: !tts.isConfigured() };
    } catch {
      return { audio: undefined as ArrayBuffer | undefined, fallback: true };
    }
  };

  // 1) Profil candidat + init V2.
  const profile = buildCandidateProfile(input);
  const initArgs: { profile: typeof profile; persona?: PersonaName } = {
    profile,
  };
  if (input.persona) initArgs.persona = input.persona;
  const { state, question } = initInterviewV2(initArgs);
  const sessionId = store.create(state);
  const throttler = new WsMessageThrottler(24, 12, {
    endpoint: "/api/voice",
    sessionId,
    closeSocket: (code, reason) => ws.close(code, reason),
  });
  log("v2_session_open", { sessionId, persona: state.persona.name });

  const opening = await safeSynthesize(question);
  sendJson({ type: "ready", sessionId, question });
  sendJson({ type: "next_question_audio", available: !!opening.audio });
  if (opening.audio) sendAudio(opening.audio);

  // 2) STT.
  let lastFinal = "";
  const stt = (deps.createStt ?? ((cb) => new DeepgramAdapter(cb)))({
    onTranscript: (t) => sendJson({ type: "transcript", text: t, final: false }),
    onFinalTranscript: (t) => {
      lastFinal = t;
      sendJson({ type: "transcript", text: t, final: true });
    },
    onError: (e) =>
      sendJson({
        type: "error",
        message: e instanceof Error ? e.message : "Erreur STT",
      }),
  });
  stt.start();

  const handleEndSpeech = async () => {
    const current = store.get(sessionId);
    if (!current) {
      sendJson({ type: "error", message: "Session expirée." });
      return;
    }
    const startedAt = Date.now();
    const r = nextV2Step(current, lastFinal);
    store.update(sessionId, r.updatedState);

    sendJson({
      type: "feedback_text",
      feedback: r.finished
        ? "Merci, l'entretien est terminé. Voici ton bilan."
        : "Bien reçu.",
      score: r.evaluationScore,
      question: r.question,
      signal: r.finished ? "move-on" : "deepen",
      finished: r.finished,
    });

    if (!r.finished && r.question) {
      const synth = await safeSynthesize(r.question);
      sendJson({ type: "next_question_audio", available: !!synth.audio });
      if (synth.audio) sendAudio(synth.audio);
    }

    if (r.finished && r.recommendation) {
      sendJson({
        type: "summary_v2",
        report: r.recommendation.report,
        recommendation: {
          decision: r.recommendation.decision,
          strengths: r.recommendation.strengths,
          weaknesses: r.recommendation.weaknesses,
          justification: r.recommendation.justification,
        },
      });
    }

    log("v2_turn_completed", {
      sessionId,
      turn_latency_ms: Date.now() - startedAt,
      score: r.evaluationScore,
      phase: r.updatedState.phase,
      finished: r.finished,
    });
    lastFinal = "";
  };

  ws.on("message", (data: unknown, isBinary?: boolean) => {
    if (isBinary || data instanceof Uint8Array || data instanceof ArrayBuffer) {
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
      if (data.length > 65536) {
        ws.close(1009, "Payload Too Large");
        return;
      }
      if (!throttler.consume()) {
        console.warn(`[ws-message-throttler] Control message flooding detected for Session ${sessionId}. Closing socket (1008).`);
        ws.close(1008, "Policy Violation: Message Flooding");
        return;
      }
      let msg: { type?: string } = {};
      try {
        msg = JSON.parse(data);
      } catch {
        return;
      }
      if (msg.type === "end_speech") void handleEndSpeech();
      else if (msg.type === "interrupt") sendJson({ type: "interrupted" });
    }
  });

  ws.on("close", () => {
    stt.stop();
    log("v2_session_close", { sessionId });
    store.delete(sessionId);
  });

  return sessionId;
}
