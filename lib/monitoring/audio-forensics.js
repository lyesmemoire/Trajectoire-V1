import * as Sentry from "@sentry/nextjs";
export function logAudioForensics(error, context) {
    Sentry.withScope((scope) => {
        scope.setTag("system", "audio");
        scope.setTag("browser", context.browser);
        scope.setTag("os", context.os);
        scope.setExtra("audioState", context.audioState);
        scope.setExtra("sessionId", context.sessionId);
        Sentry.captureException(error);
    });
}
//# sourceMappingURL=audio-forensics.js.map