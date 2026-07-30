import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { ExecutionPipeline } from '../../../compiler/cvm/execution-pipeline';
import { ExecutionContext } from '../../../compiler/cvm/execution-context';
import { bytecodeArb } from './arbitraries';

const NUM_RUNS = process.env.PBT_RUNS ? Number(process.env.PBT_RUNS) : 500;
const SEED = process.env.PBT_SEED ? Number(process.env.PBT_SEED) : undefined;
const ASSERT_OPTS = SEED ? { numRuns: NUM_RUNS, seed: SEED } : { numRuns: NUM_RUNS };

describe('ExecutionPipeline PBT', () => {
  it('P-005: Determinism', () => {
    // Même bytecode + Même état initial -> Même résultat (Cycle stats, etc.)
    fc.assert(
      fc.property(bytecodeArb, (bytecode) => {
        const ctx1 = new ExecutionContext();
        const pipeline1 = new ExecutionPipeline(bytecode, ctx1);
        
        const ctx2 = new ExecutionContext();
        const pipeline2 = new ExecutionPipeline(bytecode, ctx2);
        
        let res1, err1;
        try { res1 = pipeline1.cycle(); } catch (e: any) { err1 = e.message; }
        
        let res2, err2;
        try { res2 = pipeline2.cycle(); } catch (e: any) { err2 = e.message; }
        
        expect(res1).toEqual(res2);
        expect(err1).toEqual(err2);
        expect(pipeline1.getStatistics()).toEqual(pipeline2.getStatistics());
        expect(ctx1.getProgramCounter()).toEqual(ctx2.getProgramCounter());
      }),
      ASSERT_OPTS
    );
  });

  it('P-006: Absence d\'exception inattendue', () => {
    // Aucun bytecode arbitraire ne doit provoquer de crash Node / exception non capturée
    // Le résultat attendu est une erreur contrôlée (Error object) ou un cycle normal
    fc.assert(
      fc.property(bytecodeArb, (bytecode) => {
        const ctx = new ExecutionContext();
        const pipeline = new ExecutionPipeline(bytecode, ctx);
        
        try {
          const res = pipeline.cycle();
          if (res !== null) {
            expect(typeof res.success).toBe('boolean');
          }
        } catch (e) {
          // L'erreur doit être une instance d'Error standard (erreur contrôlée du compilateur)
          expect(e).toBeInstanceOf(Error);
        }
      }),
      ASSERT_OPTS
    );
  });

  it('P-007: Immutabilité des entrées', () => {
    // Les paramètres fournis à run() ou cycle() ne doivent jamais être modifiés
    fc.assert(
      fc.property(bytecodeArb, (bytecode) => {
        const originalBytecode = new Uint8Array(bytecode);
        
        const ctx = new ExecutionContext();
        const pipeline = new ExecutionPipeline(bytecode, ctx);
        
        try {
          pipeline.cycle();
        } catch (e) {
          // Ignorer les erreurs de décodage
        }
        
        expect(bytecode).toEqual(originalBytecode);
      }),
      ASSERT_OPTS
    );
  });

  it('P-008: Reset complet', () => {
    // run -> reset -> run === même résultat
    fc.assert(
      fc.property(bytecodeArb, (bytecode) => {
        const ctx = new ExecutionContext();
        const pipeline = new ExecutionPipeline(bytecode, ctx);
        
        let statsRun1, err1;
        try { statsRun1 = pipeline.runCycles(5); } catch (e: any) { err1 = e.message; }
        
        pipeline.reset();
        
        let statsRun2, err2;
        try { statsRun2 = pipeline.runCycles(5); } catch (e: any) { err2 = e.message; }
        
        expect(statsRun1).toEqual(statsRun2);
        expect(err1).toEqual(err2);
      }),
      ASSERT_OPTS
    );
  });

  it('P-009: Validation déterministe', () => {
    // validate(X) === validate(X) toujours
    fc.assert(
      fc.property(bytecodeArb, (bytecode) => {
        const ctx = new ExecutionContext();
        const pipeline = new ExecutionPipeline(bytecode, ctx);
        
        const v1 = pipeline.validate();
        const v2 = pipeline.validate();
        
        expect(v1).toEqual(v2);
        expect(typeof v1.valid).toBe('boolean');
        expect(Array.isArray(v1.errors)).toBe(true);
      }),
      ASSERT_OPTS
    );
  });
  
  it('Halt Invariance', () => {
    // Si halted, cycle() retourne null et ne modifie pas les stats
    fc.assert(
      fc.property(bytecodeArb, (bytecode) => {
        const ctx = new ExecutionContext();
        const pipeline = new ExecutionPipeline(bytecode, ctx);
        
        ctx.halt();
        const preStats = pipeline.getStatistics();
        const prePC = ctx.getProgramCounter();
        
        let res;
        try { res = pipeline.cycle(); } catch (e) { res = e; }
        
        expect(res).toBeNull();
        expect(pipeline.getStatistics()).toEqual(preStats);
        expect(ctx.getProgramCounter()).toBe(prePC);
      }),
      ASSERT_OPTS
    );
  });
});
