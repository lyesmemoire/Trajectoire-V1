// runtime/replay/graph/types.ts
export type StableHash = string & { __brand: "StableHash" };

export interface ReplaySnapshot {
  stepHash: StableHash;
  previousStepHash: StableHash;
  checksum: StableHash;
}

export type TopologicalOrder = ReadonlyArray<StableHash>;
