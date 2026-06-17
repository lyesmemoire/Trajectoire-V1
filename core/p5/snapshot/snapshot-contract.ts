import { MindState } from "../execution-contract";

/**
 * A serializable snapshot of the P5 execution state.
 *
 * - `version`: schema version, always 1 for now.
 * - `timestamp`: observability only — never influences logic.
 * - `state`: deep copy of MindState at capture time.
 */
export interface MindSnapshot {
  readonly id: string;
  readonly version: 1;
  readonly timestamp: number;
  readonly state: MindState;
}
