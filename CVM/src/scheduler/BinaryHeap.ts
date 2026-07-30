/**
 * Generic Binary Heap implementation for priority queues
 * Production-ready implementation with O(log n) operations
 */

export class BinaryHeap<T> {
  private items: T[] = [];
  private comparator: (a: T, b: T) => number;

  constructor(comparator: (a: T, b: T) => number) {
    this.comparator = comparator;
  }

  /**
   * Get the number of items in the heap
   */
  size(): number {
    return this.items.length;
  }

  /**
   * Check if the heap is empty
   */
  isEmpty(): boolean {
    return this.items.length === 0;
  }

  /**
   * Peek at the root item without removing it
   */
  peek(): T | null {
    return this.items.length > 0 ? this.items[0] : null;
  }

  /**
   * Add an item to the heap
   */
  enqueue(item: T): void {
    this.items.push(item);
    this.bubbleUp(this.items.length - 1);
  }

  /**
   * Remove and return the root item
   */
  dequeue(): T | null {
    if (this.items.length === 0) return null;
    
    const root = this.items[0];
    const last = this.items.pop()!;
    
    if (this.items.length > 0) {
      this.items[0] = last;
      this.bubbleDown(0);
    }
    
    return root;
  }

  /**
   * Remove a specific item from the heap
   */
  remove(item: T): boolean {
    const index = this.items.indexOf(item);
    if (index === -1) return false;
    
    const last = this.items.pop()!;
    if (index !== this.items.length) {
      this.items[index] = last;
      this.bubbleUp(index);
      this.bubbleDown(index);
    }
    
    return true;
  }

  /**
   * Clear all items from the heap
   */
  clear(): void {
    this.items = [];
  }

  /**
   * Convert heap to array
   */
  toArray(): T[] {
    return [...this.items];
  }

  /**
   * Get all items matching a predicate
   */
  filter(predicate: (item: T) => boolean): T[] {
    return this.items.filter(predicate);
  }

  /**
   * Update an item in place (requires item to be comparable)
   */
  update(item: T): void {
    const index = this.items.indexOf(item);
    if (index === -1) return;
    
    this.bubbleUp(index);
    this.bubbleDown(index);
  }

  private bubbleUp(index: number): void {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (this.comparator(this.items[index], this.items[parentIndex]) >= 0) break;
      
      [this.items[index], this.items[parentIndex]] = [this.items[parentIndex], this.items[index]];
      index = parentIndex;
    }
  }

  private bubbleDown(index: number): void {
    const length = this.items.length;
    
    while (true) {
      const leftChildIndex = 2 * index + 1;
      const rightChildIndex = 2 * index + 2;
      let smallestChildIndex = index;
      
      if (leftChildIndex < length && 
          this.comparator(this.items[leftChildIndex], this.items[smallestChildIndex]) < 0) {
        smallestChildIndex = leftChildIndex;
      }
      
      if (rightChildIndex < length && 
          this.comparator(this.items[rightChildIndex], this.items[smallestChildIndex]) < 0) {
        smallestChildIndex = rightChildIndex;
      }
      
      if (smallestChildIndex === index) break;
      
      [this.items[index], this.items[smallestChildIndex]] = 
        [this.items[smallestChildIndex], this.items[index]];
      index = smallestChildIndex;
    }
  }
}
