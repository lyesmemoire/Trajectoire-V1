import { deepFreeze } from "../../utils/deepFreeze";
import { hashObjectStable } from "../../utils/hash";
import type { StableHash } from "../types/stableHash";
import type { SelectorResultEnvelope, SelectorTraceEvent } from "./SelectorResultEnvelope";
import type { ConfidenceScore } from "../../types/ConfidenceScore";

export interface BuildEnvelopeArgs<T> {
  selectorName: string;
  selectorVersion: string;
  rawResult: T;
  confidence: ConfidenceScore;
  inputHash: StableHash;
  metrics: {
    durationMs: number;
    candidateCount?: number;
    policyCount?: number;
  };
  traceEvents: readonly SelectorTraceEvent[];
}

export function buildSelectorEnvelope<T>(
  args: BuildEnvelopeArgs<T>
): SelectorResultEnvelope<T> {
  // 1. Freeze the raw value before hashing (Rule 2)
  const frozenValue = deepFreeze(args.rawResult);
  
  // 2. Hash the frozen value
  const outputHash = hashObjectStable(frozenValue) as unknown as StableHash;

  // 3. Build deterministic replay key WITHOUT telemetry (Rule 3 & 10)
  const deterministicReplayKey = hashObjectStable({
    selectorName: args.selectorName,
    selectorVersion: args.selectorVersion,
    inputHash: args.inputHash,
    outputHash,
  }) as unknown as StableHash;

  // 4. Migration guards (Rule 8)
  if (process.env.NODE_ENV !== "production") {
    assertFrozen(frozenValue);
    assertStableHash(outputHash);
  }

  // 5. Build envelope
  const envelope: SelectorResultEnvelope<T> = {
    value: frozenValue,
    confidence: args.confidence,
    selectorName: args.selectorName,
    selectorVersion: args.selectorVersion,
    inputHash: args.inputHash,
    outputHash,
    deterministicReplayKey,
    executionMetrics: deepFreeze({ ...args.metrics }),
    // Trace arrays must be immutable (Rule 4)
    traceEvents: deepFreeze([...args.traceEvents]),
  };

  return deepFreeze(envelope);
}

function assertFrozen(obj: any) {
  if (obj && typeof obj === "object" && !Object.isFrozen(obj)) {
    throw new Error("Migration Guard: Object is not frozen before hashing.");
  }
}

function assertStableHash(hash: any) {
  if (!hash || typeof hash !== "string") {
    throw new Error("Migration Guard: Output hash is invalid.");
  }
}
