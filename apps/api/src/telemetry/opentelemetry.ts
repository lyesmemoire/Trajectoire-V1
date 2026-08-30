import { NodeSDK } from '@opentelemetry/sdk-node';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { GraphQLInstrumentation } from '@opentelemetry/instrumentation-graphql';
import { RedisInstrumentation } from '@opentelemetry/instrumentation-redis-4';
import { PgInstrumentation } from '@opentelemetry/instrumentation-pg';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';

const traceExporter = new OTLPTraceExporter({
  url:
    process.env.OTEL_EXPORTER_OTLP_ENDPOINT ||
    process.env.JAEGER_ENDPOINT ||
    'http://localhost:4317',
});

const prometheusExporter = new PrometheusExporter({
  port: 9464,
  endpoint: '/metrics',
});

const sdk = new NodeSDK({
  traceExporter,
  metricReader: prometheusExporter,
  instrumentations: [
    new HttpInstrumentation(),
    new ExpressInstrumentation(),
    new GraphQLInstrumentation(),
    new RedisInstrumentation(),
    new PgInstrumentation(),
  ],
});

let shutdownPromise: Promise<void> | null = null;

sdk.start();

export function shutdownOpenTelemetry(): Promise<void> {
  if (!shutdownPromise) {
    shutdownPromise = sdk.shutdown();
  }

  return shutdownPromise;
}
