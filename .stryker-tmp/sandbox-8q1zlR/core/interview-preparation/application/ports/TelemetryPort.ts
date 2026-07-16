/**
 * TelemetryPort
 *
 * Port interface for telemetry and monitoring.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY interface definition for telemetry adapter.
 */
// @ts-nocheck


export interface TelemetryPort {
  /**
   * Track metric
   * @param metricName - Metric name
   * @param value - Metric value
   * @param tags - Optional tags
   */
  trackMetric(metricName: string, value: number, tags?: Record<string, string>): void;

  /**
   * Track event
   * @param eventName - Event name
   * @param properties - Event properties
   */
  trackEvent(eventName: string, properties?: Record<string, unknown>): void;

  /**
   * Track error
   * @param error - Error to track
   * @param context - Error context
   */
  trackError(error: Error, context?: Record<string, unknown>): void;

  /**
   * Start operation timer
   * @param operationName - Operation name
   * @returns Operation timer
   */
  startTimer(operationName: string): OperationTimer;
}

export interface OperationTimer {
  stop(): number;
}
