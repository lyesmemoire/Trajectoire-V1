// runtime/types/replay.ts
/**
 * Types used for replay checkpoints and state restoration.
 */
export interface ReplayCheckpoint {
  /** Sequential step number in the replay */
  step: number;
  /** PRNG state snapshot */
  rngState: number;
  /** Hash of the runtime state after this step */
  stateHash: string;
  /** Unix timestamp (ms) when the checkpoint was created */
  timestamp: number;
}

export type { ReplaySnapshot } from "../replay/graph/types";
