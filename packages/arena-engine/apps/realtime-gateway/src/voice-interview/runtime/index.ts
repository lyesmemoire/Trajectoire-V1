/**
 * runtime/index.ts — Façade Runtime Voice Binding (P4.2).
 * Réalise PerceptionUX en effets transport, déterministe et additif.
 */
export { type Clock, SystemClock, FakeClock } from "./clock.js";
export { type Rng, SeededRng } from "./rng.js";
export {
  type TurnPlan,
  TIMING,
  buildTurnPlan,
  estimateSpeakMs,
  interruptAtMs,
} from "./turn-timing.js";
export {
  type VoiceInstruction,
  type RuntimeTurnResult,
  type RunTurnInput,
  runVoiceTurn,
  VoiceRuntime,
} from "./voice-runtime.js";
export {
  type VoiceSink,
  type OutboundVoiceSignal,
  type InboundVoiceEvent,
  bindAndPlay,
} from "./transport-binding.js";
export {
  type WsSendBridge,
  createWsVoiceSink,
} from "./voice-sink-ws.js";
