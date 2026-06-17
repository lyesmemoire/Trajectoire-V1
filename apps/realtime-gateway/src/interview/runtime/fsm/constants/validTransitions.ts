import { deepFreeze } from "../../utils/deepFreeze";

/**
 * Deterministic map of allowed transitions per runtime state.
 * The arrays are frozen via `deepFreeze` and declared `as const` to be
 * readonly at compile time.
 */
export const VALID_TRANSITIONS = deepFreeze({
  IDLE: ["VOICE_STARTED"] as const,
  LISTENING: ["VOICE_ENDED", "INTERRUPTION_DETECTED"] as const,
  PROCESSING: [] as const,
} as const);
