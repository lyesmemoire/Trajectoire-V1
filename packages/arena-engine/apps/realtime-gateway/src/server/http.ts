import Fastify from "fastify";
import websocket from "@fastify/websocket";
import cors from "@fastify/cors";
import { pilotCommandsCount } from "../voice-interview/core/metrics.js";
import { attachWsIngestionShield } from "../../../../lib/security/ws-ingestion-shield.js";

export const createHttpServer = async () => {
  const app = Fastify({ logger: false });

  await attachWsIngestionShield(app);
  await app.register(websocket, {
    options: {
      maxPayload: 65536,
    },
  });
  await app.register(cors, {
    origin: ["http://localhost:3000"],
    credentials: true,
  });

  app.get("/healthz", async () => ({
    status: "ok",
    ts: Date.now(),
  }));

  app.get("/health/details", async () => ({
    status: "ok",
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
    pilotCommandsLast24h: pilotCommandsCount,
  }));

  return app;
};
