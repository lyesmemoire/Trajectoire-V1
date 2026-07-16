/**
 * Tests P3.2 — TTS, orchestrateur vocal, session runtime, websocket V2.
 * 100% déterministe, sans infra réelle (TTS mocké / fallback).
 */
// @ts-nocheck

import { describe, it, expect } from "vitest";
import {
  DefaultTTSAdapter,
  createSilentWav,
  type TTSProvider,
} from "@/apps/realtime-gateway/src/voice-interview/adapters/tts";
import {
  openingTurn,
  processVoiceTurn,
} from "@/apps/realtime-gateway/src/voice-interview/core/voice-orchestrator";
import { buildFeedbackText } from "@/apps/realtime-gateway/src/voice-interview/core/feedback-text";
import { evaluateTranscript } from "@/apps/realtime-gateway/src/voice-interview/core/evaluation";
import { createInitialState } from "@/apps/realtime-gateway/src/voice-interview/core/state";
import { SessionManager } from "@/apps/realtime-gateway/src/voice-interview/sessions/session-manager";
import {
  handleVoiceConnectionV2,
  type VoiceWsLike,
  type VoiceServerMessage,
} from "@/apps/realtime-gateway/src/voice-interview/adapters/voice-websocket";

const STRONG =
  "Dans le cadre d'un projet client, ma mission était de réduire les délais. " +
  "J'ai mis en place une nouvelle architecture et organisé l'équipe. " +
  "Résultat : nous avons réduit le temps de livraison de 30% en 3 mois.";

describe("TTS adapter", () => {
  it("createSilentWav produit un buffer WAV valide", () => {
    const buf = createSilentWav(100, 16000);
    expect(buf.byteLength).toBeGreaterThan(44);
    const head = new TextDecoder().decode(new Uint8Array(buf, 0, 4));
    expect(head).toBe("RIFF");
  });

  it("fallback silencieux quand aucun provider", async () => {
    const tts = new DefaultTTSAdapter();
    expect(tts.isConfigured()).toBe(false);
    const audio = await tts.synthesize("bonjour");
    expect(audio.byteLength).toBeGreaterThan(0);
  });

  it("utilise le provider quand configuré", async () => {
    const provider: TTSProvider = {
      isConfigured: () => true,
      synthesize: async () => new Uint8Array([1, 2, 3, 4]).buffer,
    };
    const tts = new DefaultTTSAdapter({ provider });
    expect(tts.isConfigured()).toBe(true);
    const audio = await tts.synthesize("x");
    expect(audio.byteLength).toBe(4);
  });

  it("retombe sur le silence si le provider crashe (jamais de throw)", async () => {
    const provider: TTSProvider = {
      isConfigured: () => true,
      synthesize: async () => {
        throw new Error("boom");
      },
    };
    const tts = new DefaultTTSAdapter({ provider });
    const audio = await tts.synthesize("x");
    expect(audio.byteLength).toBeGreaterThan(0);
  });
});

describe("voice-orchestrator", () => {
  it("openingTurn pose une question (+ fallback audio sans TTS configuré)", async () => {
    const r = await openingTurn(createInitialState({ jobGap: "node" }));
    expect(r.question.length).toBeGreaterThan(0);
    expect(r.audioFallback).toBe(true);
  });

  it("processVoiceTurn renvoie un VoiceTurnResult complet", async () => {
    const r = await processVoiceTurn(
      createInitialState({ jobGap: "architecture" }),
      STRONG,
    );
    expect(r.transcript.length).toBeGreaterThan(0);
    expect(r.score).toBeGreaterThanOrEqual(80);
    expect(r.signal).toBe("move-on");
    expect(r.nextQuestion.length).toBeGreaterThan(0);
    expect(typeof r.feedback).toBe("string");
    expect(r.state.phase).toBe("deep");
  });

  it("fournit de l'audio réel si TTS configuré", async () => {
    const provider: TTSProvider = {
      isConfigured: () => true,
      synthesize: async () => new Uint8Array([9, 9]).buffer,
    };
    const tts = new DefaultTTSAdapter({ provider });
    const r = await processVoiceTurn(createInitialState({ jobGap: "x" }), STRONG, tts);
    expect(r.audio?.byteLength).toBe(2);
    expect(r.audioFallback).toBe(false);
  });
});

describe("feedback-text", () => {
  it("move-on -> message d'avancement", () => {
    const e = evaluateTranscript(STRONG, "architecture");
    expect(buildFeedbackText("move-on", e)).toMatch(/suite/i);
  });
  it("probe -> invite à préciser", () => {
    const e = evaluateTranscript("J'ai fait des trucs.");
    expect(buildFeedbackText("probe", e).length).toBeGreaterThan(0);
  });
});

describe("SessionManager.recordTurn (P3.2)", () => {
  it("incrémente le tour, stocke audio + historique", () => {
    const mgr = new SessionManager();
    const s = mgr.createSession({ jobGap: "node" });
    expect(s.currentTurn).toBe(0);
    mgr.recordTurn(s.id, {
      state: s.state,
      transcript: "ma réponse",
      score: 70,
      question: "question suivante",
      audio: new Uint8Array([1]).buffer,
    });
    const updated = mgr.getSession(s.id)!;
    expect(updated.currentTurn).toBe(1);
    expect(updated.history).toHaveLength(1);
    expect(updated.history[0]?.score).toBe(70);
    expect(updated.lastAudioResponse?.byteLength).toBe(1);
  });
});

describe("handleVoiceConnectionV2 (transport)", () => {
  function makeMockWs() {
    const sent: unknown[] = [];
    let messageCb: ((d: unknown, b?: boolean) => void) | null = null;
    const ws: VoiceWsLike = {
      send: (d) => sent.push(d),
      close: () => {},
      on: (event, cb) => {
        if (event === "message") messageCb = cb as typeof messageCb;
      },
    };
    return { ws, sent, emit: (d: unknown, b?: boolean) => messageCb?.(d, b) };
  }

  it("envoie ready + audio d'ouverture puis traite un end_speech", async () => {
    const { ws, sent, emit } = makeMockWs();
    const sessions = new SessionManager();
    // STT mock : on déclenche un transcript final à la demande.
    let finalCb: ((t: string) => void) | null = null;
    const createStt = (cb: {
      onTranscript: (t: string) => void;
      onFinalTranscript: (t: string) => void;
      onError: (e: unknown) => void;
    }) => {
      finalCb = cb.onFinalTranscript;
      return {
        isConfigured: () => true,
        start: () => {},
        sendAudio: () => {},
        stop: () => {},
      } as never;
    };

    const id = await handleVoiceConnectionV2(
      ws,
      { sessions, createStt },
      { jobGap: "node" },
    );
    expect(id).toBeTruthy();

    // ready envoyé
    const ready = sent.find(
      (m): m is string => typeof m === "string" && m.includes('"ready"'),
    );
    expect(ready).toBeTruthy();

    // simule une réponse utilisateur finale puis end_speech
    finalCb?.(STRONG);
    await emit(JSON.stringify({ type: "end_speech" }));
    // laisse la microtask de processVoiceTurn se résoudre
    await new Promise((r) => setTimeout(r, 0));

    const feedback = sent.find(
      (m): m is string =>
        typeof m === "string" && m.includes('"feedback_text"'),
    );
    expect(feedback).toBeTruthy();
    const parsed = JSON.parse(feedback as string) as VoiceServerMessage;
    if (parsed.type === "feedback_text") {
      expect(parsed.score).toBeGreaterThanOrEqual(80);
    }
  });
});
