import { describe, it, expect } from 'vitest';
import { FuzzerEngine } from './engine/FuzzerEngine';
import { Scheduler } from './engine/Scheduler';
import { FuzzTarget, FuzzOracle, OracleResult, FuzzResult } from './engine/interfaces';
import { CorpusManager } from './engine/CorpusManager';

class BuggyTarget implements FuzzTarget {
  name = 'GoldenSuiteTarget';
  
  async initialize() {}
  async shutdown() {}
  
  async execute(input: Uint8Array): Promise<FuzzResult> {
    if (input.length === 0) return { executionTimeMs: 1 };
    
    const cmd = input[0];
    
    // Simuler des défauts volontaires
    if (cmd === 0x01) {
      throw new Error('TypeError: Invalid Opcode');
    }
    if (cmd === 0x02) {
      throw new Error('RangeError: Maximum call stack size exceeded'); // Dépassement de pile
    }
    if (cmd === 0x03) {
      // Boucle infinie simulée par une exécution très longue
      const start = Date.now();
      while (Date.now() - start < 100) { /* busy wait */ }
      return { executionTimeMs: 100, output: 'TIMEOUT_TRIGGER' };
    }
    if (cmd === 0x04) {
      return { executionTimeMs: 1, output: 'MEMORY_CORRUPT' }; // Débordement mémoire simulé
    }
    if (cmd === 0x05) {
      return { executionTimeMs: 1, output: 'PC_CORRUPT' }; // PC corrompu
    }
    
    return { executionTimeMs: 1 };
  }
}

class GoldenOracle implements FuzzOracle {
  name = 'GoldenOracle';
  
  check(result: FuzzResult, input: Uint8Array): OracleResult {
    if (result.output === 'TIMEOUT_TRIGGER' && result.executionTimeMs >= 100) {
      return { status: 'FAIL', reason: 'Timeout' };
    }
    if (result.output === 'MEMORY_CORRUPT') {
      return { status: 'FAIL', reason: 'Memory Violation' };
    }
    if (result.output === 'PC_CORRUPT') {
      return { status: 'FAIL', reason: 'Invalid PC' };
    }
    return { status: 'PASS' };
  }
}

describe('Fuzzing Engine - Golden Suite (Phase 1)', () => {
  it('should detect all injected bugs (Non-Regression)', async () => {
    const target = new BuggyTarget();
    const oracle = new GoldenOracle();
    const scheduler = new Scheduler();
    
    const config = {
      campaignId: "golden-suite",
      campaignVersion: "1.0",
      iterations: 50,
      timeoutMs: 5000,
      coverage: false,
      saveCorpus: false,
      minimizeCrashes: false,
      seed: 12345
    };
    
    const engine = new FuzzerEngine(target, oracle, scheduler, config, 'golden-commit');
    const bus = engine.getEventBus();
    
    const detectedSignatures = new Set<string>();
    
    bus.on('CrashDetected', (ev) => {
      detectedSignatures.add(ev.payload.type);
    });

    // Injecter les cas connus dans le corpus initial pour forcer leur exécution
    scheduler.addEntry({ hash: '1', data: new Uint8Array([0x01]), size: 1, tags: ['golden'] }, 100);
    scheduler.addEntry({ hash: '2', data: new Uint8Array([0x02]), size: 1, tags: ['golden'] }, 100);
    scheduler.addEntry({ hash: '3', data: new Uint8Array([0x03]), size: 1, tags: ['golden'] }, 100);
    scheduler.addEntry({ hash: '4', data: new Uint8Array([0x04]), size: 1, tags: ['golden'] }, 100);
    scheduler.addEntry({ hash: '5', data: new Uint8Array([0x05]), size: 1, tags: ['golden'] }, 100);

    await engine.start();

    // Vérifier que le moteur a bien détecté tous les types de crashs/oracles attendus
    expect(detectedSignatures.has('TypeError')).toBe(true); // 0x01: Opcode invalide
    expect(detectedSignatures.has('RangeError')).toBe(true); // 0x02: Dépassement de pile
    expect(detectedSignatures.has('Timeout')).toBe(true); // 0x03: Boucle infinie
    expect(detectedSignatures.has('Oracle')).toBe(true); // 0x04 & 0x05: Oracles
  });
});
