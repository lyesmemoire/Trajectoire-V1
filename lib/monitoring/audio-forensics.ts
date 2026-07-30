import * as Sentry from "@sentry/nextjs";

export function logAudioForensics(error: _Error, context: {
    sessionId: string;
    os: string;
    browser: string;
    audioState: string;
  }, ) {
  Sentry.withScope((scope) => {
    scope.setTag("system", "audio");
    scope.setTag("browser", context.browser);
    scope.setTag("os", context.os);
    scope.setExtra("audioState", context.audioState);
    scope.setExtra("sessionId", context.sessionId);
    Sentry.captureException(error);
  });
}
