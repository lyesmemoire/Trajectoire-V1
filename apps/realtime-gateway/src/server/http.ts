import Fastify from "fastify";
import websocket from "@fastify/websocket";
import cors from "@fastify/cors";
import { pilotCommandsCount } from "../voice-interview/core/metrics.js";
import { metricsStore } from "../monitoring/metrics-store.js";
import { getActiveVoiceSessionCount } from "../voice-interview/sessions/session-manager.js";

export const createHttpServer = async () => {
  const app = Fastify({ logger: false });

  await app.register(websocket);
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

  app.get("/internal/metrics", async () => {
    const memoryUsageMB = Math.round(
      process.memoryUsage().rss / 1024 / 1024
    );

    const uptimeSec = Math.round(process.uptime());

    const activeSessions = getActiveVoiceSessionCount();

    return {
      uptimeSec,
      activeSessions,
      avgPipelineMs: metricsStore.avgPipelineMs,
      maxPipelineMs: metricsStore.maxPipelineMs,
      memoryUsageMB,
      errorCount: metricsStore.errorCount,
      rejectedConnections: metricsStore.rejectedConnections,
      slowTtsCount: metricsStore.slowTtsCount
    };
  });

  return app;
};
