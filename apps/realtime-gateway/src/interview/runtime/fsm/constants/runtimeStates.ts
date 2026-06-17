// src/interview/runtime/fsm/constants/runtimeStates.ts

import { deepFreeze } from "../../utils/deepFreeze";

/** All possible runtime states – deep frozen for immutability */
export const RUNTIME_STATES = deepFreeze({
  IDLE: "IDLE",
  LISTENING: "LISTENING",
  PROCESSING: "PROCESSING",
  TERMINATED: "TERMINATED",
});
