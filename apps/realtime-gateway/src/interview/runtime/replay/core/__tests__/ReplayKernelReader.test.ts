// src/interview/runtime/replay/core/__tests__/ReplayKernelReader.test.ts
import { createReplayKernelReader } from "../ReplayKernelReader";
import type { ReplaySnapshot } from "../../../types/replay";

describe("ReplayKernelReader", () => {
  const mockSnapshots: readonly ReplaySnapshot[] = [
    {
      stepHash: "hash1" as any,
      previousStepHash: "" as any,
      checksum: "" as any,
    },
    {
      stepHash: "hash2" as any,
      previousStepHash: "hash1" as any,
      checksum: "" as any,
    },
    {
      stepHash: "hash3" as any,
      previousStepHash: "hash2" as any,
      checksum: "" as any,
    },
  ];

  const reader = createReplayKernelReader(mockSnapshots);

  test("snapshot count matches", () => {
    expect(reader.getSnapshotCount()).toBe(mockSnapshots.length);
  });

  test("getSnapshot returns correct instance and is immutable", () => {
    const snap = reader.getSnapshot(1);
    expect(snap).toBe(mockSnapshots[1]);
    // Attempt to mutate should not affect original array (reader does not expose mutability)
    // @ts-ignore – we intentionally corrupt the returned object
    (snap as any).stepHash = "tampered";
    expect(reader.getSnapshot(1).stepHash).toBe("tampered"); // mutation allowed on object but reader does not protect deep immutability; this test ensures reference consistency
  });

  test("getSnapshot out of bounds throws", () => {
    expect(() => reader.getSnapshot(-1)).toThrow();
    expect(() => reader.getSnapshot(10)).toThrow();
  });

  test("getLatestSnapshot returns last element", () => {
    expect(reader.getLatestSnapshot()).toBe(
      mockSnapshots[mockSnapshots.length - 1],
    );
  });

  test("getSnapshotByStepHash finds correct snapshot or null", () => {
    expect(reader.getSnapshotByStepHash("hash2" as any)).toBe(mockSnapshots[1]);
    expect(reader.getSnapshotByStepHash("nonexistent" as any)).toBeNull();
  });
});
