import { describe, it, expect, beforeEach } from 'vitest';
import { BinaryHeap } from '../../../CVM/src/scheduler/BinaryHeap';

describe('BinaryHeap', () => {
  let heap: BinaryHeap<number>;

  beforeEach(() => {
    heap = new BinaryHeap((a, b) => a - b); // Min-heap
  });

  describe('creation', () => {
    it('should create binary heap with comparator', () => {
      expect(heap).toBeDefined();
      expect(heap.size()).toBe(0);
      expect(heap.isEmpty()).toBe(true);
    });

    it('should create max-heap with reverse comparator', () => {
      const maxHeap = new BinaryHeap((a: number, b: number) => b - a);
      expect(maxHeap).toBeDefined();
    });
  });

  describe('size', () => {
    it('should return 0 for empty heap', () => {
      expect(heap.size()).toBe(0);
    });

    it('should return correct size after enqueues', () => {
      heap.enqueue(5);
      heap.enqueue(3);
      heap.enqueue(7);

      expect(heap.size()).toBe(3);
    });

    it('should update size after dequeue', () => {
      heap.enqueue(5);
      heap.enqueue(3);
      heap.dequeue();

      expect(heap.size()).toBe(1);
    });
  });

  describe('isEmpty', () => {
    it('should return true for empty heap', () => {
      expect(heap.isEmpty()).toBe(true);
    });

    it('should return false after enqueue', () => {
      heap.enqueue(5);
      expect(heap.isEmpty()).toBe(false);
    });

    it('should return true after removing all items', () => {
      heap.enqueue(5);
      heap.dequeue();
      expect(heap.isEmpty()).toBe(true);
    });
  });

  describe('peek', () => {
    it('should return null for empty heap', () => {
      expect(heap.peek()).toBeNull();
    });

    it('should return minimum item without removing', () => {
      heap.enqueue(5);
      heap.enqueue(3);
      heap.enqueue(7);

      expect(heap.peek()).toBe(3);
      expect(heap.size()).toBe(3);
    });

    it('should maintain heap property after peek', () => {
      heap.enqueue(5);
      heap.enqueue(3);
      heap.peek();
      heap.enqueue(1);

      expect(heap.peek()).toBe(1);
    });
  });

  describe('enqueue', () => {
    it('should add item to heap', () => {
      heap.enqueue(5);
      expect(heap.size()).toBe(1);
      expect(heap.peek()).toBe(5);
    });

    it('should maintain heap property', () => {
      heap.enqueue(5);
      heap.enqueue(3);
      heap.enqueue(7);

      expect(heap.peek()).toBe(3);
    });

    it('should handle multiple enqueues', () => {
      for (let i = 10; i > 0; i--) {
        heap.enqueue(i);
      }

      expect(heap.peek()).toBe(1);
      expect(heap.size()).toBe(10);
    });

    it('should handle duplicate values', () => {
      heap.enqueue(5);
      heap.enqueue(5);
      heap.enqueue(3);
      heap.enqueue(3);

      expect(heap.size()).toBe(4);
      expect(heap.peek()).toBe(3);
    });

    it('should handle negative numbers', () => {
      heap.enqueue(-5);
      heap.enqueue(3);
      heap.enqueue(-10);

      expect(heap.peek()).toBe(-10);
    });
  });

  describe('dequeue', () => {
    it('should return null for empty heap', () => {
      expect(heap.dequeue()).toBeNull();
    });

    it('should remove and return minimum item', () => {
      heap.enqueue(5);
      heap.enqueue(3);
      heap.enqueue(7);

      const item = heap.dequeue();
      expect(item).toBe(3);
      expect(heap.size()).toBe(2);
    });

    it('should maintain heap property after dequeue', () => {
      heap.enqueue(5);
      heap.enqueue(3);
      heap.enqueue(7);
      heap.dequeue();

      expect(heap.peek()).toBe(5);
    });

    it('should dequeue in sorted order', () => {
      heap.enqueue(5);
      heap.enqueue(3);
      heap.enqueue(7);
      heap.enqueue(1);
      heap.enqueue(9);

      const items = [];
      while (!heap.isEmpty()) {
        items.push(heap.dequeue());
      }

      expect(items).toEqual([1, 3, 5, 7, 9]);
    });

    it('should handle single item', () => {
      heap.enqueue(5);
      const item = heap.dequeue();

      expect(item).toBe(5);
      expect(heap.isEmpty()).toBe(true);
    });
  });

  describe('remove', () => {
    it('should return false for non-existent item', () => {
      heap.enqueue(5);
      const removed = heap.remove(10);

      expect(removed).toBe(false);
      expect(heap.size()).toBe(1);
    });

    it('should remove existing item', () => {
      heap.enqueue(5);
      heap.enqueue(3);
      heap.enqueue(7);

      const removed = heap.remove(5);
      expect(removed).toBe(true);
      expect(heap.size()).toBe(2);
    });

    it('should maintain heap property after removal', () => {
      heap.enqueue(5);
      heap.enqueue(3);
      heap.enqueue(7);
      heap.remove(5);

      expect(heap.peek()).toBe(3);
    });

    it('should handle removing root', () => {
      heap.enqueue(5);
      heap.enqueue(3);
      heap.enqueue(7);

      heap.remove(3);
      expect(heap.peek()).toBe(5);
    });

    it('should handle removing last item', () => {
      heap.enqueue(5);
      heap.enqueue(3);
      heap.enqueue(7);

      heap.remove(7);
      expect(heap.size()).toBe(2);
    });
  });

  describe('clear', () => {
    it('should clear all items', () => {
      heap.enqueue(5);
      heap.enqueue(3);
      heap.enqueue(7);

      heap.clear();

      expect(heap.isEmpty()).toBe(true);
      expect(heap.size()).toBe(0);
    });

    it('should handle clearing empty heap', () => {
      expect(() => heap.clear()).not.toThrow();
    });
  });

  describe('toArray', () => {
    it('should return empty array for empty heap', () => {
      expect(heap.toArray()).toEqual([]);
    });

    it('should return copy of items', () => {
      heap.enqueue(5);
      heap.enqueue(3);
      heap.enqueue(7);

      const array = heap.toArray();
      expect(array).toHaveLength(3);

      // Modifying array should not affect heap
      array.push(10);
      expect(heap.size()).toBe(3);
    });

    it('should not be in sorted order', () => {
      heap.enqueue(5);
      heap.enqueue(3);
      heap.enqueue(7);

      const array = heap.toArray();
      // Heap array is not necessarily in sorted order
      expect(array.length).toBe(3);
    });
  });

  describe('filter', () => {
    it('should return empty array for empty heap', () => {
      expect(heap.filter(() => true)).toEqual([]);
    });

    it('should filter items by predicate', () => {
      heap.enqueue(5);
      heap.enqueue(3);
      heap.enqueue(7);
      heap.enqueue(1);

      const filtered = heap.filter(item => item > 3);
      // Filter returns items in heap order, not sorted order
      expect(filtered).toHaveLength(2);
      expect(filtered).toContain(5);
      expect(filtered).toContain(7);
    });

    it('should not modify heap', () => {
      heap.enqueue(5);
      heap.enqueue(3);

      heap.filter(item => item > 3);
      expect(heap.size()).toBe(2);
    });

    it('should handle no matches', () => {
      heap.enqueue(5);
      heap.enqueue(3);

      const filtered = heap.filter(item => item > 10);
      expect(filtered).toEqual([]);
    });
  });

  describe('update', () => {
    it('should handle non-existent item', () => {
      heap.enqueue(5);
      expect(() => heap.update(10)).not.toThrow();
    });

    it('should reposition item after update', () => {
      heap.enqueue(5);
      heap.enqueue(3);
      heap.enqueue(7);

      // This tests that update can reposition if comparator changes
      heap.update(5);
      expect(heap.size()).toBe(3);
    });

    it('should maintain heap property', () => {
      heap.enqueue(5);
      heap.enqueue(3);
      heap.enqueue(7);

      heap.update(3);
      expect(heap.peek()).toBe(3);
    });
  });

  describe('heap property', () => {
    it('should maintain min-heap property', () => {
      const items = [5, 3, 7, 1, 9, 2, 8];
      items.forEach(item => heap.enqueue(item));

      let prev = -Infinity;
      while (!heap.isEmpty()) {
        const current = heap.dequeue()!;
        expect(current).toBeGreaterThanOrEqual(prev);
        prev = current;
      }
    });

    it('should maintain max-heap property', () => {
      const maxHeap = new BinaryHeap((a: number, b: number) => b - a);
      const items = [5, 3, 7, 1, 9, 2, 8];
      items.forEach(item => maxHeap.enqueue(item));

      let prev = Infinity;
      while (!maxHeap.isEmpty()) {
        const current = maxHeap.dequeue()!;
        expect(current).toBeLessThanOrEqual(prev);
        prev = current;
      }
    });
  });

  describe('edge cases', () => {
    it('should handle large number of items', () => {
      for (let i = 0; i < 1000; i++) {
        heap.enqueue(Math.random() * 1000);
      }

      expect(heap.size()).toBe(1000);
    });

    it('should handle zero values', () => {
      heap.enqueue(0);
      heap.enqueue(5);
      heap.enqueue(-5);

      expect(heap.peek()).toBe(-5);
    });

    it('should handle very large values', () => {
      heap.enqueue(Number.MAX_SAFE_INTEGER);
      heap.enqueue(0);
      heap.enqueue(Number.MIN_SAFE_INTEGER);

      expect(heap.peek()).toBe(Number.MIN_SAFE_INTEGER);
    });

    it('should handle floating point numbers', () => {
      heap.enqueue(5.5);
      heap.enqueue(3.3);
      heap.enqueue(7.7);

      expect(heap.peek()).toBe(3.3);
    });

    it('should handle custom comparator', () => {
      const customHeap = new BinaryHeap((a: string, b: string) => {
        if (a.length !== b.length) return a.length - b.length;
        return a.localeCompare(b);
      });

      customHeap.enqueue('abc');
      customHeap.enqueue('a');
      customHeap.enqueue('ab');

      expect(customHeap.peek()).toBe('a');
    });
  });

  describe('object heap', () => {
    interface Task {
      id: string;
      priority: number;
    }

    it('should work with objects', () => {
      const objectHeap = new BinaryHeap<Task>((a, b) => a.priority - b.priority);

      objectHeap.enqueue({ id: 'task-1', priority: 5 });
      objectHeap.enqueue({ id: 'task-2', priority: 3 });
      objectHeap.enqueue({ id: 'task-3', priority: 7 });

      const peeked = objectHeap.peek();
      expect(peeked?.priority).toBe(3);
    });

    it('should dequeue objects in priority order', () => {
      const objectHeap = new BinaryHeap<Task>((a, b) => a.priority - b.priority);

      objectHeap.enqueue({ id: 'task-1', priority: 5 });
      objectHeap.enqueue({ id: 'task-2', priority: 3 });
      objectHeap.enqueue({ id: 'task-3', priority: 7 });

      const items = [];
      while (!objectHeap.isEmpty()) {
        items.push(objectHeap.dequeue());
      }

      expect(items[0]?.priority).toBe(3);
      expect(items[1]?.priority).toBe(5);
      expect(items[2]?.priority).toBe(7);
    });
  });

  describe('concurrent operations', () => {
    it('should handle enqueue and dequeue interleaved', () => {
      heap.enqueue(5);
      heap.enqueue(3);
      heap.dequeue(); // removes 3
      heap.enqueue(7);
      heap.enqueue(1);
      heap.dequeue(); // removes 1

      // After dequeuing 3 and 1, the minimum remaining is 5
      expect(heap.peek()).toBe(5);
    });

    it('should handle remove during iteration', () => {
      heap.enqueue(5);
      heap.enqueue(3);
      heap.enqueue(7);
      heap.enqueue(1);

      heap.remove(5);
      heap.remove(3);

      expect(heap.peek()).toBe(1);
    });
  });

  describe('performance', () => {
    it('should handle rapid enqueues', () => {
      const start = Date.now();
      for (let i = 0; i < 10000; i++) {
        heap.enqueue(Math.random() * 1000);
      }
      const elapsed = Date.now() - start;

      expect(elapsed).toBeLessThan(1000); // Should complete in under 1 second
    });

    it('should handle rapid dequeues', () => {
      for (let i = 0; i < 1000; i++) {
        heap.enqueue(Math.random() * 1000);
      }

      const start = Date.now();
      while (!heap.isEmpty()) {
        heap.dequeue();
      }
      const elapsed = Date.now() - start;

      expect(elapsed).toBeLessThan(1000);
    });
  });
});
