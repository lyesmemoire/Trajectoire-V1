/**
 * Instrumentation Decorator
 * Automatically traces decorated methods with correlation IDs and metrics
 */

import { TracingService } from './tracing.service';
import { MetricsService } from './metrics.service';

export interface InstrumentationOptions {
  name?: string;
  type?: 'graph' | 'matching' | 'search' | 'copilot' | 'dashboard' | 'api';
  attributes?: Record<string, string>;
}

export function Instrument(options: InstrumentationOptions = {}) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const tracingService = (this as any).tracingService as TracingService;
      const metricsService = (this as any).metricsService as MetricsService;

      if (!tracingService || !metricsService) {
        return originalMethod.apply(this, args);
      }

      const operationName = options.name || propertyKey;
      const operationType = options.type || 'api';

      const startTime = Date.now();

      try {
        let result;

        switch (operationType) {
          case 'graph':
            const graphId = options.attributes?.graphId || 'unknown';
            result = await tracingService.traceGraphOperation(
              graphId,
              operationName,
              async (span) => {
                metricsService.trackGraphOperation(operationName, graphId);
                return originalMethod.apply(this, args);
              },
              options.attributes,
            );
            break;

          case 'matching':
            const candidateId = options.attributes?.candidateId || 'unknown';
            const jobId = options.attributes?.jobId || 'unknown';
            result = await tracingService.traceMatchingOperation(
              candidateId,
              jobId,
              operationName,
              async (span) => {
                metricsService.trackMatchingOperation(candidateId, jobId);
                return originalMethod.apply(this, args);
              },
              options.attributes,
            );
            break;

          case 'search':
            const query = options.attributes?.query || 'unknown';
            result = await tracingService.traceSearchOperation(
              query,
              operationName,
              async (span) => {
                metricsService.trackSearchOperation(query);
                return originalMethod.apply(this, args);
              },
              options.attributes,
            );
            break;

          case 'copilot':
            const sessionId = options.attributes?.sessionId || 'unknown';
            result = await tracingService.traceCopilotOperation(
              sessionId,
              operationName,
              async (span) => {
                metricsService.trackCopilotOperation(sessionId, operationName);
                return originalMethod.apply(this, args);
              },
              options.attributes,
            );
            break;

          case 'dashboard':
            const userId = options.attributes?.userId || 'unknown';
            result = await tracingService.traceDashboardOperation(
              userId,
              operationName,
              async (span) => {
                metricsService.trackDashboardOperation(userId, operationName);
                return originalMethod.apply(this, args);
              },
              options.attributes,
            );
            break;

          default:
            result = await tracingService.traceApiOperation(
              'POST',
              operationName,
              async (span) => {
                return originalMethod.apply(this, args);
              },
              options.attributes,
            );
        }

        const duration = Date.now() - startTime;

        switch (operationType) {
          case 'graph':
            metricsService.trackGraphOperationDuration(
              operationName,
              options.attributes?.graphId || 'unknown',
              duration,
            );
            break;
          case 'matching':
            metricsService.trackMatchingOperationDuration(
              options.attributes?.candidateId || 'unknown',
              options.attributes?.jobId || 'unknown',
              duration,
            );
            break;
          case 'search':
            metricsService.trackSearchOperationDuration(
              options.attributes?.query || 'unknown',
              duration,
            );
            break;
          case 'copilot':
            metricsService.trackCopilotOperationDuration(
              options.attributes?.sessionId || 'unknown',
              operationName,
              duration,
            );
            break;
          case 'dashboard':
            metricsService.trackDashboardOperationDuration(
              options.attributes?.userId || 'unknown',
              operationName,
              duration,
            );
            break;
        }

        return result;
      } catch (error) {
        const duration = Date.now() - startTime;
        const errorObj = error as Error;
        metricsService.trackError(errorObj.name, errorObj.message);
        tracingService.recordException(errorObj);
        throw error;
      }
    };

    return descriptor;
  };
}
