import { envServer } from "../../../../lib/env.server.js";
import pino from "pino";

const isDev = envServer.NODE_ENV !== "production";

export const logger = pino({
  level: envServer.LOG_LEVEL || "info",
  ...(isDev ? { transport: { target: "pino-pretty", options: { colorize: true } } } : {}),
});
