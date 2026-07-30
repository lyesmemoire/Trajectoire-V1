import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { ExecutionContext } from '../../../compiler/cvm/execution-context';
import { contextSnapshotArb } from './arbitraries';

const NUM_RUNS = process.env.PBT_RUNS ? Number(process.env.PBT_RUNS) : 500;
const SEED = process.env.PBT_SEED ? Number(process.env.PBT_SEED) : undefined;
const ASSERT_OPTS = SEED ? { numRuns: NUM_RUNS, seed: SEED } : { numRuns: NUM_RUNS };

describe('ExecutionContext PBT', () => {
  it('P-008: Reset Idempotency', () => {
    // Appeler reset() ramène toujours le contexte à un état initial strict
    fc.assert(
      fc.property(contextSnapshotArb, (snapshot) => {
        const ctx = new ExecutionContext();
        // Restore random state
        ctx.restoreSnapshot(snapshot);
        
        // Call reset
        ctx.reset();
        
        // Assert clean state
        expect(ctx.getProgramCounter()).toBe(0);
        expect(ctx.isHalted()).toBe(false);
        expect(ctx.getError()).toBeNull();
        expect(ctx.getStack().getSize()).toBe(0);
        // Stats should be mostly 0
        const stats = ctx.getStatistics();
        expect(stats.stackUtilization).toBe(0);
        expect(stats.frameCount).toBe(0);
      }),
      ASSERT_OPTS
    );
  });

  it('P-009: Deterministic Validation', () => {
    // validate() renvoie toujours le même résultat pour un même état, et ne crashe jamais
    fc.assert(
      fc.property(contextSnapshotArb, (snapshot) => {
        const ctx = new ExecutionContext();
        ctx.restoreSnapshot(snapshot);
        
        const result1 = ctx.validate();
        const result2 = ctx.validate();
        
        expect(result1).toEqual(result2);
        expect(typeof result1.valid).toBe('boolean');
        expect(Array.isArray(result1.errors)).toBe(true);
      }),
      ASSERT_OPTS
    );
  });

  it('State is preserved across getSnapshot and restoreSnapshot', () => {
    fc.assert(
      fc.property(contextSnapshotArb, (snapshot) => {
        const ctx = new ExecutionContext();
        ctx.restoreSnapshot(snapshot);
        
        const generatedSnapshot = ctx.getSnapshot();
        
        expect(generatedSnapshot.programCounter).toBe(snapshot.programCounter);
        expect(generatedSnapshot.halted).toBe(snapshot.halted);
        // Note: Map equality might require manual checking for registers
        expect(generatedSnapshot.registers.size).toBe(snapshot.registers.size);
      }),
      ASSERT_OPTS
    );
  });
});
