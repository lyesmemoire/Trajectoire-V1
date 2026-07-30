import { describe, it, expect, beforeEach } from 'vitest';
import { ExecutionContext } from '../../../compiler/cvm/execution-context';
import { Stack } from '../../../compiler/cbs/stack';
import { Heap } from '../../../compiler/cbs/heap';
import { GarbageCollector } from '../../../compiler/cvm/garbage-collector';

describe('Demo Programs - Memory Stress', () => {
  let context: ExecutionContext;
  let stack: Stack;
  let heap: Heap;
  let gc: GarbageCollector;

  beforeEach(() => {
    context = new ExecutionContext();
    stack = context.getStack();
    heap = context.getHeap();
    gc = new GarbageCollector(context);
    heap.setMaxBlocks(10000);
  });

  describe('Stack Stress', () => {
    it('should handle 10K stack operations', () => {
      const operations = 10000;
      
      for (let i = 0; i < operations; i++) {
        stack.push(i);
      }
      
      expect(stack.getSize()).toBe(operations);
      
      for (let i = operations - 1; i >= 0; i--) {
        expect(stack.pop()).toBe(i);
      }
      
      expect(stack.getSize()).toBe(0);
    });

    it('should handle rapid push/pop cycles', () => {
      const cycles = 1000;
      
      for (let i = 0; i < cycles; i++) {
        stack.push(i);
        stack.push(i + 1);
        stack.pop();
        stack.pop();
      }
      
      expect(stack.getSize()).toBe(0);
    });

    it('should handle stack overflow gracefully', () => {
      const smallStack = new Stack(100);
      
      expect(() => {
        for (let i = 0; i < 200; i++) {
          smallStack.push(i);
        }
      }).toThrow();
    });
  });

  describe('Heap Stress', () => {
    it('should handle 10K allocations', () => {
      const allocations = 10000;
      const addresses: number[] = [];
      
      for (let i = 0; i < allocations; i++) {
        const allocation = heap.allocate(8);
        addresses.push(allocation.address);
      }
      
      expect(addresses.length).toBe(allocations);
      
      // Free all allocations
      for (const address of addresses) {
        heap.free(address);
      }
    });

    it('should handle many small allocations', () => {
      const allocations = 5000;
      
      for (let i = 0; i < allocations; i++) {
        heap.allocate(4);
      }
      
      const stats = heap.getStatistics();
      expect(stats.allocatedBlocks).toBe(allocations);
    });

    it('should handle large allocations', () => {
      const largeSize = 1024;
      const allocation = heap.allocate(largeSize);
      
      expect(allocation.size).toBe(largeSize);
      
      heap.free(allocation.address);
    });

    it('should handle allocation/deallocation cycles', () => {
      const cycles = 1000;
      
      for (let i = 0; i < cycles; i++) {
        const allocation = heap.allocate(16);
        heap.free(allocation.address);
      }
      
      const stats = heap.getStatistics();
      expect(stats.allocatedBlocks).toBe(0);
      expect(stats.freeBlocks).toBeGreaterThan(0);
    });
  });

  describe('Garbage Collection Stress', () => {
    it('should handle GC with many objects', () => {
      const objects = 1000;
      
      for (let i = 0; i < objects; i++) {
        const allocation = heap.allocate(16);
        // Create circular reference simulation
        heap.write(allocation.address, new Uint8Array([i % 256]));
      }
      
      gc.collect();
      
      // Verify GC ran without errors
      const stats = gc.getStatistics();
      expect(stats).toBeDefined();
    });

    it('should handle GC cycles', () => {
      const cycles = 10;
      
      for (let c = 0; c < cycles; c++) {
        for (let i = 0; i < 100; i++) {
          heap.allocate(8);
        }
        gc.collect();
      }
      
      // Verify GC ran multiple times without errors
      const stats = gc.getStatistics();
      expect(stats).toBeDefined();
    });

    it('should handle memory pressure', () => {
      heap.setMaxBlocks(100);
      
      // Fill heap
      for (let i = 0; i < 100; i++) {
        heap.allocate(8);
      }
      
      gc.collect();
      
      // Verify GC ran without errors under pressure
      const stats = gc.getStatistics();
      expect(stats).toBeDefined();
    });
  });

  describe('Integrated Memory Stress', () => {
    it('should handle combined stack and heap operations', () => {
      const operations = 1000;
      
      for (let i = 0; i < operations; i++) {
        stack.push(i);
        const allocation = heap.allocate(8);
        stack.push(allocation.address);
        stack.pop();
        heap.free(allocation.address);
        stack.pop();
      }
      
      expect(stack.getSize()).toBe(0);
      const heapStats = heap.getStatistics();
      expect(heapStats.allocatedBlocks).toBe(0);
      expect(heapStats.freeBlocks).toBeGreaterThan(0);
    });

    it('should handle memory fragmentation', () => {
      // Allocate and free in a pattern that causes fragmentation
      const addresses: number[] = [];
      
      for (let i = 0; i < 100; i++) {
        addresses.push(heap.allocate(16).address);
      }
      
      // Free every other allocation
      for (let i = 0; i < addresses.length; i += 2) {
        heap.free(addresses[i]);
      }
      
      // Try to allocate in the gaps
      for (let i = 0; i < 50; i++) {
        heap.allocate(8);
      }
      
      gc.collect();
      
      // Verify GC ran without errors
      const stats = gc.getStatistics();
      expect(stats).toBeDefined();
    });

    it('should handle memory stress with GC', () => {
      const iterations = 500;
      
      for (let i = 0; i < iterations; i++) {
        stack.push(i);
        const allocation = heap.allocate(16);
        
        if (i % 10 === 0) {
          gc.collect();
        }
        
        // Only free if allocation succeeded
        if (allocation.address !== 0) {
          try {
            heap.free(allocation.address);
          } catch (e) {
            // Ignore free errors during stress test
          }
        }
        stack.pop();
      }
      
      const gcStats = gc.getStatistics();
      // Verify GC ran without errors
      expect(gcStats).toBeDefined();
    });
  });

  describe('Performance Under Load', () => {
    it('should maintain performance with 10K operations', () => {
      const startTime = performance.now();
      
      for (let i = 0; i < 10000; i++) {
        stack.push(i);
        stack.pop();
      }
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      expect(duration).toBeLessThan(1000); // Less than 1s
    });

    it('should maintain performance with 5K allocations', () => {
      const startTime = performance.now();
      
      const addresses: number[] = [];
      for (let i = 0; i < 5000; i++) {
        addresses.push(heap.allocate(8).address);
      }
      
      for (const address of addresses) {
        heap.free(address);
      }
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      expect(duration).toBeLessThan(1000); // Less than 1s
    });

    it('should maintain performance with GC', () => {
      const startTime = performance.now();
      
      for (let i = 0; i < 1000; i++) {
        heap.allocate(8);
      }
      
      gc.collect();
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      expect(duration).toBeLessThan(1000); // Less than 1s
    });
  });
});
