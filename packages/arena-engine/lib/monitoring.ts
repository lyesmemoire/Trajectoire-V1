// lib/monitoring.ts
// Logging structuré minimal pour production

type LogLevel = "info" | "warn" | "error";

interface LogEntry {
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
  timestamp: string;
  environment: string;
}

function log(
  level: LogLevel,
  message: string,
  context?: Record<string, unknown>,
) {
  const entry: LogEntry = {
    level,
    message,
    context,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV ?? "development",
  };

  // En production, utiliser JSON structuré (lisible par Vercel Log Drains)
  if (process.env.NODE_ENV === "production") {
    console[level](JSON.stringify(entry));
  } else {
    // En développement, format lisible
    const ctx = context ? ` ${JSON.stringify(context)}` : "";
    console[level](
      `[${entry.timestamp}] [${level.toUpperCase()}] ${message}${ctx}`,
    );
  }
}

export const logger = {
  info: (message: string, context?: Record<string, unknown>) =>
    log("info", message, context),
  warn: (message: string, context?: Record<string, unknown>) =>
    log("warn", message, context),
  error: (message: string, context?: Record<string, unknown>) =>
    log("error", message, context),
};

// Tracker d'événements critiques business
export function trackBusinessEvent(
  event:
    | "signup"
    | "cv_upload"
    | "ats_run"
    | "credit_purchase"
    | "optimize"
    | "interview",
  userId: string,
  metadata?: Record<string, unknown>,
) {
  logger.info(`BUSINESS_EVENT:${event}`, { userId, ...metadata });
}
