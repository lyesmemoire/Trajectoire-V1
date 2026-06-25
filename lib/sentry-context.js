import * as Sentry from '@sentry/nextjs';
export const setSentryContext = (context) => {
    Sentry.setContext('session', {
        sessionId: context.sessionId,
        userId: context.userId,
        interviewId: context.interviewId,
        component: context.component,
    });
};
export const captureError = (error, context) => {
    Sentry.captureException(error, {
        tags: {
            component: context?.component || 'unknown',
        },
        extra: context,
    });
};
//# sourceMappingURL=sentry-context.js.map