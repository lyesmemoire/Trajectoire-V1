import { envServer } from "@/lib/env.server";
import pino from 'pino';

const isDev = envServer.NODE_ENV !== 'production';

export const logger = pino({
  level: process.env.LOG_LEVEL || (isDev ? 'debug' : 'info'),
  ...(isDev && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname',
      },
    },
  }),
  formatters: {
    level: (label) => ({ level: label }),
  },
  base: {
    service: 'trajectoire',
    env: envServer.NODE_ENV || 'development',
  },
});

export type LogContext = {
  sessionId?: string;
  userId?: string;
  interviewId?: string;
  munitionId?: string;
  component?: string;
  duration?: number;
  [key: string]: any;
};

export const createChildLogger = (context: LogContext) => {
  return logger.child(context);
};

// Legacy compatibility wrappers
export function logInfo(prefix: string, message: string, context?: LogContext) {
  logger.info({ ...context, prefix }, message);
}

export function logWarn(prefix: string, message: string, context?: LogContext) {
  logger.warn({ ...context, prefix }, message);
}

export function logError(prefix: string, error: any, context?: LogContext) {
  logger.error({ ...context, prefix, err: error }, error?.message || "Unknown error");
}

