import type { FastifyInstance } from "fastify";
import type WebSocket from "ws";

import { SessionManager } from "../sessions/manager.js";
import { logger } from "../telemetry/logger.js";
import { bus } from "../events/bus.js";

function rawToString(raw: unknown): string {
  if (typeof raw === "string") return raw;
  // ws RawData can be Buffer | ArrayBuffer | Buffer[] | string
  if (Buffer.isBuffer(raw)) return raw.toString("utf8");
  if (Array.isArray(raw)) return Buffer.concat(raw).toString("utf8");
  if (raw instanceof ArrayBuffer) return Buffer.from(raw).toString("utf8");
  // fallback
  return String(raw);
}

export async function registerSignaling(app: FastifyInstance) {
  app.get("/api/signal", { websocket: true }, (connection: unknown) => {
    // @fastify/websocket: selon versions/config, `connection` peut être le socket
    // ou un wrapper { socket }. On supporte les deux.
    const socket = (connection?.socket ?? connection) as WebSocket;

    if (!socket || typeof (socket as unknown).on !== "function") {
      logger.error({ connection }, "Invalid websocket connection object");
      return;
    }

    let initialized = false;
    let aiChunkListener: unknown;
    let aiDoneListener: unknown;
    let aiErrorListener: unknown;
    let transcriptListener: unknown;

    socket.on("error", (err) => {
      logger.error({ err }, "Signal socket error");
    });

    socket.on("message", async (raw) => {
      try {
        const text = rawToString(raw);
        const msg = JSON.parse(text);
        const { sessionId, type, payload } = msg;

        // Ping/Pong for RTT measurement
        if (type === "ping") {
          socket.send(JSON.stringify({ type: "pong", payload }));
          return;
        }

        if (!sessionId) {
          socket.send(
            JSON.stringify({ type: "error", message: "Missing sessionId" }),
          );
          return;
        }

        // Initialise session and listeners only once per socket
        if (!initialized) {
          SessionManager.instance.create(sessionId, socket);
          SessionManager.instance.touch(sessionId);

          // Transcript forwarding
          transcriptListener = (evt: unknown) => {
            if (evt.sessionId === sessionId) {
              socket.send(JSON.stringify({ type: "transcript", payload: evt }));
            }
          };
          bus.on("transcript", transcriptListener);

          // AI chunk forwarding
          aiChunkListener = (aiMsg: unknown) => {
            if (aiMsg.sessionId === sessionId) {
              socket.send(
                JSON.stringify({ type: "ai_text", payload: aiMsg.payload }),
              );
            }
          };
          bus.on("ai_chunk", aiChunkListener);

          aiDoneListener = (aiMsg: unknown) => {
            if (aiMsg.sessionId === sessionId) {
              socket.send(JSON.stringify({ type: "ai_done" }));
            }
          };
          bus.on("ai_done", aiDoneListener);

          aiErrorListener = (aiMsg: unknown) => {
            if (aiMsg.sessionId === sessionId) {
              socket.send(
                JSON.stringify({ type: "ai_error", payload: aiMsg.error }),
              );
            }
          };
          bus.on("ai_error", aiErrorListener);

          initialized = true;
        }

        // Handle signaling messages
        switch (type) {
          case "offer":
            await SessionManager.instance
              .create(sessionId, socket)
              .peer.processOffer(payload);
            break;

          case "answer":
            await SessionManager.instance
              .create(sessionId, socket)
              .peer.processAnswer(payload);
            break;

          case "candidate":
            await SessionManager.instance
              .create(sessionId, socket)
              .peer.addIceCandidate(payload);
            break;

          case "pcm":
            if (!Array.isArray(payload)) {
              socket.send(
                JSON.stringify({
                  type: "error",
                  message: "PCM payload must be number[]",
                }),
              );
              return;
            }
            SessionManager.instance
              .create(sessionId, socket)
              .deepgram?.sendPCM(Uint8Array.from(payload));
            break;

          default:
            logger.warn({ type }, "Unknown signaling message");
        }
      } catch (error) {
        logger.error({ err }, "Signal socket message handler failed");
      }
    });

    // Cleanup listeners on socket close
    socket.on("close", () => {
      logger.info("Signal socket closed");
      if (transcriptListener) bus.off("transcript", transcriptListener);
      if (aiChunkListener) bus.off("ai_chunk", aiChunkListener);
      if (aiDoneListener) bus.off("ai_done", aiDoneListener);
      if (aiErrorListener) bus.off("ai_error", aiErrorListener);
    });
  });
}