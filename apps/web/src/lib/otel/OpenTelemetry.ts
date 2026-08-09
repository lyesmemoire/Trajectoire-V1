/**
 * OpenTelemetry Configuration
 * Sets up distributed tracing and metrics export
 */

import { NodeSDK } from '@opentelemetry/sdk-node';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';

let sdk: NodeSDK | null = null;

export function initializeOpenTelemetry() {
  if (sdk) {
    return sdk;
  }

  const resource = new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: process.env.OTEL_SERVICE_NAME || 'trajectoire-web',
    [SemanticResourceAttributes.SERVICE_VERSION]: process.env.APP_VERSION || '1.0.0',
    [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: process.env.NODE_ENV || 'production',
  });

  const traceExporter = new OTLPTraceExporter({
    url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4317/v1/traces',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  sdk = new NodeSDK({
    resource,
    traceExporter,
    instrumentations: [new HttpInstrumentation()],
  });

  sdk.start();

  return sdk;
}

export function shutdownOpenTelemetry() {
  if (sdk) {
    return sdk.shutdown();
  }
  return Promise.resolve();
}
