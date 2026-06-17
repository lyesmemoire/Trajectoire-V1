/**
 * runtime/index.ts — Façade Runtime Voice Binding (P4.2).
 * Réalise PerceptionUX en effets transport, déterministe et additif.
 */
export { type Clock, SystemClock, FakeClock } from "./clock";
export { type Rng, SeededRng } from "./rng";
export {
  type TurnPlan,
  TIMING,
  buildTurnPlan,
  estimateSpeakMs,
  interruptAtMs,
} from "./turn-timing";
export {
  type VoiceInstruction,
  type RuntimeTurnResult,
  type RunTurnInput,
  runVoiceTurn,
} from "./voice-runtime";
export {
  type VoiceSink,
  type VoiceTransportEvent,
  bindAndPlay,
} from "./transport-binding";
export {
  type WsSendBridge,
  createWsVoiceSink,
} from "./voice-sink-ws";
