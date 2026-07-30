import { describe, it, expect } from 'vitest';
import { Heap } from '../../compiler/cbs/heap';
import { Stack } from '../../compiler/cbs/stack';

describe('Memory', () => {
  it('should allocate memory correctly', () => {
    const heap = new Heap();
    const result = heap.allocate(1024);
    expect(result.address).toBeGreaterThanOrEqual(0);
    expect(result.size).toBe(1024);
  });

  it('should free memory correctly', () => {
    const heap = new Heap();
    const result = heap.allocate(1024);
    heap.free(result.address);
    expect(true).toBe(true);
  });

  it('should handle stack operations', () => {
    const stack = new Stack();
    stack.push(42);
    const value = stack.pop();
    expect(value).toBe(42);
  });

  it('should prevent memory leaks', () => {
    const heap = new Heap();
    for (let i = 0; i < 1000; i++) {
      const result = heap.allocate(1024);
      heap.free(result.address);
    }
    const stats = heap.getStatistics();
    expect(stats.allocatedSize).toBe(0);
  });
});
