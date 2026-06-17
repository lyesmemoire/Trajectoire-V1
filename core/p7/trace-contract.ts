/**
 * P7 Trace Contract
 * 
 * Re-exports the canonical RuntimeTrace types from the Gateway Collector.
 * P7 modules import from here to avoid direct coupling to the Gateway layer.
 */
export type { RuntimeTrace, TurnTrace } from "../../apps/realtime-gateway/src/runtime/collector/runtime-trace";
