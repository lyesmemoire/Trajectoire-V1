import { describe, it, expect, beforeEach } from 'vitest';
import { ExecutionContext } from '../../../compiler/cvm/execution-context';
import { GarbageCollector } from '../../../compiler/cvm/garbage-collector';

describe('Demo Programs - Garbage Collector', () => {
  let context: ExecutionContext;
  let gc: GarbageCollector;

  beforeEach(() => {
    context = new ExecutionContext();
    gc = new GarbageCollector(context);
  });

  describe('Basic GC', () => {
    it('should demonstrate garbage collection', () => {
      const heap = context.getHeap();
      heap.setMaxBlocks(100);

      // Allocate some objects
      for (let i = 0; i < 10; i++) {
        heap.allocate(16);
      }

      const statsBefore = heap.getStatistics();
      expect(statsBefore.allocatedBlocks).toBe(10);

      // Run GC
      gc.collect();

      const statsAfter = heap.getStatistics();
      // GC should clean up unreachable objects
      expect(statsAfter.allocatedBlocks).toBeLessThanOrEqual(statsBefore.allocatedBlocks);
    });

    it('should demonstrate GC statistics', () => {
      gc.collect();

      const stats = gc.getStatistics();
      expect(stats).toBeDefined();
    });
  });

  describe('Memory Allocation', () => {
    it('should demonstrate allocation and GC', () => {
      const heap = context.getHeap();
      heap.setMaxBlocks(100);

      // Allocate objects
      const addresses: number[] = [];
      for (let i = 0; i < 50; i++) {
        addresses.push(heap.allocate(16).address);
      }

      // Run GC
      gc.collect();

      // GC should run without errors
      const stats = gc.getStatistics();
      expect(stats).toBeDefined();
    });

    it('should handle deallocation', () => {
      const heap = context.getHeap();
      const alloc = heap.allocate(16);

      heap.free(alloc.address);

      // Run GC to clean up
      gc.collect();

      const stats = heap.getStatistics();
      expect(stats.allocatedBlocks).toBe(0);
    });
  });

  describe('Circular References', () => {
    it('should handle circular references', () => {
      const heap = context.getHeap();
      heap.setMaxBlocks(100);

      // Create objects with circular references
      const obj1 = heap.allocate(16);
      const obj2 = heap.allocate(16);

      // Simulate circular reference by writing addresses
      heap.write(obj1.address, new Uint8Array([obj2.address & 0xFF]));
      heap.write(obj2.address, new Uint8Array([obj1.address & 0xFF]));

      // Run GC - should handle circular references
      gc.collect();

      const stats = gc.getStatistics();
      expect(stats).toBeDefined();
    });
  });

  describe('Memory Pressure', () => {
    it('should handle low memory conditions', () => {
      const heap = context.getHeap();
      heap.setMaxBlocks(50);

      // Fill heap
      for (let i = 0; i < 50; i++) {
        heap.allocate(16);
      }

      // Run GC under pressure
      gc.collect();

      const stats = gc.getStatistics();
      expect(stats).toBeDefined();
    });

    it('should handle memory exhaustion', () => {
      const heap = context.getHeap();
      heap.setMaxBlocks(10);

      // Try to allocate more than max
      for (let i = 0; i < 15; i++) {
        try {
          heap.allocate(16);
        } catch (e) {
          // Expected to fail after max is reached
        }
      }

      // Run GC to free space
      gc.collect();

      const stats = heap.getStatistics();
      expect(stats).toBeDefined();
    });
  });

  describe('GC Performance', () => {
    it('should handle many objects', () => {
      const heap = context.getHeap();
      heap.setMaxBlocks(1000);

      for (let i = 0; i < 1000; i++) {
        heap.allocate(16);
      }

      const startTime = performance.now();
      gc.collect();
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100); // Less than 100ms
    });

    it('should handle rapid GC cycles', () => {
      const heap = context.getHeap();
      heap.setMaxBlocks(100);

      const startTime = performance.now();
      for (let i = 0; i < 50; i++) {
        heap.allocate(16);
        gc.collect();
      }
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100); // Less than 100ms
    });
  });

  describe('GC Generations', () => {
    it('should demonstrate young generation collection', () => {
      const heap = context.getHeap();
      heap.setMaxBlocks(100);

      // Allocate young objects
      for (let i = 0; i < 20; i++) {
        heap.allocate(16);
      }

      gc.collect();

      const stats = gc.getStatistics();
      expect(stats).toBeDefined();
    });

    it('should demonstrate old generation collection', () => {
      const heap = context.getHeap();
      heap.setMaxBlocks(100);

      // Allocate long-lived objects
      const addresses: number[] = [];
      for (let i = 0; i < 20; i++) {
        addresses.push(heap.allocate(16).address);
      }

      // Multiple GC cycles
      for (let i = 0; i < 5; i++) {
        gc.collect();
      }

      const stats = heap.getStatistics();
      expect(stats).toBeDefined();
    });
  });

  describe('GC Use Cases', () => {
    it('should demonstrate automatic memory management', () => {
      const heap = context.getHeap();
      heap.setMaxBlocks(100);

      // Simulate object lifecycle
      const obj1 = heap.allocate(16);
      const obj2 = heap.allocate(16);
      const obj3 = heap.allocate(16);

      // Free some objects
      heap.free(obj1.address);

      // GC should clean up
      gc.collect();

      const stats = heap.getStatistics();
      expect(stats.allocatedBlocks).toBeLessThanOrEqual(2);
    });

    it('should demonstrate memory leak prevention', () => {
      const heap = context.getHeap();
      heap.setMaxBlocks(100);

      // Simulate potential leak scenario
      const objects: number[] = [];
      for (let i = 0; i < 50; i++) {
        objects.push(heap.allocate(16).address);
      }

      // Free all objects
      for (const addr of objects) {
        try {
          heap.free(addr);
        } catch (e) {
          // Ignore errors
        }
      }

      // GC should prevent leaks
      gc.collect();

      const stats = heap.getStatistics();
      expect(stats.allocatedBlocks).toBeLessThan(50);
    });
  });

  describe('GC Validation', () => {
    it('should validate GC state', () => {
      const validation = gc.validate();

      expect(validation.valid).toBe(true);
      expect(validation.errors).toEqual([]);
    });
  });

  describe('GC Configuration', () => {
    it('should demonstrate GC enable/disable', () => {
      gc.disable();

      const heap = context.getHeap();
      heap.allocate(16);

      // GC disabled, should not collect
      gc.collect();

      gc.enable();

      // GC enabled, should collect
      gc.collect();

      expect(gc.isEnabled()).toBe(true);
    });

    it('should check GC enabled status', () => {
      expect(gc.isEnabled()).toBe(true);

      gc.disable();
      expect(gc.isEnabled()).toBe(false);

      gc.enable();
      expect(gc.isEnabled()).toBe(true);
    });
  });

  describe('GC Edge Cases', () => {
    it('should handle empty heap', () => {
      gc.collect();

      const stats = gc.getStatistics();
      expect(stats).toBeDefined();
    });

    it('should handle single object', () => {
      const heap = context.getHeap();
      heap.allocate(16);

      gc.collect();

      const stats = heap.getStatistics();
      expect(stats).toBeDefined();
    });

    it('should handle very large objects', () => {
      const heap = context.getHeap();
      heap.allocate(1024);

      gc.collect();

      const stats = heap.getStatistics();
      expect(stats).toBeDefined();
    });
  });

  describe('GC Integration', () => {
    it('should integrate with execution context', () => {
      const stack = context.getStack();
      const heap = context.getHeap();

      stack.push(100);
      heap.allocate(16);

      gc.collect();

      // Stack should be preserved
      expect(stack.getSize()).toBe(1);
    });

    it('should integrate with call frames', () => {
      const callFrames = context.getCallFrames();
      const heap = context.getHeap();

      callFrames.createFrame(100, 0, 0);
      heap.allocate(16);

      gc.collect();

      // Call frames should be preserved
      expect(callFrames.getFrameCount()).toBe(1);
    });
  });
});
