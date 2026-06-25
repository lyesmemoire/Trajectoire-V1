import pino from "pino";

const isDevelopment = process.env.NODE_ENV === "development";

export const logger = pino({
  level: isDevelopment ? "debug" : "info",
  transport: isDevelopment
    ? {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "HH:MM:ss Z",
          ignore: "pid,hostname",
        },
      }
    : undefined,
  formatters: {
    level: (label) => {
      return { level: label };
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  serializers: {
    err: pino.stdSerializers.err,
    error: pino.stdSerializers.err,
  },
});

export type LogContext = {
  sessionId?: string;
  userId?: string;
  interviewId?: string;
  component?: string;
  [key: string]: any;
};

export function createLogger(context: LogContext = {}) {
  return logger.child(context);
}

export function createSessionLogger(sessionId: string, component?: string) {
  return createLogger({ sessionId, component });
}

export function createUserLogger(userId: string, component?: string) {
  return createLogger({ userId, component });
}

export function createInterviewLogger(interviewId: string, component?: string) {
  return createLogger({ interviewId, component });
}

export default logger;
