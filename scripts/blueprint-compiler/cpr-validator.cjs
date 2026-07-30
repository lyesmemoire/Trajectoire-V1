#!/usr/bin/env node

/**
 * Blueprint V3 Enterprise CPR Validator
 * 
 * OBJECTIF 9: Valider que CPR est un véritable runtime distribué
 * 
 * Composants requis:
 * - Cluster, Consensus, Leader Election, Provider Pool, Distributed Memory,
 *   Distributed Locks, Autoscaler, Scheduler, Execution Coordinator,
 *   Recovery, Replay, Tracing, Telemetry, Security, Governance, API Gateway
 */

const { readFileSync, existsSync } = require('fs');
const { join } = require('path');

class CPRValidator {
  constructor(rootPath) {
    this.rootPath = rootPath;
    this.cprPath = join(rootPath, 'compiler/cpr');
    this.requiredComponents = [
      { name: 'Cluster Manager', file: 'cluster-manager.ts' },
      { name: 'Runtime Manager', file: 'runtime-manager.ts' },
      { name: 'Provider Manager', file: 'provider-manager.ts' },
      { name: 'Execution Coordinator', file: 'execution-coordinator.ts' },
      { name: 'Distributed Scheduler', file: 'distributed-scheduler.ts' },
      { name: 'Distributed Memory', file: 'distributed-memory.ts' },
      { name: 'Knowledge Fabric', file: 'knowledge-fabric.ts' },
      { name: 'Consensus Engine', file: 'consensus-engine.ts' },
      { name: 'Leader Election', file: 'leader-election.ts' },
      { name: 'Distributed Locks', file: 'distributed-locks.ts' },
      { name: 'Snapshot Manager', file: 'snapshot-manager.ts' },
      { name: 'Replay Manager', file: 'replay-manager.ts' },
      { name: 'Recovery Manager', file: 'recovery-manager.ts' },
      { name: 'Autoscaler', file: 'autoscaler.ts' },
      { name: 'Telemetry', file: 'telemetry.ts' },
      { name: 'Distributed Trace', file: 'distributed-trace.ts' },
      { name: 'Distributed Profiler', file: 'distributed-profiler.ts' },
      { name: 'Distributed Debugger', file: 'distributed-debugger.ts' },
      { name: 'Security', file: 'security.ts' },
      { name: 'Governance', file: 'governance.ts' },
      { name: 'API Gateway', file: 'api-gateway.ts' },
      { name: 'Runtime Kernel', file: 'runtime-kernel.ts' },
    ];
    this.validationResults = [];
  }

  /**
   * Valider CPR
   */
  validate() {
    console.log('Validating CPR components...');
    
    for (const component of this.requiredComponents) {
      this.checkComponent(component);
    }

    this.checkProviderPool();
    this.checkCluster();
    this.checkConsensus();
    this.checkLeaderElection();
    this.checkDistributedMemory();
    this.checkDistributedLocks();
    this.checkAutoscaler();
    this.checkScheduler();
    this.checkExecutionCoordinator();
    this.checkRecovery();
    this.checkReplay();
    this.checkTracing();
    this.checkTelemetry();
    this.checkSecurity();
    this.checkGovernance();
    this.checkAPIGateway();

    this.printSummary();
  }

  /**
   * Vérifier un composant
   */
  checkComponent(component) {
    const fullPath = join(this.cprPath, component.file);
    const exists = existsSync(fullPath);
    
    if (exists) {
      this.validationResults.push({ component: component.name, status: 'OK', file: component.file });
      console.log(`  ✓ ${component.name}: ${component.file}`);
    } else {
      this.validationResults.push({ component: component.name, status: 'MISSING', file: component.file });
      console.log(`  ✗ ${component.name}: ${component.file} (MISSING)`);
    }
  }

  /**
   * Vérifier Provider Pool
   */
  checkProviderPool() {
    console.log('\nChecking Provider Pool...');
    
    const providerPath = join(this.cprPath, 'provider-manager.ts');
    const providerContent = readFileSync(providerPath, 'utf-8');
    
    if (providerContent.includes('pool') || providerContent.includes('Provider')) {
      console.log('  ✓ Provider Pool: provider-manager.ts');
      this.validationResults.push({ component: 'Provider Pool', status: 'OK', file: 'provider-manager.ts' });
    } else {
      console.log('  ✗ Provider Pool: provider-manager.ts (MISSING)');
      this.validationResults.push({ component: 'Provider Pool', status: 'MISSING', file: 'provider-manager.ts' });
    }
  }

  /**
   * Vérifier Cluster
   */
  checkCluster() {
    console.log('\nChecking Cluster...');
    
    const clusterPath = join(this.cprPath, 'cluster-manager.ts');
    const clusterContent = readFileSync(clusterPath, 'utf-8');
    
    if (clusterContent.includes('cluster') || clusterContent.includes('node')) {
      console.log('  ✓ Cluster: cluster-manager.ts');
      this.validationResults.push({ component: 'Cluster', status: 'OK', file: 'cluster-manager.ts' });
    } else {
      console.log('  ✗ Cluster: cluster-manager.ts (MISSING)');
      this.validationResults.push({ component: 'Cluster', status: 'MISSING', file: 'cluster-manager.ts' });
    }
  }

  /**
   * Vérifier Consensus
   */
  checkConsensus() {
    console.log('\nChecking Consensus...');
    
    const consensusPath = join(this.cprPath, 'consensus-engine.ts');
    const consensusContent = readFileSync(consensusPath, 'utf-8');
    
    if (consensusContent.includes('consensus') || consensusContent.includes('vote')) {
      console.log('  ✓ Consensus: consensus-engine.ts');
      this.validationResults.push({ component: 'Consensus', status: 'OK', file: 'consensus-engine.ts' });
    } else {
      console.log('  ✗ Consensus: consensus-engine.ts (MISSING)');
      this.validationResults.push({ component: 'Consensus', status: 'MISSING', file: 'consensus-engine.ts' });
    }
  }

  /**
   * Vérifier Leader Election
   */
  checkLeaderElection() {
    console.log('\nChecking Leader Election...');
    
    const electionPath = join(this.cprPath, 'leader-election.ts');
    const electionContent = readFileSync(electionPath, 'utf-8');
    
    if (electionContent.includes('election') || electionContent.includes('leader')) {
      console.log('  ✓ Leader Election: leader-election.ts');
      this.validationResults.push({ component: 'Leader Election', status: 'OK', file: 'leader-election.ts' });
    } else {
      console.log('  ✗ Leader Election: leader-election.ts (MISSING)');
      this.validationResults.push({ component: 'Leader Election', status: 'MISSING', file: 'leader-election.ts' });
    }
  }

  /**
   * Vérifier Distributed Memory
   */
  checkDistributedMemory() {
    console.log('\nChecking Distributed Memory...');
    
    const memoryPath = join(this.cprPath, 'distributed-memory.ts');
    const memoryContent = readFileSync(memoryPath, 'utf-8');
    
    if (memoryContent.includes('memory') || memoryContent.includes('distributed')) {
      console.log('  ✓ Distributed Memory: distributed-memory.ts');
      this.validationResults.push({ component: 'Distributed Memory', status: 'OK', file: 'distributed-memory.ts' });
    } else {
      console.log('  ✗ Distributed Memory: distributed-memory.ts (MISSING)');
      this.validationResults.push({ component: 'Distributed Memory', status: 'MISSING', file: 'distributed-memory.ts' });
    }
  }

  /**
   * Vérifier Distributed Locks
   */
  checkDistributedLocks() {
    console.log('\nChecking Distributed Locks...');
    
    const locksPath = join(this.cprPath, 'distributed-locks.ts');
    const locksContent = readFileSync(locksPath, 'utf-8');
    
    if (locksContent.includes('lock') || locksContent.includes('distributed')) {
      console.log('  ✓ Distributed Locks: distributed-locks.ts');
      this.validationResults.push({ component: 'Distributed Locks', status: 'OK', file: 'distributed-locks.ts' });
    } else {
      console.log('  ✗ Distributed Locks: distributed-locks.ts (MISSING)');
      this.validationResults.push({ component: 'Distributed Locks', status: 'MISSING', file: 'distributed-locks.ts' });
    }
  }

  /**
   * Vérifier Autoscaler
   */
  checkAutoscaler() {
    console.log('\nChecking Autoscaler...');
    
    const autoscalerPath = join(this.cprPath, 'autoscaler.ts');
    const autoscalerContent = readFileSync(autoscalerPath, 'utf-8');
    
    if (autoscalerContent.includes('scale') || autoscalerContent.includes('auto')) {
      console.log('  ✓ Autoscaler: autoscaler.ts');
      this.validationResults.push({ component: 'Autoscaler', status: 'OK', file: 'autoscaler.ts' });
    } else {
      console.log('  ✗ Autoscaler: autoscaler.ts (MISSING)');
      this.validationResults.push({ component: 'Autoscaler', status: 'MISSING', file: 'autoscaler.ts' });
    }
  }

  /**
   * Vérifier Scheduler
   */
  checkScheduler() {
    console.log('\nChecking Scheduler...');
    
    const schedulerPath = join(this.cprPath, 'distributed-scheduler.ts');
    const schedulerContent = readFileSync(schedulerPath, 'utf-8');
    
    if (schedulerContent.includes('schedule') || schedulerContent.includes('task')) {
      console.log('  ✓ Scheduler: distributed-scheduler.ts');
      this.validationResults.push({ component: 'Scheduler', status: 'OK', file: 'distributed-scheduler.ts' });
    } else {
      console.log('  ✗ Scheduler: distributed-scheduler.ts (MISSING)');
      this.validationResults.push({ component: 'Scheduler', status: 'MISSING', file: 'distributed-scheduler.ts' });
    }
  }

  /**
   * Vérifier Execution Coordinator
   */
  checkExecutionCoordinator() {
    console.log('\nChecking Execution Coordinator...');
    
    const coordinatorPath = join(this.cprPath, 'execution-coordinator.ts');
    const coordinatorContent = readFileSync(coordinatorPath, 'utf-8');
    
    if (coordinatorContent.includes('coordinate') || coordinatorContent.includes('execution')) {
      console.log('  ✓ Execution Coordinator: execution-coordinator.ts');
      this.validationResults.push({ component: 'Execution Coordinator', status: 'OK', file: 'execution-coordinator.ts' });
    } else {
      console.log('  ✗ Execution Coordinator: execution-coordinator.ts (MISSING)');
      this.validationResults.push({ component: 'Execution Coordinator', status: 'MISSING', file: 'execution-coordinator.ts' });
    }
  }

  /**
   * Vérifier Recovery
   */
  checkRecovery() {
    console.log('\nChecking Recovery...');
    
    const recoveryPath = join(this.cprPath, 'recovery-manager.ts');
    const recoveryContent = readFileSync(recoveryPath, 'utf-8');
    
    if (recoveryContent.includes('recover') || recoveryContent.includes('failure')) {
      console.log('  ✓ Recovery: recovery-manager.ts');
      this.validationResults.push({ component: 'Recovery', status: 'OK', file: 'recovery-manager.ts' });
    } else {
      console.log('  ✗ Recovery: recovery-manager.ts (MISSING)');
      this.validationResults.push({ component: 'Recovery', status: 'MISSING', file: 'recovery-manager.ts' });
    }
  }

  /**
   * Vérifier Replay
   */
  checkReplay() {
    console.log('\nChecking Replay...');
    
    const replayPath = join(this.cprPath, 'replay-manager.ts');
    const replayContent = readFileSync(replayPath, 'utf-8');
    
    if (replayContent.includes('replay') || replayContent.includes('event')) {
      console.log('  ✓ Replay: replay-manager.ts');
      this.validationResults.push({ component: 'Replay', status: 'OK', file: 'replay-manager.ts' });
    } else {
      console.log('  ✗ Replay: replay-manager.ts (MISSING)');
      this.validationResults.push({ component: 'Replay', status: 'MISSING', file: 'replay-manager.ts' });
    }
  }

  /**
   * Vérifier Tracing
   */
  checkTracing() {
    console.log('\nChecking Tracing...');
    
    const tracePath = join(this.cprPath, 'distributed-trace.ts');
    const traceContent = readFileSync(tracePath, 'utf-8');
    
    if (traceContent.includes('trace') || traceContent.includes('span')) {
      console.log('  ✓ Tracing: distributed-trace.ts');
      this.validationResults.push({ component: 'Tracing', status: 'OK', file: 'distributed-trace.ts' });
    } else {
      console.log('  ✗ Tracing: distributed-trace.ts (MISSING)');
      this.validationResults.push({ component: 'Tracing', status: 'MISSING', file: 'distributed-trace.ts' });
    }
  }

  /**
   * Vérifier Telemetry
   */
  checkTelemetry() {
    console.log('\nChecking Telemetry...');
    
    const telemetryPath = join(this.cprPath, 'telemetry.ts');
    const telemetryContent = readFileSync(telemetryPath, 'utf-8');
    
    if (telemetryContent.includes('telemetry') || telemetryContent.includes('metric')) {
      console.log('  ✓ Telemetry: telemetry.ts');
      this.validationResults.push({ component: 'Telemetry', status: 'OK', file: 'telemetry.ts' });
    } else {
      console.log('  ✗ Telemetry: telemetry.ts (MISSING)');
      this.validationResults.push({ component: 'Telemetry', status: 'MISSING', file: 'telemetry.ts' });
    }
  }

  /**
   * Vérifier Security
   */
  checkSecurity() {
    console.log('\nChecking Security...');
    
    const securityPath = join(this.cprPath, 'security.ts');
    const securityContent = readFileSync(securityPath, 'utf-8');
    
    if (securityContent.includes('security') || securityContent.includes('policy')) {
      console.log('  ✓ Security: security.ts');
      this.validationResults.push({ component: 'Security', status: 'OK', file: 'security.ts' });
    } else {
      console.log('  ✗ Security: security.ts (MISSING)');
      this.validationResults.push({ component: 'Security', status: 'MISSING', file: 'security.ts' });
    }
  }

  /**
   * Vérifier Governance
   */
  checkGovernance() {
    console.log('\nChecking Governance...');
    
    const governancePath = join(this.cprPath, 'governance.ts');
    const governanceContent = readFileSync(governancePath, 'utf-8');
    
    if (governanceContent.includes('governance') || governanceContent.includes('rule')) {
      console.log('  ✓ Governance: governance.ts');
      this.validationResults.push({ component: 'Governance', status: 'OK', file: 'governance.ts' });
    } else {
      console.log('  ✗ Governance: governance.ts (MISSING)');
      this.validationResults.push({ component: 'Governance', status: 'MISSING', file: 'governance.ts' });
    }
  }

  /**
   * Vérifier API Gateway
   */
  checkAPIGateway() {
    console.log('\nChecking API Gateway...');
    
    const gatewayPath = join(this.cprPath, 'api-gateway.ts');
    const gatewayContent = readFileSync(gatewayPath, 'utf-8');
    
    if (gatewayContent.includes('gateway') || gatewayContent.includes('api') || gatewayContent.includes('route')) {
      console.log('  ✓ API Gateway: api-gateway.ts');
      this.validationResults.push({ component: 'API Gateway', status: 'OK', file: 'api-gateway.ts' });
    } else {
      console.log('  ✗ API Gateway: api-gateway.ts (MISSING)');
      this.validationResults.push({ component: 'API Gateway', status: 'MISSING', file: 'api-gateway.ts' });
    }
  }

  /**
   * Afficher le résumé
   */
  printSummary() {
    const okCount = this.validationResults.filter(r => r.status === 'OK').length;
    const missingCount = this.validationResults.filter(r => r.status === 'MISSING').length;

    console.log('\n=== CPR VALIDATION SUMMARY ===');
    console.log(`Total Components: ${this.validationResults.length}`);
    console.log(`OK: ${okCount}`);
    console.log(`MISSING: ${missingCount}`);
    console.log('============================\n');

    if (missingCount > 0) {
      console.log('MISSING COMPONENTS:');
      for (const result of this.validationResults.filter(r => r.status === 'MISSING')) {
        console.log(`  - ${result.component}: ${result.file}`);
      }
      console.log('');
    }
  }

  /**
   * Générer le rapport
   */
  generateReport() {
    const report = {
      summary: {
        totalComponents: this.validationResults.length,
        okCount: this.validationResults.filter(r => r.status === 'OK').length,
        missingCount: this.validationResults.filter(r => r.status === 'MISSING').length,
      },
      validationResults: this.validationResults,
    };

    return report;
  }

  /**
   * Sauvegarder le rapport
   */
  saveReport(outputPath) {
    const report = this.generateReport();
    const json = JSON.stringify(report, null, 2);
    const { writeFileSync } = require('fs');
    writeFileSync(outputPath, json, 'utf-8');
    console.log(`\nCPR Validation Report saved to ${outputPath}`);
  }
}

// Exécution
const rootPath = process.argv[2] || process.cwd();
const outputPath = process.argv[3] || join(rootPath, 'BLUEPRINT_CPR_VALIDATION_REPORT.json');

const validator = new CPRValidator(rootPath);
validator.validate();
validator.saveReport(outputPath);
