// runtime/question-engine/signals/SignalRegistry.ts
import { SignalName } from "./SignalName";
import { RuntimeSignalMap } from "./RuntimeSignalMap";
import { deepFreeze } from "@core/freeze/deepFreeze";

/**
 * Immutable registry for all conversational signals.
 * Replaces unstructured ad-hoc context fields to maintain determinism
 * and structured tracing across the pipeline.
 */
export class SignalRegistry {
  public readonly version = "1.0.0" as const;
  private readonly map: RuntimeSignalMap;

  private constructor(initialMap: Partial<Record<SignalName, number>>) {
    // Default all known signals to 0 to guarantee schema stability and exact hashing.
    this.map = deepFreeze({
      fatigue: initialMap.fatigue ?? 0,
      contradiction: initialMap.contradiction ?? 0,
      hesitation: initialMap.hesitation ?? 0,
      novelty: initialMap.novelty ?? 0,
      topic_saturation: initialMap.topic_saturation ?? 0,
      confidence: initialMap.confidence ?? 0,
      communication_inconsistency: initialMap.communication_inconsistency ?? 0,
    });
  }

  /** Retrieve the current deterministic value of a signal. */
  public get(name: SignalName): number {
    return this.map[name];
  }

  /**
   * Return a new purely immutable instance of the registry with the updated signal.
   */
  public withSignal(name: SignalName, value: number): SignalRegistry {
    return new SignalRegistry({ ...this.map, [name]: value });
  }

  /** Create an empty registry. */
  public static createEmpty(): SignalRegistry {
    return new SignalRegistry({});
  }

  /** Export the current internal state deterministically for snapshotting/hashing. */
  public toMap(): RuntimeSignalMap {
    return this.map;
  }
}
