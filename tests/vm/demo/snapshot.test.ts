import { describe, it, expect, beforeEach } from 'vitest';
import { ExecutionContext } from '../../../compiler/cvm/execution-context';
import { SnapshotManager } from '../../../compiler/cvm/snapshot-manager';
import { Register } from '../../../compiler/cbs/register-table';

describe('Demo Programs - Snapshot', () => {
  let context: ExecutionContext;
  let snapshotManager: SnapshotManager;

  beforeEach(() => {
    context = new ExecutionContext();
    snapshotManager = new SnapshotManager(context);
  });

  describe('Basic Snapshot', () => {
    it('should demonstrate snapshot creation', () => {
      const stack = context.getStack();
      stack.push(100);
      stack.push(200);

      const snapshotId = snapshotManager.createSnapshot({}, { name: 'test-snapshot' });
      const snapshot = snapshotManager.getSnapshot(snapshotId);

      expect(snapshot).toBeDefined();
      expect(snapshot?.id).toBe(snapshotId);
      expect(snapshot?.metadata.name).toBe('test-snapshot');
    });

    it('should demonstrate snapshot deletion', () => {
      const snapshotId = snapshotManager.createSnapshot({}, { name: 'temp' });
      const deleted = snapshotManager.deleteSnapshot(snapshotId);

      expect(deleted).toBe(true);
      expect(snapshotManager.getSnapshot(snapshotId)).toBeNull();
    });
  });

  describe('State Preservation', () => {
    it('should preserve stack state', () => {
      const stack = context.getStack();
      for (let i = 0; i < 10; i++) {
        stack.push(i);
      }

      const snapshotId = snapshotManager.createSnapshot();
      const snapshot = snapshotManager.getSnapshot(snapshotId);

      expect(snapshot?.stack.length).toBe(10);
      expect(snapshot?.stack[9]).toBe(9);
    });

    it('should preserve program counter', () => {
      context.setProgramCounter(1000);

      const snapshotId = snapshotManager.createSnapshot();
      const snapshot = snapshotManager.getSnapshot(snapshotId);

      expect(snapshot?.programCounter).toBe(1000);
    });

    it('should preserve timestamp', () => {
      const before = Date.now();
      const snapshotId = snapshotManager.createSnapshot();
      const snapshot = snapshotManager.getSnapshot(snapshotId);
      const after = Date.now();

      expect(snapshot?.timestamp).toBeGreaterThanOrEqual(before);
      expect(snapshot?.timestamp).toBeLessThanOrEqual(after);
    });
  });

  describe('Snapshot Comparison', () => {
    it('should compare two snapshots', () => {
      const stack = context.getStack();
      stack.push(1);

      const snapshot1 = snapshotManager.createSnapshot();
      stack.push(2);

      const snapshot2 = snapshotManager.createSnapshot();

      const diff = snapshotManager.compareSnapshots(snapshot1, snapshot2);
      expect(diff).toBeDefined();
      expect(diff?.stackDiff.length).toBeGreaterThan(0);
    });

    it('should detect program counter changes', () => {
      context.setProgramCounter(100);
      const snapshot1 = snapshotManager.createSnapshot();

      context.setProgramCounter(200);
      const snapshot2 = snapshotManager.createSnapshot();

      const diff = snapshotManager.compareSnapshots(snapshot1, snapshot2);
      expect(diff?.pcDiff).toBe(100);
    });
  });

  describe('Snapshot Management', () => {
    it('should list all snapshots', () => {
      snapshotManager.createSnapshot({}, { name: 's1' });
      snapshotManager.createSnapshot({}, { name: 's2' });
      snapshotManager.createSnapshot({}, { name: 's3' });

      const snapshots = snapshotManager.getAllSnapshots();
      expect(snapshots.length).toBe(3);
    });

    it('should get snapshot by timestamp', () => {
      const snapshotId = snapshotManager.createSnapshot();
      const snapshot = snapshotManager.getSnapshot(snapshotId);

      if (snapshot) {
        const found = snapshotManager.getSnapshotByTimestamp(snapshot.timestamp);
        expect(found?.id).toBe(snapshotId);
      }
    });

    it('should get snapshots in time range', () => {
      const start = Date.now();
      const snapshot1 = snapshotManager.createSnapshot();
      const snapshot2 = snapshotManager.createSnapshot();
      const end = Date.now();

      const snapshots = snapshotManager.getSnapshotsInRange(start, end);
      expect(snapshots.length).toBe(2);
    });

    it('should clear all snapshots', () => {
      snapshotManager.createSnapshot();
      snapshotManager.createSnapshot();

      snapshotManager.clearSnapshots();

      expect(snapshotManager.getAllSnapshots().length).toBe(0);
    });
  });

  describe('Snapshot Options', () => {
    it('should create snapshot without stack', () => {
      const stack = context.getStack();
      stack.push(100);

      const snapshotId = snapshotManager.createSnapshot({ includeStack: false });
      const snapshot = snapshotManager.getSnapshot(snapshotId);

      expect(snapshot?.stack.length).toBe(0);
    });

    it('should create snapshot without heap', () => {
      const snapshotId = snapshotManager.createSnapshot({ includeHeap: false });
      const snapshot = snapshotManager.getSnapshot(snapshotId);

      expect(snapshot?.heap.length).toBe(0);
    });

    it('should create snapshot without call frames', () => {
      const snapshotId = snapshotManager.createSnapshot({ includeCallFrames: false });
      const snapshot = snapshotManager.getSnapshot(snapshotId);

      expect(snapshot?.callFrames.length).toBe(0);
    });
  });

  describe('Snapshot Export/Import', () => {
    it('should export snapshots to JSON', () => {
      snapshotManager.createSnapshot({}, { name: 'test' });

      const exported = snapshotManager.exportSnapshots();
      const parsed = JSON.parse(exported);

      expect(Array.isArray(parsed)).toBe(true);
      expect(parsed.length).toBe(1);
    });

    it('should import snapshots from JSON', () => {
      const snapshotId = snapshotManager.createSnapshot({}, { name: 'original' });
      const exported = snapshotManager.exportSnapshots();

      snapshotManager.clearSnapshots();
      snapshotManager.importSnapshots(exported);

      const snapshots = snapshotManager.getAllSnapshots();
      expect(snapshots.length).toBe(1);
    });
  });

  describe('Snapshot Statistics', () => {
    it('should get statistics', () => {
      const stack = context.getStack();
      for (let i = 0; i < 10; i++) {
        stack.push(i);
      }

      snapshotManager.createSnapshot();
      snapshotManager.createSnapshot();

      const stats = snapshotManager.getStatistics();
      expect(stats.snapshotCount).toBe(2);
      expect(stats.totalSize).toBeGreaterThan(0);
    });

    it('should get snapshot count', () => {
      snapshotManager.createSnapshot();
      snapshotManager.createSnapshot();
      snapshotManager.createSnapshot();

      expect(snapshotManager.getSnapshotCount()).toBe(3);
    });
  });

  describe('Snapshot Validation', () => {
    it('should validate valid state', () => {
      snapshotManager.createSnapshot();

      const validation = snapshotManager.validate();
      expect(validation.valid).toBe(true);
      expect(validation.errors).toEqual([]);
    });
  });

  describe('Snapshot Use Cases', () => {
    it('should demonstrate checkpoint pattern', () => {
      const stack = context.getStack();

      // Create checkpoint before critical operation
      stack.push(100);
      const checkpoint = snapshotManager.createSnapshot({}, { name: 'pre-critical' });

      // Perform operation
      stack.push(200);
      stack.push(300);

      // Compare to see what changed
      const current = snapshotManager.createSnapshot({}, { name: 'post-critical' });
      const diff = snapshotManager.compareSnapshots(checkpoint, current);

      expect(diff?.stackDiff.length).toBeGreaterThan(0);
    });

    it('should demonstrate debug breakpoint pattern', () => {
      const stack = context.getStack();
      stack.push(10);
      stack.push(20);

      const breakpoint = snapshotManager.createSnapshot({}, { name: 'breakpoint' });

      // Continue execution
      stack.push(30);
      stack.push(40);

      // Compare to see what changed
      const current = snapshotManager.createSnapshot({}, { name: 'current' });
      const diff = snapshotManager.compareSnapshots(breakpoint, current);

      expect(diff?.stackDiff.length).toBeGreaterThan(0);
    });
  });

  describe('Snapshot Performance', () => {
    it('should handle large state snapshots', () => {
      const stack = context.getStack();
      for (let i = 0; i < 1000; i++) {
        stack.push(i);
      }

      const startTime = performance.now();
      const snapshotId = snapshotManager.createSnapshot();
      const snapshot = snapshotManager.getSnapshot(snapshotId);
      const endTime = performance.now();

      expect(snapshot?.stack.length).toBe(1000);
      expect(endTime - startTime).toBeLessThan(100); // Less than 100ms
    });

    it('should handle rapid snapshot creation', () => {
      const stack = context.getStack();

      const startTime = performance.now();
      for (let i = 0; i < 100; i++) {
        stack.push(i);
        snapshotManager.createSnapshot();
      }
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100); // Less than 100ms
    });
  });
});
