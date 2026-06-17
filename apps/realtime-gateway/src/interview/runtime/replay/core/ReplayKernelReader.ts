// apps/realtime-gateway/src/interview/runtime/replay/core/ReplayKernelReader.ts

import type { ReplaySnapshot } from "../../types/replay";
import type { StableHash } from "@core/types/StableHash";

export interface ReplayKernelReader {
  /**
   * Total immutable snapshot count.
   */
  getSnapshotCount(): number;

  /**
   * Returns the readonly snapshot array.
   * Never clone or mutate.
   */
  getSnapshots(): readonly ReplaySnapshot[];

  /**
   * Returns snapshot at index.
   * Throws on invalid index.
   */
  getSnapshot(index: number): ReplaySnapshot;

  /**
   * Returns latest snapshot.
   * Throws if no snapshots exist.
   */
  getLatestSnapshot(): ReplaySnapshot;

  /**
   * O(1) lookup by step hash.
   */
  getSnapshotByStepHash(hash: StableHash): ReplaySnapshot | null;
}

/**
 * Pure deterministic kernel reader.
 *
 * IMPORTANT:
 * - Stateless
 * - Immutable
 * - No mutation
 * - No cloning
 * - Referentially stable
 */
export function createReplayKernelReader(
  snapshots: readonly ReplaySnapshot[],
): ReplayKernelReader {
  const snapshotMap = new Map<StableHash, ReplaySnapshot>();

  for (const snapshot of snapshots) {
    snapshotMap.set(snapshot.stepHash as unknown as StableHash, snapshot);
  }

  function assertValidIndex(index: number): void {
    if (!Number.isInteger(index)) {
      throw new Error(
        `ReplayKernelReader: index must be an integer (received ${index})`,
      );
    }

    if (index < 0 || index >= snapshots.length) {
      throw new Error(`ReplayKernelReader: invalid snapshot index ${index}`);
    }
  }

  return {
    getSnapshotCount(): number {
      return snapshots.length;
    },

    getSnapshots(): readonly ReplaySnapshot[] {
      return snapshots;
    },

    getSnapshot(index: number): ReplaySnapshot {
      assertValidIndex(index);
      return snapshots[index]!;
    },

    getLatestSnapshot(): ReplaySnapshot {
      if (snapshots.length === 0) {
        throw new Error("ReplayKernelReader: no snapshots available");
      }
      return snapshots[snapshots.length - 1]!;
    },

    getSnapshotByStepHash(hash: StableHash): ReplaySnapshot | null {
      return snapshotMap.get(hash) ?? null;
    },
  };
}
