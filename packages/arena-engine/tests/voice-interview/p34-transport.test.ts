/**
 * Tests P3.4 — résilience transport : interrupt (barge-in), resume session,
 * eventId (dédup), logs structurés. Transport only, core inchangé.
 */
import { describe, it, expect } from "vitest";
import { SessionManager } from "@/apps/realtime-gateway/src/voice-interview/sessions/session-manager";
import {
  handleVoiceConnectionV2,
  type VoiceWsLike,
} from "@/apps/realtime-gateway/src/voice-interview/adapters/voice-websocket";

const STRONG =
  "Dans le cadre d'un projet client, ma mission était de réduire les délais. " +
  "J'ai mis en place une nouvelle architecture. Résultat : -30% de délai en 3 mois.";

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

function jsonMessages(sent: unknown[]): Array<Record<string, unknown>> {
  return sent
    .filter((m): m is string => typeof m === "string")
    .map((m) => JSON.parse(m) as Record<string, unknown>);
}

function mockStt(captureFinal: (cb: (t: string) => void) => void) {
  return (cb: {
    onTranscript: (t: string) => void;
    onFinalTranscript: (t: string) => void;
    onError: (e: unknown) => void;
  }) => {
    captureFinal(cb.onFinalTranscript);
    return {
      isConfigured: () => true,
      start: () => {},
      sendAudio: () => {},
      stop: () => {},
    } as never;
  };
}

describe("P3.4 — eventId & messages", () => {
  it("chaque message serveur porte un eventId unique", async () => {
    const { ws, sent } = makeMockWs();
    const sessions = new SessionManager();
    await handleVoiceConnectionV2(
      ws,
      { sessions, createStt: mockStt(() => {}) },
      { jobGap: "node" },
    );
    const msgs = jsonMessages(sent);
    const ids = msgs.map((m) => m.eventId);
    expect(ids.every((id) => typeof id === "string")).toBe(true);
    expect(new Set(ids).size).toBe(ids.length); // tous uniques
  });
});

describe("P3.4 — barge-in (interrupt)", () => {
  it("répond 'interrupted' à un event interrupt", async () => {
    const { ws, sent, emit } = makeMockWs();
    const sessions = new SessionManager();
    await handleVoiceConnectionV2(
      ws,
      { sessions, createStt: mockStt(() => {}) },
      { jobGap: "node" },
    );
    await emit(JSON.stringify({ type: "interrupt" }));
    const interrupted = jsonMessages(sent).find((m) => m.type === "interrupted");
    expect(interrupted).toBeDefined();
  });
});

describe("P3.4 — resume session", () => {
  it("reprend une session existante sans en créer une nouvelle", async () => {
    const sessions = new SessionManager();

    // 1ère connexion
    let final1: ((t: string) => void) | null = null;
    const c1 = makeMockWs();
    const id1 = await handleVoiceConnectionV2(
      c1.ws,
      { sessions, createStt: mockStt((cb) => (final1 = cb)) },
      { jobGap: "node" },
    );
    // un tour pour faire avancer l'état
    final1?.(STRONG);
    await c1.emit(JSON.stringify({ type: "end_speech" }));
    await new Promise((r) => setTimeout(r, 0));
    const turnsAfter = sessions.getSession(id1)?.currentTurn ?? 0;
    expect(turnsAfter).toBe(1);

    // coupure réseau (close) : la session doit survivre (TTL)
    c1.close();
    expect(sessions.getSession(id1)).toBeDefined();

    // reconnexion avec resume
    const c2 = makeMockWs();
    const id2 = await handleVoiceConnectionV2(
      c2.ws,
      { sessions, createStt: mockStt(() => {}) },
      { resumeSessionId: id1 },
    );
    expect(id2).toBe(id1); // même session
    expect(sessions.getSession(id1)?.currentTurn).toBe(1); // état préservé
    // ready renvoyé avec la dernière question
    const ready = jsonMessages(c2.sent).find((m) => m.type === "ready");
    expect(ready?.sessionId).toBe(id1);
  });

  it("crée une nouvelle session si le resumeSessionId est inconnu", async () => {
    const sessions = new SessionManager();
    const { ws } = makeMockWs();
    const id = await handleVoiceConnectionV2(
      ws,
      { sessions, createStt: mockStt(() => {}) },
      { resumeSessionId: "inexistant", jobGap: "node" },
    );
    expect(id).toBeTruthy();
    expect(sessions.getSession(id)).toBeDefined();
  });
});

describe("P3.4 — logs structurés", () => {
  it("émet turn_completed avec turn_latency_ms", async () => {
    const events: Array<{ event: string; fields: Record<string, unknown> }> = [];
    const sessions = new SessionManager();
    let final: ((t: string) => void) | null = null;
    const { ws, emit } = makeMockWs();
    await handleVoiceConnectionV2(
      ws,
      {
        sessions,
        createStt: mockStt((cb) => (final = cb)),
        log: (event, fields) => events.push({ event, fields }),
      },
      { jobGap: "node" },
    );
    final?.(STRONG);
    await emit(JSON.stringify({ type: "end_speech" }));
    await new Promise((r) => setTimeout(r, 0));

    const turn = events.find((e) => e.event === "turn_completed");
    expect(turn).toBeDefined();
    expect(typeof turn?.fields.turn_latency_ms).toBe("number");
    expect(turn?.fields.tts_provider_used).toBeDefined();
  });
});
