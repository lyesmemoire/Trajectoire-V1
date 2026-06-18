type LogLevel = "INFO" | "WARN" | "ERROR";

interface LogContext {
  requestId?: string;
  userId?: string;
  route?: string;
  [key: string]: any;
}

function formatLog(
  level: LogLevel,
  prefix: string,
  message: string,
  context?: LogContext
) {
  return {
    level,
    prefix,
    message,
    context: context || {},
    timestamp: new Date().toISOString(),
  };
}

export function logInfo(prefix: string, message: string, context?: LogContext) {
  console.log(formatLog("INFO", prefix, message, context));
}

export function logWarn(prefix: string, message: string, context?: LogContext) {
  console.warn(formatLog("WARN", prefix, message, context));
}

export function logError(
  prefix: string,
  error: any,
  context?: LogContext
) {
  console.error(
    formatLog("ERROR", prefix, error?.message || "Unknown error", {
      ...context,
      stack:
        process.env.NODE_ENV === "development"
          ? error?.stack
          : undefined,
    })
  );
}

export const logger = {
  info: logInfo,
  warn: logWarn,
  error: logError,
  child: (context?: any) => logger,
};
