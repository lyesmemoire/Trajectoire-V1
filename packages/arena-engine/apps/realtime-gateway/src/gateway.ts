import { envServer } from "../../../lib/env.server.js";
/**
 * gateway.ts — Realtime Gateway (Fastify + WebSocket)
 *
 * Architecture :
 *   - Auth via verifyToken()
 *   - Session voice via createVoiceSession()
 *   - Runtime fonctionnel (voice-interview/)
 *   - Aucune classe InterviewEngine
 */

import Fastify from "fastify";
import fastifyWebsocket from "@fastify/websocket";
import type { WebSocket } from "ws";

import { verifyVoiceToken as verifyToken } from "./server/auth.js";
import {
  createVoiceSession,
  getVoiceSession,
  removeVoiceSession,
  getActiveVoiceSessionCount,
} from "./voice-interview/sessions/session-manager.js";

// ────────────────────────────────────────────────────────────────────────────
// Fastify setup
// ────────────────────────────────────────────────────────────────────────────

const isDev = envServer.NODE_ENV !== "production";

const app = Fastify({
  logger: isDev
    ? {
        level: envServer.LOG_LEVEL ?? "info",
        transport: {
          target: "pino-pretty",
          options: { colorize: true },
        },
      }
    : {
        level: envServer.LOG_LEVEL ?? "info",
      },
});

import { attachWsIngestionShield } from "../../../lib/security/ws-ingestion-shield.js";

await attachWsIngestionShield(app);
await app.register(fastifyWebsocket, {
  options: {
    maxPayload: 65536,
  },
});

import { metrics } from "./voice-interview/metrics.js";

// ────────────────────────────────────────────────────────────────────────────
// Health endpoint
// ────────────────────────────────────────────────────────────────────────────

app.get("/health", async () => {
  const activeSessions = getActiveVoiceSessionCount();
  return {
    status: "ok",
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
    metrics: metrics.getSnapshot(activeSessions),
  };
});

// ────────────────────────────────────────────────────────────────────────────
// WebSocket endpoint
// ────────────────────────────────────────────────────────────────────────────

app.get("/ws", { websocket: true }, (socket: WebSocket) => {
  let sessionId: string | null = null;

  socket.on("error", (err: Error) => {
    app.log.error({ err, sessionId }, "WebSocket error");
  });

  socket.on("message", async (raw: Buffer) => {
    if (raw.length > 65536) {
      socket.close(1009, "Payload Too Large");
      return;
    }
    let msg: {
      type?: string;
      token?: string;
      sessionId?: string;
      transcript?: string;
      isFinal?: boolean;
    };

    try {
      msg = JSON.parse(raw.toString());
    } catch {
      socket.send(JSON.stringify({ type: "error", code: "INVALID_JSON" }));
      return;
    }

    // ──────────────────────────────────────────────────────────
    // AUTH
    // ──────────────────────────────────────────────────────────
    if (msg.type === "auth") {
      try {
        if (!msg.token || !msg.sessionId) {
          socket.send(
            JSON.stringify({ type: "error", code: "MISSING_AUTH_FIELDS" })
          );
          return;
        }

        const isTestEnv = envServer.NODE_ENV === "test";
        const bypass = isTestEnv && envServer.STRESS_TEST_BYPASS === "true" && msg.token === "stress-test-bypass";
        const payload = bypass ? null : await verifyToken(msg.token);
        if (!bypass && !payload) throw new Error("Invalid token");

        const userId = bypass ? `stress-${msg.sessionId}` : payload!.userId;

        sessionId = msg.sessionId;

        createVoiceSession(sessionId, userId, socket, {
          turnTiming: {
            silenceThresholdMs: 1500,
            maxTurnDurationMs: 30000,
          },
          maxQuestions: 10,
          sessionId,
        });

        socket.send(JSON.stringify({ type: "auth_ok", sessionId }));
      } catch (err) {
        app.log.error({ err }, "Auth failed");
        socket.send(JSON.stringify({ type: "error", code: "AUTH_FAILED" }));
        socket.close();
      }

      return;
    }

    // ──────────────────────────────────────────────────────────
    // TRANSCRIPT
    // ──────────────────────────────────────────────────────────
    if (msg.type === "transcript" && msg.isFinal) {
      if (!sessionId) {
        socket.send(
          JSON.stringify({ type: "error", code: "NOT_AUTHENTICATED" })
        );
        return;
      }

      const session = getVoiceSession(sessionId);
      if (!session) return;

      try {
        if (session.sink) {
          session.sink.dispatch({
            type: "transcript",
            text: msg.transcript ?? "",
            isFinal: true,
          });
        }
      } catch (err) {
        app.log.error({ err, sessionId }, "Transcript processing error");
        socket.send(
          JSON.stringify({ type: "error", code: "PROCESSING_ERROR" })
        );
      }

      return;
    }
  });

  socket.on("close", () => {
    if (sessionId) {
      removeVoiceSession(sessionId, "ws_close");
    }
  });
});

// ────────────────────────────────────────────────────────────────────────────
// Server start
// ────────────────────────────────────────────────────────────────────────────

const PORT = Number(envServer.PORT ?? 3001);
const HOST = envServer.HOST ?? "0.0.0.0";

try {
  await app.listen({ port: PORT, host: HOST });
  app.log.info(`Realtime Gateway listening on ${HOST}:${PORT}`);
} catch (err) {
  app.log.error(err);
  process.exit(1);
}

// ────────────────────────────────────────────────────────────────────────────
// Graceful shutdown
// ────────────────────────────────────────────────────────────────────────────

async function shutdown(signal: string): Promise<void> {
  app.log.info(`Received ${signal}, shutting down`);
  await app.close();
  process.exit(0);
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
