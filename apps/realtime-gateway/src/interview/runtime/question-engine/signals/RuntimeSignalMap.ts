// runtime/question-engine/signals/RuntimeSignalMap.ts
import { SignalName } from "./SignalName";

/**
 * Immutable mapping of signal names to their current numeric values.
 * All signal values should be normalized floats in [0, 1].
 */
export type RuntimeSignalMap = Readonly<Record<SignalName, number>>;
