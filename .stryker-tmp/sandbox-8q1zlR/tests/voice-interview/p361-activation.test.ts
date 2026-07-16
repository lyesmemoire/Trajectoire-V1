/**
 * Tests P3.6.1 — activation du moteur V2 dans le transport WebSocket.
 */
// @ts-nocheck

import { describe, it, expect } from "vitest";
import {
  handleVoiceConnectionV2Engine,
  type VoiceV2Input,
} from "@/apps/realtime-gateway/src/voice-interview/adapters/voice-websocket-v2";
import type { VoiceWsLike } from "@/apps/realtime-gateway/src/voice-interview/adapters/voice-websocket";

const STRONG =
  "Dans le cadre d'un projet client, ma mission était de réduire les délais. " +
  "J'ai conçu et déployé une architecture. Résultat : -30% en 3 mois.";

function makeMockWs() {
  const sent: unknown[] = [];
  let messageCb: ((d: unknown, b?: boolean) => void) | null = null;
  let closeCb: (() => void) | null = null;
  const ws: VoiceWsLike = {
    send: (d) => sent.push(d),
    close: () => {},
    on: (event, cb) => {
      if (event === "message") messageCb = cb as typeof messageCb;
      if (event === "close") closeCb = cb as typeof closeCb;
    },
  };
  return {
    ws,
    sent,
    emit: (d: unknown, b?: boolean) => messageCb?.(d, b),
    close: () => closeCb?.(),
  };
}

function json(sent: unknown[]): Array<Record<string, unknown>> {
  return sent
    .filter((m): m is string => typeof m === "string")
    .map((m) => JSON.parse(m) as Record<string, unknown>);
}

function mockStt(capture: (cb: (t: string) => void) => void) {
  return (cb: {
    onTranscript: (t: string) => void;
    onFinalTranscript: (t: string) => void;
    onError: (e: unknown) => void;
  }) => {
    capture(cb.onFinalTranscript);
    return {
      isConfigured: () => true,
      start: () => {},
      sendAudio: () => {},
      stop: () => {},
    } as never;
  };
}

describe("P3.6.1 — V2 engine via transport", () => {
  it("envoie 'ready' avec une question V2 issue du profil", async () => {
    const { ws, sent } = makeMockWs();
    const input: VoiceV2Input = {
      strengths: ["react", "node"],
      gaps: ["kubernetes"],
      matchScore: 70,
      targetRole: "Dev Fullstack",
      cvText: "Senior developer react node docker kubernetes",
      persona: "technical_lead",
    };
    const id = await handleVoiceConnectionV2Engine(ws, { createStt: mockStt(() => {}) }, input);
    expect(id).toMatch(/^v2_/);
    const ready = json(sent).find((m) => m.type === "ready");
    expect(ready).toBeDefined();
    expect(String(ready?.question).length).toBeGreaterThan(0);
  });

  it("traite un tour et progresse, puis émet summary_v2 à la fin", async () => {
    const { ws, sent, emit } = makeMockWs();
    let final: ((t: string) => void) | null = null;
    await handleVoiceConnectionV2Engine(
      ws,
      { createStt: mockStt((cb) => (final = cb)) },
      { strengths: ["react"], gaps: ["aws"], matchScore: 70, persona: "neutral" },
    );

    // Boucle de réponses fortes jusqu'à la fin.
    for (let i = 0; i < 30; i++) {
      final?.(STRONG);
      await emit(JSON.stringify({ type: "end_speech" }));
      await new Promise((r) => setTimeout(r, 0));
      const finishedMsg = json(sent).find(
        (m) => m.type === "feedback_text" && m.finished === true,
      );
      if (finishedMsg) break;
    }

    const summary = json(sent).find((m) => m.type === "summary_v2");
    expect(summary).toBeDefined();
    expect(summary?.report).toBeDefined();
    expect(summary?.recommendation).toBeDefined();
  });

  it("interrupt -> interrupted (barge-in conservé)", async () => {
    const { ws, sent, emit } = makeMockWs();
    await handleVoiceConnectionV2Engine(
      ws,
      { createStt: mockStt(() => {}) },
      { gaps: ["node"] },
    );
    await emit(JSON.stringify({ type: "interrupt" }));
    expect(json(sent).find((m) => m.type === "interrupted")).toBeDefined();
  });
});
