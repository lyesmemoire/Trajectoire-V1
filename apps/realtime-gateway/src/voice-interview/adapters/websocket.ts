/**
 * adapters/websocket.ts — Couche WebSocket de l'entretien vocal (P3.1).
 *
 * I/O only. Mappe une connexion client <-> une session d'entretien et orchestre :
 *   audio entrant  -> Deepgram (STT) -> transcript final -> core nextStep -> message sortant
 *
 * Découplé de l'implémentation WS concrète via l'interface `WsLike`
 * (compatible `ws` et `@fastify/websocket`). Ne dépend PAS de /product.
 */

import { SessionManager } from "../sessions/session-manager.js";
import { DeepgramAdapter } from "./deepgram.js";
import { nextStep, openingStep } from "../core/interview-engine.js";

/** Interface minimale d'un socket (évite de coupler à une lib WS précise). */
export interface WsLike {
  send(data: string): void;
  close(): void;
  on(event: "message", cb: (data: unknown) => void): void;
  on(event: "close", cb: () => void): void;
}

/** Messages serveur -> client (contrat stable, JSON). */
export type ServerMessage =
  | { type: "ready"; sessionId: string; question: string }
  | { type: "partial"; text: string }
  | {
      type: "feedback";
      question: string;
      signal: string;
      score: number;
      finished: boolean;
    }
  | { type: "error"; message: string };

export interface VoiceWebSocketDeps {
  sessions: SessionManager;
  /** Factory d'adapter STT (injectable pour les tests). */
  createStt?: (cb: {
    onTranscript: (t: string) => void;
    onFinalTranscript: (t: string) => void;
    onError: (e: unknown) => void;
  }) => DeepgramAdapter;
}

export interface HandleConnectionInput {
  jobGap?: string;
  initialQuestion?: string;
}

/**
 * Branche une connexion WebSocket sur une nouvelle session d'entretien vocal.
 * Retourne l'id de session créé.
 */
export function handleVoiceConnection(ws: _WsLike, deps: VoiceWebSocketDeps, input: HandleConnectionInput = {}, ): string {
  const send = (msg: ServerMessage) => {
    try {
      ws.send(JSON.stringify(msg));
    } catch {
      /* socket fermé */
    }
  };

  // 1) Crée la session + question d'ouverture (déterministe).
  const createInput: { jobGap?: string; initialQuestion?: string } = {};
  if (input.jobGap !== undefined) createInput.jobGap = input.jobGap;
  if (input.initialQuestion !== undefined)
    createInput.initialQuestion = input.initialQuestion;
  const session = deps.sessions.createSession(createInput);
  const opening = openingStep(session.state);
  deps.sessions.updateSession(session.id, opening.updatedState);
  send({ type: "ready", sessionId: session.id, question: opening.question });

  // 2) Prépare l'adapter STT.
  const stt = (deps.createStt ?? defaultStt)({
    onTranscript: (t) => send({ type: "partial", text: t }),
    onFinalTranscript: (transcript) => {
      const current = deps.sessions.getSession(session.id);
      if (!current) {
        send({ type: "error", message: "Session expirée." });
        return;
      }
      const step = nextStep(current.state, transcript);
      deps.sessions.updateSession(session.id, step.updatedState);
      send({
        type: "feedback",
        question: step.nextQuestion,
        signal: step.feedbackSignal,
        score: step.evaluation.score,
        finished: step.finished,
      });
    },
    onError: (e) =>
      send({
        type: "error",
        message: e instanceof Error ? e.message : "Erreur STT",
      }),
  });
  stt.start();

  // 3) Route les messages entrants (audio binaire) vers le STT.
  ws.on("message", (data: unknown) => {
    if (data instanceof Uint8Array) {
      stt.sendAudio(data);
    } else if (data && typeof (data as ArrayBuffer).byteLength === "number") {
      stt.sendAudio(new Uint8Array(data as ArrayBuffer));
    }
  });

  ws.on("close", () => {
    stt.stop();
    deps.sessions.deleteSession(session.id);
  });

  return session.id;
}

function defaultStt(cb: {
  onTranscript: (t: string) => void;
  onFinalTranscript: (t: string) => void;
  onError: (e: unknown) => void;
}): DeepgramAdapter {
  return new DeepgramAdapter(cb);
}
