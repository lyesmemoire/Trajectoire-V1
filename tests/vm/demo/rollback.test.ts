import { describe, it, expect, beforeEach } from 'vitest';
import { ExecutionContext } from '../../../compiler/cvm/execution-context';
import { RollbackManager } from '../../../compiler/cvm/rollback-manager';

describe('Demo Programs - Rollback', () => {
  let context: ExecutionContext;
  let rollbackManager: RollbackManager;

  beforeEach(() => {
    context = new ExecutionContext();
    rollbackManager = new RollbackManager(context);
  });

  describe('Basic Rollback', () => {
    it('should demonstrate snapshot creation and restore', () => {
      const stack = context.getStack();
      stack.push(100);

      const snapshotId = rollbackManager.createSnapshot({ name: 'checkpoint' });
      stack.push(200);
      stack.push(300);

      rollbackManager.restoreSnapshot(snapshotId);

      expect(stack.getSize()).toBe(1);
      expect(stack.peek()).toBe(100);
    });

    it('should demonstrate snapshot deletion', () => {
      const snapshotId = rollbackManager.createSnapshot({ name: 'temp' });
      const deleted = rollbackManager.deleteSnapshot(snapshotId);

      expect(deleted).toBe(true);
      expect(rollbackManager.getSnapshot(snapshotId)).toBeNull();
    });
  });

  describe('Memory Rollback', () => {
    it('should rollback stack changes', () => {
      const stack = context.getStack();
      stack.push(10);
      stack.push(20);

      const snapshotId = rollbackManager.createSnapshot();
      stack.push(30);
      stack.push(40);

      rollbackManager.restoreSnapshot(snapshotId);

      expect(stack.getSize()).toBe(2);
      expect(stack.peek()).toBe(20);
    });

    it('should rollback program counter', () => {
      context.setProgramCounter(100);

      const snapshotId = rollbackManager.createSnapshot();
      context.setProgramCounter(200);

      rollbackManager.restoreSnapshot(snapshotId);

      expect(context.getProgramCounter()).toBe(100);
    });
  });

  describe('Multiple Snapshots', () => {
    it('should demonstrate multiple checkpoints', () => {
      const stack = context.getStack();
      stack.push(1);

      const snapshot1 = rollbackManager.createSnapshot({ name: 'level1' });
      stack.push(2);

      const snapshot2 = rollbackManager.createSnapshot({ name: 'level2' });
      stack.push(3);

      // Restore to level2
      rollbackManager.restoreSnapshot(snapshot2);
      expect(stack.getSize()).toBe(2);

      // Restore to level1
      rollbackManager.restoreSnapshot(snapshot1);
      expect(stack.getSize()).toBe(1);
    });

    it('should handle snapshot sequence', () => {
      const stack = context.getStack();
      const snapshotIds: number[] = [];

      for (let i = 0; i < 5; i++) {
        stack.push(i);
        snapshotIds.push(rollbackManager.createSnapshot({ level: i }));
      }

      // Restore to middle snapshot
      rollbackManager.restoreSnapshot(snapshotIds[2]);
      expect(stack.getSize()).toBe(3);
    });
  });

  describe('Current Snapshot', () => {
    it('should track current snapshot', () => {
      const snapshotId = rollbackManager.createSnapshot({ name: 'current' });

      const current = rollbackManager.getCurrentSnapshot();
      expect(current?.id).toBe(snapshotId);
    });

    it('should update current snapshot on creation', () => {
      rollbackManager.createSnapshot({ name: 'first' });
      const secondId = rollbackManager.createSnapshot({ name: 'second' });

      const current = rollbackManager.getCurrentSnapshot();
      expect(current?.id).toBe(secondId);
    });
  });

  describe('Heap Rollback', () => {
    it('should rollback heap state', () => {
      const heap = context.getHeap();
      heap.setMaxBlocks(100);

      const snapshotId = rollbackManager.createSnapshot();
      const alloc = heap.allocate(16);

      rollbackManager.restoreSnapshot(snapshotId);

      // After restore, heap should be cleared
      const stats = heap.getStatistics();
      expect(stats.allocatedBlocks).toBe(0);
    });
  });

  describe('Rollback Use Cases', () => {
    it('should demonstrate error recovery pattern', () => {
      const stack = context.getStack();
      stack.push(100);

      const checkpoint = rollbackManager.createSnapshot({ name: 'pre-critical' });

      try {
        // Simulate operation that might fail
        stack.push(200);
        stack.push(300);
        // Simulate error
        throw new Error('Operation failed');
      } catch (e) {
        rollbackManager.restoreSnapshot(checkpoint);
      }

      expect(stack.getSize()).toBe(1);
    });

    it('should demonstrate checkpoint pattern', () => {
      const stack = context.getStack();
      stack.push(10);

      const checkpoint = rollbackManager.createSnapshot({ name: 'checkpoint' });

      // Perform operations
      stack.push(20);
      stack.push(30);
      stack.push(40);

      // If something goes wrong, restore
      rollbackManager.restoreSnapshot(checkpoint);

      expect(stack.getSize()).toBe(1);
    });

    it('should demonstrate speculative execution', () => {
      const stack = context.getStack();
      stack.push(1);

      const checkpoint = rollbackManager.createSnapshot({ name: 'speculative' });

      // Try speculative operation
      stack.push(2);
      stack.push(3);

      // If condition not met, rollback
      if (stack.peek() !== 5) {
        rollbackManager.restoreSnapshot(checkpoint);
      }

      expect(stack.getSize()).toBe(1);
    });
  });

  describe('Rollback Statistics', () => {
    it('should get statistics', () => {
      rollbackManager.createSnapshot({ name: 's1' });
      rollbackManager.createSnapshot({ name: 's2' });

      const stats = rollbackManager.getStatistics();
      expect(stats.snapshotCount).toBe(2);
      expect(stats.autoSnapshot).toBe(true);
    });

    it('should track snapshot count', () => {
      rollbackManager.createSnapshot();
      rollbackManager.createSnapshot();
      rollbackManager.createSnapshot();

      expect(rollbackManager.getSnapshotCount()).toBe(3);
    });
  });

  describe('Auto Snapshot', () => {
    it('should create auto snapshot when enabled', () => {
      const snapshotId = rollbackManager.autoSnapshot();

      expect(snapshotId).not.toBeNull();
      expect(rollbackManager.getSnapshot(snapshotId!)).toBeDefined();
    });

    it('should not create auto snapshot when disabled', () => {
      rollbackManager.disableAutoSnapshot();
      const snapshotId = rollbackManager.autoSnapshot();

      expect(snapshotId).toBeNull();
    });

    it('should check auto snapshot status', () => {
      expect(rollbackManager.isAutoSnapshotEnabled()).toBe(true);

      rollbackManager.disableAutoSnapshot();
      expect(rollbackManager.isAutoSnapshotEnabled()).toBe(false);

      rollbackManager.enableAutoSnapshot();
      expect(rollbackManager.isAutoSnapshotEnabled()).toBe(true);
    });
  });

  describe('Rollback Validation', () => {
    it('should validate valid state', () => {
      const stack = context.getStack();
      stack.push(10);
      rollbackManager.createSnapshot();

      const validation = rollbackManager.validate();
      expect(validation.valid).toBe(true);
    });
  });

  describe('Rollback Performance', () => {
    it('should handle large snapshot rollback', () => {
      const stack = context.getStack();

      for (let i = 0; i < 1000; i++) {
        stack.push(i);
      }

      const snapshotId = rollbackManager.createSnapshot();

      const startTime = performance.now();
      rollbackManager.restoreSnapshot(snapshotId);
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100); // Less than 100ms
    });

    it('should handle rapid snapshot creation', () => {
      const stack = context.getStack();

      const startTime = performance.now();
      for (let i = 0; i < 100; i++) {
        stack.push(i);
        rollbackManager.createSnapshot();
      }
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100); // Less than 100ms
    });
  });

  describe('Max Snapshots', () => {
    it('should respect max snapshots limit', () => {
      rollbackManager.setMaxSnapshots(5);

      for (let i = 0; i < 10; i++) {
        rollbackManager.createSnapshot({ index: i });
      }

      expect(rollbackManager.getSnapshotCount()).toBe(5);
    });

    it('should evict oldest snapshots', () => {
      rollbackManager.setMaxSnapshots(3);

      const s1 = rollbackManager.createSnapshot({ name: 'first' });
      const s2 = rollbackManager.createSnapshot({ name: 'second' });
      const s3 = rollbackManager.createSnapshot({ name: 'third' });
      rollbackManager.createSnapshot({ name: 'fourth' });

      // First snapshot should be evicted
      expect(rollbackManager.getSnapshot(s1)).toBeNull();
      expect(rollbackManager.getSnapshot(s2)).toBeDefined();
    });
  });

  describe('Rollback Methods', () => {
    it('should rollback to current snapshot', () => {
      const stack = context.getStack();
      stack.push(100);

      rollbackManager.createSnapshot({ name: 'current' });
      stack.push(200);

      const success = rollbackManager.rollback();

      expect(success).toBe(true);
      expect(stack.getSize()).toBe(1);
    });

    it('should rollback to specific snapshot', () => {
      const stack = context.getStack();
      stack.push(10);

      const snapshotId = rollbackManager.createSnapshot({ name: 'target' });
      stack.push(20);
      stack.push(30);

      const success = rollbackManager.rollbackTo(snapshotId);

      expect(success).toBe(true);
      expect(stack.getSize()).toBe(1);
    });

    it('should fail rollback when no current snapshot', () => {
      const success = rollbackManager.rollback();

      expect(success).toBe(false);
    });
  });

  describe('Rollback Edge Cases', () => {
    it('should handle empty snapshot', () => {
      rollbackManager.createSnapshot({ name: 'empty' });
      rollbackManager.restoreSnapshot(rollbackManager.getCurrentSnapshot()!.id);

      expect(rollbackManager.getSnapshotCount()).toBe(1);
    });

    it('should handle restore of non-existent snapshot', () => {
      const success = rollbackManager.restoreSnapshot(999);

      expect(success).toBe(false);
    });

    it('should handle clear all snapshots', () => {
      rollbackManager.createSnapshot();
      rollbackManager.createSnapshot();

      rollbackManager.clearSnapshots();

      expect(rollbackManager.getSnapshotCount()).toBe(0);
      expect(rollbackManager.getCurrentSnapshot()).toBeNull();
    });
  });
});
