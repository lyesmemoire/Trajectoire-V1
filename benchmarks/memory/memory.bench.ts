import { bench, describe } from 'vitest';
import { Heap } from '../../compiler/cbs/heap';
import { Stack } from '../../compiler/cbs/stack';
import { MemoryManager } from '../../compiler/cvm/memory-manager';

describe('Memory Benchmarks', () => {
  bench('Heap - allocate 1KB', () => {
    const heap = new Heap();
    heap.allocate(1024);
  });

  bench('Heap - allocate 1MB', () => {
    const heap = new Heap();
    heap.allocate(1024 * 1024);
  });

  bench('Heap - allocate and free 1000 times', () => {
    const heap = new Heap();
    for (let i = 0; i < 1000; i++) {
      const result = heap.allocate(1024);
      heap.free(result.address);
    }
  });

  bench('Stack - push and pop', () => {
    const stack = new Stack();
    stack.push(42);
    stack.pop();
  });

  bench('Stack - push 1000 items', () => {
    const stack = new Stack();
    for (let i = 0; i < 1000; i++) {
      stack.push(i);
    }
  });

  bench('Memory Manager - allocate with tracking', () => {
    const manager = new MemoryManager({ enableTracking: true });
    manager.allocate(1024);
  });
});
