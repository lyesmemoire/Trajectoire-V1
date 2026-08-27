import Fastify from "fastify";
import websocket from "@fastify/websocket";
import cors from "@fastify/cors";
import { pilotCommandsCount } from "../voice-interview/core/metrics.js";
import { envServer } from "../config/env.js";

export const createHttpServer = async () => {
  const app = Fastify({ logger: false });

  await app.register(websocket);

  const allowedOrigins =
    envServer.ALLOWED_ORIGINS
      ?.split(",")
      .map((origin) => origin.trim())
      .filter(Boolean) ??
    (envServer.NODE_ENV === "production"
      ? []
      : ["http://localhost:3000"]);

  if (envServer.NODE_ENV === "production" && allowedOrigins.length === 0) {
    throw new Error("ALLOWED_ORIGINS is required in production");
  }

  await app.register(cors, {
    origin: allowedOrigins,
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
