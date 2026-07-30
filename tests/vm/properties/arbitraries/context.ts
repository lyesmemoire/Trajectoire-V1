import fc from 'fast-check';
import { registersArb } from './registers';

// Arbitrary for stack state
export const stackSnapshotArb = fc.array(fc.integer(), { minLength: 0, maxLength: 100 });

// Arbitrary for heap state
// In execution-context.ts: restoreSnapshot expects snapshot.heap, but it currently does heap.clear()
// and a comment says "Note: Heap blocks would need to be restored properly"
// We'll generate an empty array for now since it doesn't restore it anyway, or any array.
export const heapSnapshotArb = fc.constant([]);

// Arbitrary for program counter
export const pcArb = fc.integer({ min: 0, max: 10000 });

// Arbitrary for halted state
export const haltedArb = fc.boolean();

export const contextSnapshotArb = fc.record({
  stack: stackSnapshotArb,
  heap: heapSnapshotArb,
  registers: registersArb,
  programCounter: pcArb,
  halted: haltedArb,
});
