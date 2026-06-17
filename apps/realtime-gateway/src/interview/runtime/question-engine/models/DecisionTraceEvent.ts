// runtime/question-engine/models/DecisionTraceEvent.ts
import type { SemanticVersion } from "../../types/semantic-version";
import type { SelectorName } from "./SelectorName";

export interface DecisionTraceEvent {
  /** Identifier of the selector that produced this event */
  selector: SelectorName;
  /** The chosen value (e.g., objective name, difficulty level) */
  chosen: string;
  /** Alternatives that were evaluated but not selected */
  rejected?: string[];
  /** Human‑readable reasons for the decision */
  reasons: string[];
  /** Timestamp in epoch ms relative to interview start */
  timestamp: number;
  /** Version of the selector implementation used */
  selectorVersion: SemanticVersion;
}
