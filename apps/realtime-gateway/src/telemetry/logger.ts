import { envServer } from "../config/env.js";
import pino from "pino";

const isDev = envServer.NODE_ENV !== "production";

export const logger = pino({
  level: envServer.LOG_LEVEL || (isDev ? "debug" : "info"),
  ...(isDev
    ? {
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:standard",
            ignore: "pid,hostname",
          },
        },
      }
    : {}),
  formatters: {
    level: (label) => ({ level: label }),
  },
  base: {
    service: "realtime-gateway",
    env: envServer.NODE_ENV || "development",
  },
});

export type LogContext = {
  sessionId?: string;
  userId?: string;
  interviewId?: string;
  munitionId?: string;
  component?: string;
  duration?: number;
  [key: string]: unknown;
};

export const createChildLogger = (context: LogContext) => {
  return logger.child(context);
};

export function logInfo(
  prefix: string,
  message: string,
  context?: LogContext,
) {
  logger.info({ ...context, prefix }, message);
}

export function logWarn(
  prefix: string,
  message: string,
  context?: LogContext,
) {
  logger.warn({ ...context, prefix }, message);
}

export function logError(
  prefix: string,
  error: unknown,
  context?: LogContext,
) {
  logger.error(
    { ...context, prefix, err: error },
    error instanceof Error ? error.message : "Unknown error",
  );
}