/**
 * server/ws.voice.ts — Route WebSocket de l'entretien vocal (P3.3).
 *
 * TRANSPORT UNIQUEMENT. Aucune logique métier ici :
 *   connect   -> crée session + branche l'adapter voice-websocket
 *   message   -> transmis par l'adapter (audio binaire / contrôle JSON)
 *   disconnect-> cleanup (géré par l'adapter via ws.on("close"))
 *
 * Branche P3.2 `handleVoiceConnectionV2` + le système TTS P3.3.
 */

import type { FastifyInstance } from "fastify";
import { SessionManager } from "../voice-interview/sessions/session-manager.js";
import {
  handleVoiceConnectionV2,
  type VoiceWsLike,
} from "../voice-interview/adapters/voice-websocket.js";
import { ChainTTSAdapter } from "../voice-interview/adapters/tts/index.js";
import { handleVoiceConnectionV2Engine } from "../voice-interview/adapters/voice-websocket-v2.js";
import type { PersonaName } from "../voice-interview/core/v2/personas.js";
import { verifyVoiceToken } from "./auth.js";
import { reserveCredit } from "../voice-interview/billing/usage-service.js";
import { interviewRepository } from "../voice-interview/persistence/singleton.js";
import { handleVoiceConnectionV3 } from "../voice-interview/adapters/voice-websocket-v3.js";
import { metricsStore } from "../monitoring/metrics-store.js";

/** Session manager partagé (in-memory + TTL), unique par process. */
const sessions = new SessionManager();

const MAX_SESSIONS = parseInt(process.env.MAX_SESSIONS || "75", 10);

/** Adapte un socket `ws` (Fastify/ws) vers l'interface VoiceWsLike. */
function adaptSocket(raw: {
  send: (data: unknown) => void;
  close: () => void;
  on: (event: string, cb: (...args: unknown[]) => void) => void;
}): VoiceWsLike {
  return {
    send: (data) => raw.send(data),
    close: () => raw.close(),
    on: (event: "message" | "close", cb: (d: unknown, b?: boolean) => void) => {
      if (event === "close") {
        raw.on("close", () => cb(undefined));
        return;
      }
      // ws v8 : (data: Buffer, isBinary: boolean)
      raw.on("message", (data: unknown, isBinary: unknown) => {
        if (typeof data === "string") {
          cb(data, false);
        } else if (data instanceof Buffer) {
          // Texte (contrôle JSON) vs binaire (audio)
          if (isBinary) cb(new Uint8Array(data), true);
          else cb(data.toString("utf8"), false);
        } else {
          cb(data, !!isBinary);
        }
      });
    },
  };
}

/**
 * Enregistre la route `/api/voice` sur l'instance Fastify.
 * Query params optionnels : ?gap=...&question=...
 */
export async function registerVoiceWs(app: FastifyInstance): Promise<void> {
  app.get(
    "/api/voice",
    { websocket: true },
    async (connection: unknown, req: unknown) => {
      // @fastify/websocket v11 : `connection` est le socket ; versions
      // antérieures : `{ socket }`. On gère les deux de façon défensive.
      const c = connection as { socket?: unknown };
      const rawSocket = (c && c.socket ? c.socket : connection) as Parameters<
        typeof adaptSocket
      >[0];

      const ws = adaptSocket(rawSocket);

      const INACTIVITY_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes
      let inactivityTimer: NodeJS.Timeout;

      function resetInactivityTimer() {
        clearTimeout(inactivityTimer);
        inactivityTimer = setTimeout(() => {
          if (process.env.VOICE_DEBUG === "true") {
             
            console.log(
              JSON.stringify({
                ts: Date.now(),
                event: "session_timeout",
              }),
            );
          }
          ws.close();
        }, INACTIVITY_TIMEOUT_MS);
      }

      // Start timer immediately
      resetInactivityTimer();

      ws.on("message", () => {
        resetInactivityTimer();
      });

      ws.on("close", () => {
        clearTimeout(inactivityTimer);
      });

      const query =
        ((req as { query?: Record<string, string> } | undefined)?.query) ?? {};

      const token = typeof query.token === "string" ? query.token : undefined;
      const auth = await verifyVoiceToken(token);

      if (!auth) {
        rawSocket.send(
          JSON.stringify({ type: "error", message: "Unauthorized" })
        );
        rawSocket.close();
        return;
      }

      // Check session limit before creating session
      if (sessions.size() >= MAX_SESSIONS) {
        metricsStore.rejectedConnections++;
        rawSocket.send(
          JSON.stringify({ type: "error", message: "Server overloaded. Try again later." })
        );
        rawSocket.close();
        return;
      }

      // Generate sessionId for credit reservation
      const sessionId = `vis_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 9)}`;

      // Reserve credit (2-phase commit: reserve → commit/rollback)
      const reserved = await reserveCredit(auth.userId, sessionId);

      if (!reserved) {
        rawSocket.send(
          JSON.stringify({
            type: "error",
            message: "Monthly quota exceeded. Upgrade your plan.",
          }),
        );
        rawSocket.close();
        return;
      }

      const tts = new ChainTTSAdapter();

      const input: {
        jobGap?: string;
        initialQuestion?: string;
        resumeSessionId?: string;
        userId?: string;
        targetRole?: string;
        sessionId?: string;
      } = {};
      if (typeof query.gap === "string") input.jobGap = query.gap;
      if (typeof query.question === "string")
        input.initialQuestion = query.question;
      if (typeof query.resume === "string") input.resumeSessionId = query.resume;
      if (typeof query.role === "string") input.targetRole = query.role;
      if (auth?.userId) input.userId = auth.userId;
      input.sessionId = sessionId;

      // Logs structurés légers (observabilité, pas d'infra).
      const log = (event: string, fields: Record<string, unknown>) => {
        if (process.env.VOICE_DEBUG === "true") {
           
          console.log(JSON.stringify({ ts: Date.now(), event, ...fields }));
        }
      };

      // Sélecteur de moteur (opt-in) : ?engine=v3 -> LLM-Driven Contextual Engine
      // Par défaut -> moteur V1 (P3.2→P3.5), zéro régression.
      if (query.engine === "v3" && query.sessionId) {
        // Fetch context from DB
        const record = await interviewRepository.get(query.sessionId as string);
        if (!record || !record.interview_context) {
          ws.close();
          return;
        }

        const v3Input: any = {
          sessionId: query.sessionId as string,
          context: record.interview_context as any
        };
        if (input.userId) v3Input.userId = input.userId;
        if (record.targetRole || input.targetRole) v3Input.targetRole = record.targetRole ?? input.targetRole;

        await handleVoiceConnectionV3(ws, v3Input, { sessions, log, tts });
      } else if (query.engine === "v2") {
        const v2Input: {
          strengths?: string[];
          gaps?: string[];
          matchScore?: number;
          targetRole?: string;
          cvText?: string;
          jobText?: string;
          persona?: PersonaName;
        } = {};
        if (typeof query.gap === "string") v2Input.gaps = [query.gap];
        if (typeof query.strengths === "string")
          v2Input.strengths = query.strengths.split(",").map((s) => s.trim());
        if (typeof query.score === "string") {
          const n = Number(query.score);
          if (!Number.isNaN(n)) v2Input.matchScore = n;
        }
        if (typeof query.role === "string") v2Input.targetRole = query.role;
        if (typeof query.cv === "string") v2Input.cvText = query.cv;
        if (typeof query.job === "string") v2Input.jobText = query.job;
        if (typeof query.persona === "string")
          v2Input.persona = query.persona as PersonaName;
        void handleVoiceConnectionV2Engine(ws, { tts, log }, v2Input);
        return;
      }

      // Délégation complète à l'adapter V1 (lifecycle + cleanup interne).
      void handleVoiceConnectionV2(ws, { sessions, tts, log }, input);
    },
  );
}
