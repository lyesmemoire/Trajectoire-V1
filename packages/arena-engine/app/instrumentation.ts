// server-only guard for instrumentation
import "server-only";
import { NodeTracerProvider } from "@opentelemetry/sdk-trace-node";
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-base";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { HttpInstrumentation } from "@opentelemetry/instrumentation-http";
import { Resource } from "@opentelemetry/resources";
import { diag, DiagConsoleLogger, DiagLogLevel } from "@opentelemetry/api";

// Setup diagnostics (silently ignore in prod)
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.ERROR);

function parseHeaders(headerString?: string): Record<string, string> {
  if (!headerString) return {};
  return headerString.split(",").reduce(
    (acc, pair) => {
      const [key, value] = pair.split("=");
      if (key && value) acc[key.trim()] = value.trim();
      return acc;
    },
    {} as Record<string, string>,
  );
}

const exporter = new OTLPTraceExporter({
  url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT,
  headers: parseHeaders(process.env.OTEL_EXPORTER_OTLP_HEADERS),
});

const provider = new NodeTracerProvider({
  resource: new Resource({
    "service.name": "studioentretien",
  }),
});
provider.addSpanProcessor(new BatchSpanProcessor(exporter));
provider.register();

registerInstrumentations({
  instrumentations: [new HttpInstrumentation()],
});

export const tracer = provider.getTracer("studioentretien");
