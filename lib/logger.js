import { envServer } from "../lib/env.server.js";
import pino from 'pino';
const isDev = envServer.NODE_ENV !== 'production';
export const logger = pino({
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
export const createChildLogger = (context) => {
    return logger.child(context);
};
// Legacy compatibility wrappers
export function logInfo(prefix, message, context) {
    logger.info({ ...context, prefix }, message);
}
export function logWarn(prefix, message, context) {
    logger.warn({ ...context, prefix }, message);
}
export function logError(prefix, error, context) {
    logger.error({ ...context, prefix, err: error }, error?.message || "Unknown error");
}
//# sourceMappingURL=logger.js.map