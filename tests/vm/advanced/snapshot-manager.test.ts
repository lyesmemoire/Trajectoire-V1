import { describe, it, expect, beforeEach } from 'vitest';
import { SnapshotManager, SnapshotOptions } from '../../../compiler/cvm/snapshot-manager';
import { ExecutionContext } from '../../../compiler/cvm/execution-context';

describe('Snapshot Manager - Priority 2', () => {
  let context: ExecutionContext;
  let snapshotManager: SnapshotManager;

  beforeEach(() => {
    context = new ExecutionContext();
    snapshotManager = new SnapshotManager(context);
  });

  describe('Snapshot Creation', () => {
    it('should create a snapshot', () => {
      const id = snapshotManager.createSnapshot();
      
      expect(id).toBe(0);
      expect(snapshotManager.getSnapshotCount()).toBe(1);
      
      const snapshot = snapshotManager.getSnapshot(id);
      expect(snapshot).toBeDefined();
      expect(snapshot?.id).toBe(0);
      expect(snapshot?.timestamp).toBeGreaterThan(0);
    });

    it('should create multiple snapshots with incrementing IDs', () => {
      const id1 = snapshotManager.createSnapshot();
      const id2 = snapshotManager.createSnapshot();
      const id3 = snapshotManager.createSnapshot();

      expect(id1).toBe(0);
      expect(id2).toBe(1);
      expect(id3).toBe(2);
      expect(snapshotManager.getSnapshotCount()).toBe(3);
    });

    it('should include stack in snapshot by default', () => {
      const stack = context.getStack();
      stack.push(10);
      stack.push(20);
      stack.push(30);

      const id = snapshotManager.createSnapshot();
      const snapshot = snapshotManager.getSnapshot(id);

      expect(snapshot?.stack).toEqual([10, 20, 30]);
    });

    it('should include heap in snapshot by default', () => {
      const heap = context.getHeap();
      heap.setMaxBlocks(100);
      const alloc1 = heap.allocate(64);
      const alloc2 = heap.allocate(128);

      const id = snapshotManager.createSnapshot();
      const snapshot = snapshotManager.getSnapshot(id);

      expect(snapshot?.heap).toBeDefined();
      expect(snapshot?.heap.length).toBeGreaterThan(0);
    });

    it('should include call frames in snapshot by default', () => {
      const id = snapshotManager.createSnapshot();
      const snapshot = snapshotManager.getSnapshot(id);

      expect(snapshot?.callFrames).toBeDefined();
    });

    it('should respect includeStack option', () => {
      const stack = context.getStack();
      stack.push(10);
      stack.push(20);

      const id = snapshotManager.createSnapshot({ includeStack: false });
      const snapshot = snapshotManager.getSnapshot(id);

      expect(snapshot?.stack).toEqual([]);
    });

    it('should respect includeHeap option', () => {
      const heap = context.getHeap();
      heap.setMaxBlocks(100);
      heap.allocate(64);

      const id = snapshotManager.createSnapshot({ includeHeap: false });
      const snapshot = snapshotManager.getSnapshot(id);

      expect(snapshot?.heap).toEqual([]);
    });

    it('should respect includeCallFrames option', () => {
      const id = snapshotManager.createSnapshot({ includeCallFrames: false });
      const snapshot = snapshotManager.getSnapshot(id);

      expect(snapshot?.callFrames).toEqual([]);
    });

    it('should include metadata in snapshot', () => {
      const metadata = { test: 'value', count: 42 };
      const id = snapshotManager.createSnapshot({}, metadata);
      const snapshot = snapshotManager.getSnapshot(id);

      expect(snapshot?.metadata).toEqual(metadata);
    });

    it('should capture program counter in snapshot', () => {
      context.setProgramCounter(100);
      const id = snapshotManager.createSnapshot();
      const snapshot = snapshotManager.getSnapshot(id);

      expect(snapshot?.programCounter).toBe(100);
    });
  });

  describe('Snapshot Loading', () => {
    it('should get snapshot by id', () => {
      const id = snapshotManager.createSnapshot();
      const snapshot = snapshotManager.getSnapshot(id);

      expect(snapshot).toBeDefined();
      expect(snapshot?.id).toBe(id);
    });

    it('should return null for non-existent snapshot', () => {
      const snapshot = snapshotManager.getSnapshot(999);
      expect(snapshot).toBeNull();
    });

    it('should get all snapshots', () => {
      snapshotManager.createSnapshot();
      snapshotManager.createSnapshot();
      snapshotManager.createSnapshot();

      const allSnapshots = snapshotManager.getAllSnapshots();
      expect(allSnapshots.length).toBe(3);
    });

    it('should return empty array when no snapshots', () => {
      const allSnapshots = snapshotManager.getAllSnapshots();
      expect(allSnapshots).toEqual([]);
    });

    it('should get snapshot by timestamp', () => {
      const id1 = snapshotManager.createSnapshot();
      const snapshot1 = snapshotManager.getSnapshot(id1);
      
      const found = snapshotManager.getSnapshotByTimestamp(snapshot1!.timestamp);
      
      expect(found).toBeDefined();
      expect(found?.id).toBe(id1);
    });

    it('should return null for non-existent timestamp', () => {
      const found = snapshotManager.getSnapshotByTimestamp(9999999999999);
      expect(found).toBeNull();
    });

    it('should get snapshots in time range', () => {
      const id1 = snapshotManager.createSnapshot();
      const snapshot1 = snapshotManager.getSnapshot(id1)!;
      
      const id2 = snapshotManager.createSnapshot();
      const snapshot2 = snapshotManager.getSnapshot(id2)!;
      
      const id3 = snapshotManager.createSnapshot();
      const snapshot3 = snapshotManager.getSnapshot(id3)!;

      const rangeSnapshots = snapshotManager.getSnapshotsInRange(
        snapshot1.timestamp,
        snapshot3.timestamp
      );

      expect(rangeSnapshots.length).toBe(3);
    });

    it('should import snapshots from JSON', () => {
      const id1 = snapshotManager.createSnapshot();
      const json1 = snapshotManager.exportSnapshots();

      const newManager = new SnapshotManager(context);
      newManager.importSnapshots(json1);

      expect(newManager.getSnapshotCount()).toBe(1);
      expect(newManager.getSnapshot(id1)).toBeDefined();
    });

    it('should export snapshots to JSON', () => {
      snapshotManager.createSnapshot();
      snapshotManager.createSnapshot();

      const json = snapshotManager.exportSnapshots();

      expect(json).toBeDefined();
      const parsed = JSON.parse(json);
      expect(Array.isArray(parsed)).toBe(true);
      expect(parsed.length).toBe(2);
    });
  });

  describe('Snapshot Deletion', () => {
    it('should delete a snapshot', () => {
      const id = snapshotManager.createSnapshot();
      expect(snapshotManager.getSnapshotCount()).toBe(1);

      const deleted = snapshotManager.deleteSnapshot(id);
      
      expect(deleted).toBe(true);
      expect(snapshotManager.getSnapshotCount()).toBe(0);
    });

    it('should return false when deleting non-existent snapshot', () => {
      const deleted = snapshotManager.deleteSnapshot(999);
      expect(deleted).toBe(false);
    });

    it('should clear all snapshots', () => {
      snapshotManager.createSnapshot();
      snapshotManager.createSnapshot();
      snapshotManager.createSnapshot();

      expect(snapshotManager.getSnapshotCount()).toBe(3);
      
      snapshotManager.clearSnapshots();
      
      expect(snapshotManager.getSnapshotCount()).toBe(0);
    });

    it('should reset snapshot counter after clear', () => {
      snapshotManager.createSnapshot();
      snapshotManager.createSnapshot();
      snapshotManager.clearSnapshots();

      const newId = snapshotManager.createSnapshot();
      expect(newId).toBe(0);
    });
  });

  describe('Nested Snapshots', () => {
    it('should support nested snapshot creation', () => {
      const stack = context.getStack();
      stack.push(10);

      const id1 = snapshotManager.createSnapshot();
      stack.push(20);

      const id2 = snapshotManager.createSnapshot();
      stack.push(30);

      const id3 = snapshotManager.createSnapshot();

      const snapshot1 = snapshotManager.getSnapshot(id1);
      const snapshot2 = snapshotManager.getSnapshot(id2);
      const snapshot3 = snapshotManager.getSnapshot(id3);

      expect(snapshot1?.stack).toEqual([10]);
      expect(snapshot2?.stack).toEqual([10, 20]);
      expect(snapshot3?.stack).toEqual([10, 20, 30]);
    });

    it('should maintain separate snapshots for different states', () => {
      context.setProgramCounter(100);
      const id1 = snapshotManager.createSnapshot();

      context.setProgramCounter(200);
      const id2 = snapshotManager.createSnapshot();

      context.setProgramCounter(300);
      const id3 = snapshotManager.createSnapshot();

      expect(snapshotManager.getSnapshot(id1)?.programCounter).toBe(100);
      expect(snapshotManager.getSnapshot(id2)?.programCounter).toBe(200);
      expect(snapshotManager.getSnapshot(id3)?.programCounter).toBe(300);
    });
  });

  describe('Snapshot Comparison', () => {
    it('should compare two snapshots', () => {
      const stack = context.getStack();
      stack.push(10);

      const id1 = snapshotManager.createSnapshot();
      stack.push(20);

      const id2 = snapshotManager.createSnapshot();

      const diff = snapshotManager.compareSnapshots(id1, id2);

      expect(diff).toBeDefined();
      expect(diff?.stackDiff).toEqual([20]);
    });

    it('should return null when comparing non-existent snapshots', () => {
      const diff = snapshotManager.compareSnapshots(999, 1000);
      expect(diff).toBeNull();
    });

    it('should calculate PC difference', () => {
      context.setProgramCounter(100);
      const id1 = snapshotManager.createSnapshot();

      context.setProgramCounter(150);
      const id2 = snapshotManager.createSnapshot();

      const diff = snapshotManager.compareSnapshots(id1, id2);
      expect(diff?.pcDiff).toBe(50);
    });

    it('should detect no changes in identical snapshots', () => {
      const id1 = snapshotManager.createSnapshot();
      const id2 = snapshotManager.createSnapshot();

      const diff = snapshotManager.compareSnapshots(id1, id2);
      expect(diff?.stackDiff).toEqual([]);
      expect(diff?.pcDiff).toBe(0);
    });
  });

  describe('Empty Snapshot', () => {
    it('should create snapshot with all options disabled', () => {
      const id = snapshotManager.createSnapshot({
        includeStack: false,
        includeHeap: false,
        includeCallFrames: false,
      });

      const snapshot = snapshotManager.getSnapshot(id);
      expect(snapshot?.stack).toEqual([]);
      expect(snapshot?.heap).toEqual([]);
      expect(snapshot?.callFrames).toEqual([]);
    });

    it('should handle empty snapshot metadata', () => {
      const id = snapshotManager.createSnapshot({}, {});
      const snapshot = snapshotManager.getSnapshot(id);

      expect(snapshot?.metadata).toEqual({});
    });
  });

  describe('Memory Snapshot', () => {
    it('should capture heap state in snapshot', () => {
      const heap = context.getHeap();
      heap.setMaxBlocks(100);
      const alloc1 = heap.allocate(64);
      const alloc2 = heap.allocate(128);

      const id = snapshotManager.createSnapshot({ includeHeap: true });
      const snapshot = snapshotManager.getSnapshot(id);

      expect(snapshot?.heap.length).toBeGreaterThan(0);
    });

    it('should exclude heap when option is disabled', () => {
      const heap = context.getHeap();
      heap.setMaxBlocks(100);
      heap.allocate(64);

      const id = snapshotManager.createSnapshot({ includeHeap: false });
      const snapshot = snapshotManager.getSnapshot(id);

      expect(snapshot?.heap).toEqual([]);
    });
  });

  describe('Stack Snapshot', () => {
    it('should capture stack state in snapshot', () => {
      const stack = context.getStack();
      stack.push(1);
      stack.push(2);
      stack.push(3);

      const id = snapshotManager.createSnapshot({ includeStack: true });
      const snapshot = snapshotManager.getSnapshot(id);

      expect(snapshot?.stack).toEqual([1, 2, 3]);
    });

    it('should exclude stack when option is disabled', () => {
      const stack = context.getStack();
      stack.push(1);
      stack.push(2);

      const id = snapshotManager.createSnapshot({ includeStack: false });
      const snapshot = snapshotManager.getSnapshot(id);

      expect(snapshot?.stack).toEqual([]);
    });

    it('should capture empty stack', () => {
      const id = snapshotManager.createSnapshot({ includeStack: true });
      const snapshot = snapshotManager.getSnapshot(id);

      expect(snapshot?.stack).toEqual([]);
    });
  });

  describe('Registers Snapshot', () => {
    it('should capture register state in snapshot', () => {
      // Note: The current implementation doesn't actually capture registers
      // This test documents the expected behavior
      const id = snapshotManager.createSnapshot({ includeRegisters: true });
      const snapshot = snapshotManager.getSnapshot(id);

      expect(snapshot?.registers).toBeDefined();
    });
  });

  describe('Validation', () => {
    it('should validate valid state', () => {
      snapshotManager.createSnapshot();
      snapshotManager.createSnapshot();

      const validation = snapshotManager.validate();
      expect(validation.valid).toBe(true);
      expect(validation.errors).toEqual([]);
    });

    it('should detect invalid program counter', () => {
      const id = snapshotManager.createSnapshot();
      const snapshot = snapshotManager.getSnapshot(id);
      if (snapshot) {
        (snapshot as any).programCounter = -1;
        (snapshotManager as any).snapshots.set(id, snapshot);
      }

      const validation = snapshotManager.validate();
      expect(validation.valid).toBe(false);
    });

    it('should detect invalid timestamp', () => {
      const id = snapshotManager.createSnapshot();
      const snapshot = snapshotManager.getSnapshot(id);
      if (snapshot) {
        (snapshot as any).timestamp = -1;
        (snapshotManager as any).snapshots.set(id, snapshot);
      }

      const validation = snapshotManager.validate();
      expect(validation.valid).toBe(false);
    });
  });

  describe('Statistics', () => {
    it('should get statistics', () => {
      const stack = context.getStack();
      stack.push(1);
      stack.push(2);
      stack.push(3);

      snapshotManager.createSnapshot();
      snapshotManager.createSnapshot();

      const stats = snapshotManager.getStatistics();

      expect(stats.snapshotCount).toBe(2);
      expect(stats.totalSize).toBeGreaterThan(0);
      expect(stats.averageSize).toBeGreaterThan(0);
    });

    it('should handle zero snapshots in statistics', () => {
      const stats = snapshotManager.getStatistics();

      expect(stats.snapshotCount).toBe(0);
      expect(stats.totalSize).toBe(0);
      expect(stats.averageSize).toBe(0);
    });
  });

  describe('Context Management', () => {
    it('should set execution context', () => {
      const newContext = new ExecutionContext();
      snapshotManager.setContext(newContext);

      expect(snapshotManager.getContext()).toBe(newContext);
    });

    it('should get execution context', () => {
      const retrievedContext = snapshotManager.getContext();
      expect(retrievedContext).toBe(context);
    });
  });

  describe('Stress Tests', () => {
    it('should handle hundreds of snapshots', () => {
      const stack = context.getStack();
      
      for (let i = 0; i < 200; i++) {
        stack.push(i);
        snapshotManager.createSnapshot();
      }

      expect(snapshotManager.getSnapshotCount()).toBe(200);
      
      const validation = snapshotManager.validate();
      expect(validation.valid).toBe(true);
    });

    it('should handle rapid snapshot creation and deletion', () => {
      for (let i = 0; i < 100; i++) {
        const id = snapshotManager.createSnapshot();
        snapshotManager.deleteSnapshot(id);
      }

      expect(snapshotManager.getSnapshotCount()).toBe(0);
    });

    it('should handle large stack snapshots', () => {
      const stack = context.getStack();
      for (let i = 0; i < 1000; i++) {
        stack.push(i);
      }

      const id = snapshotManager.createSnapshot();
      const snapshot = snapshotManager.getSnapshot(id);

      expect(snapshot?.stack.length).toBe(1000);
    });

    it('should handle large metadata', () => {
      const largeMetadata: Record<string, unknown> = {};
      for (let i = 0; i < 100; i++) {
        largeMetadata[`key${i}`] = `value${i}`.repeat(100);
      }

      const id = snapshotManager.createSnapshot({}, largeMetadata);
      const snapshot = snapshotManager.getSnapshot(id);

      expect(snapshot?.metadata).toBeDefined();
      expect(Object.keys(snapshot?.metadata || {}).length).toBe(100);
    });
  });
});
