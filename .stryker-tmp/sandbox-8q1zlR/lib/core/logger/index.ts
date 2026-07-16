// @ts-nocheck
import { envServer } from "@/lib/env.server";
import pino from 'pino';

const isDev = envServer.NODE_ENV !== 'production';

const pinoLogger = pino({
  level: envServer.LOG_LEVEL || (isDev ? 'debug' : 'info'),
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

export type LogContext = Record<string, any>;

/**
 * Facade unifiée pour le logging.
 * Permet de remplacer l'implémentation sous-jacente sans toucher aux couches métiers.
 */
export const logger = {
  info: (message: string, context?: LogContext) => {
    pinoLogger.info({ ...context }, message);
  },
  warn: (message: string, context?: LogContext) => {
    pinoLogger.warn({ ...context }, message);
  },
  error: (message: string, error?: any, context?: LogContext) => {
    pinoLogger.error({ ...context, err: error }, message);
  },
  debug: (message: string, context?: LogContext) => {
    pinoLogger.debug({ ...context }, message);
  },
  audit: (action: string, context?: LogContext) => {
    pinoLogger.info({ ...context, type: 'audit', action }, `[AUDIT] ${action}`);
  },
  security: (event: string, context?: LogContext) => {
    pinoLogger.warn({ ...context, type: 'security', event }, `[SECURITY] ${event}`);
  }
};

// Compatibilité temporaire pour l'existant
export const createChildLogger = (context: LogContext) => {
  return pinoLogger.child(context);
};

export function logInfo(prefix: string, message: string, context?: LogContext) {
  logger.info(`[${prefix}] ${message}`, context);
}

export function logWarn(prefix: string, message: string, context?: LogContext) {
  logger.warn(`[${prefix}] ${message}`, context);
}

export function logError(prefix: string, error: any, context?: LogContext) {
  logger.error(`[${prefix}]`, error, context);
}
