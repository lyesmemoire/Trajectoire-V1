// lib/monitoring.ts
// Logging structuré minimal pour production
function log(level, message, context) {
    const entry = {
        level,
        message,
        context,
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV ?? "development",
    };
    // En production, utiliser JSON structuré (lisible par Vercel Log Drains)
    if (process.env.NODE_ENV === "production") {
        console[level](JSON.stringify(entry));
    }
    else {
        // En développement, format lisible
        const ctx = context ? ` ${JSON.stringify(context)}` : "";
        console[level](`[${entry.timestamp}] [${level.toUpperCase()}] ${message}${ctx}`);
    }
}
export const logger = {
    info: (message, context) => log("info", message, context),
    warn: (message, context) => log("warn", message, context),
    error: (message, context) => log("error", message, context),
};
// Tracker d'événements critiques business
export function trackBusinessEvent(event, userId, metadata) {
    logger.info(`BUSINESS_EVENT:${event}`, { userId, ...metadata });
}
//# sourceMappingURL=monitoring.js.map