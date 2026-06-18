import * as Sentry from '@sentry/nextjs';

export const setSentryContext = (context: {
  sessionId?: string;
  userId?: string;
  interviewId?: string;
  component?: string;
}) => {
  Sentry.setContext('session', {
    sessionId: context.sessionId,
    userId: context.userId,
    interviewId: context.interviewId,
    component: context.component,
  });
};

export const captureError = (
  error: Error | unknown,
  context?: Record<string, any>
) => {
  Sentry.captureException(error, {
    tags: {
      component: context?.component || 'unknown',
    },
    extra: context,
  });
};
