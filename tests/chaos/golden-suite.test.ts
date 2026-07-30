import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import { ChaosEngine } from './engine/ChaosEngine';
import { ChaosTarget, ChaosScenario } from './engine/interfaces';
import { FaultInjector } from './engine/FaultInjector';
import { ExplicitDiagnosisOracle, CleanupOracle, SnapshotIntegrityOracle } from './oracles';

class ResilientTarget implements ChaosTarget {
  name = 'ResilientCVM';

  async initialize() {}
  async shutdown() {}

  async executeScenario(scenarioId: string) {
    try {
      if (scenarioId === 'scenario-disk-full') {
        fs.writeFileSync('dummy.txt', 'test');
      } else if (scenarioId === 'scenario-permission-denied') {
        fs.readFileSync('dummy.txt');
      } else if (scenarioId === 'scenario-oom') {
        new Uint8Array(2048);
      }
    } catch (e: any) {
      // Diagnostic Translator (The core of the Chaos Requirement)
      if (e.code === 'ENOSPC') {
        throw new Error('RESOURCE_EXHAUSTED: DISK_FULL');
      }
      if (e.code === 'EACCES') {
        throw new Error('SECURITY_VIOLATION: PERMISSION_DENIED');
      }
      if (e instanceof RangeError && e.message.includes('Array buffer allocation failed')) {
        throw new Error('RESOURCE_EXHAUSTED: OOM');
      }
      throw e;
    }
  }
}

describe('Chaos Engine - Golden Suite', () => {
  it('should explicitly diagnose injected faults (No False Positives)', async () => {
    const target = new ResilientTarget();
    const explicitOracle = new ExplicitDiagnosisOracle();
    const cleanupOracle = new CleanupOracle();
    const snapshotOracle = new SnapshotIntegrityOracle();
    
    const scenarios: ChaosScenario[] = [
      {
        id: 'scenario-disk-full',
        name: 'Disk Full Injection',
        target,
        faults: [FaultInjector.createDiskFullFault()],
        oracles: [explicitOracle, cleanupOracle, snapshotOracle]
      },
      {
        id: 'scenario-permission-denied',
        name: 'Permission Denied Injection',
        target,
        faults: [FaultInjector.createPermissionDeniedFault()],
        oracles: [explicitOracle, cleanupOracle, snapshotOracle]
      },
      {
        id: 'scenario-oom',
        name: 'OOM Injection',
        target,
        faults: [FaultInjector.createOOMFault()],
        oracles: [explicitOracle, cleanupOracle, snapshotOracle]
      }
    ];

    const config = {
      schemaVersion: '1.0',
      campaignId: 'golden-chaos',
      campaignVersion: '1.0.0',
      seed: 42,
      scenarios: ['all']
    };

    const engine = new ChaosEngine(config, scenarios, 'golden-commit');
    const report = await engine.run();

    expect(report.summary.scenariosExecuted).toBe(3);
    expect(report.summary.faultsInjected).toBe(3);
    expect(report.summary.oracleViolations).toBe(0);
    expect(report.summary.passed).toBe(true);

    for (const res of report.results) {
      expect(res.oracles.every(o => o.status === 'PASS')).toBe(true);
      expect(res.cleanupVerified).toBe(true);
    }
  });
});
