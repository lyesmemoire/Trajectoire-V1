import { bench, describe } from 'vitest';
import { GarbageCollector } from '../../compiler/cvm/garbage-collector';
import { Heap } from '../../compiler/cbs/heap';

describe('GC Benchmarks', () => {
  bench('GC - collect with no garbage', () => {
    const heap = new Heap();
    const gc = new GarbageCollector(heap);
    gc.collect();
  });

  bench('GC - collect with 1000 objects', () => {
    const heap = new Heap();
    const gc = new GarbageCollector(heap);
    for (let i = 0; i < 1000; i++) {
      heap.allocate(1024);
    }
    gc.collect();
  });

  bench('GC - mark and sweep', () => {
    const heap = new Heap();
    const gc = new GarbageCollector(heap);
    gc.markAndSweep();
  });

  bench('GC - generational collection', () => {
    const heap = new Heap();
    const gc = new GarbageCollector(heap);
    gc.collectGeneration(0);
  });
});
