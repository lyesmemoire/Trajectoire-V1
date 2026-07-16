import { useTelemetryStore } from "../stores/telemetry.store";

export function useTelemetry() {
  const snapshot = useTelemetryStore((state) => state.snapshot);

  return {
    snapshot,
    sttLatencyMs: snapshot?.sttLatencyMs ?? null,
    llmLatencyMs: snapshot?.llmLatencyMs ?? null,
    ttsLatencyMs: snapshot?.ttsLatencyMs ?? null,
    roundTripMs: snapshot?.roundTripMs ?? null,
    wsLatencyMs: snapshot?.wsLatencyMs ?? null,
    currentPhase: snapshot?.currentPhase ?? null,
    traceId: snapshot?.traceId ?? null,
  };
}
