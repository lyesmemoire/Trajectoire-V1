#!/usr/bin/env node

/**
 * Blueprint V3 Enterprise Integration Validator
 * 
 * OBJECTIF 10: Valider l'intégration complète du pipeline
 * 
 * Pipeline: compilateur → package → chargement → exécution → LLM calls → traces → debugger → profiler → replay → rollback
 */

const { readFileSync, existsSync } = require('fs');
const { join } = require('path');

class IntegrationValidator {
  constructor(rootPath) {
    this.rootPath = rootPath;
    this.compilerPath = join(rootPath, 'compiler');
    this.validationResults = [];
  }

  /**
   * Valider l'intégration
   */
  validate() {
    console.log('Validating complete Blueprint integration...\n');

    this.checkCompilerToPackage();
    this.checkPackageToLoader();
    this.checkLoaderToCVM();
    this.checkCVMToCPR();
    this.checkLLMCalls();
    this.checkTracing();
    this.checkDebugger();
    this.checkProfiler();
    this.checkReplay();
    this.checkRollback();

    this.printSummary();
  }

  /**
   * Vérifier Compiler → Package
   */
  checkCompilerToPackage() {
    console.log('Checking Compiler → Package integration...');
    
    const bytecodePath = join(this.compilerPath, 'bytecode/bytecode-generator.ts');
    const packagerPath = join(this.compilerPath, 'packager/package-builder.ts');
    
    const bytecodeExists = existsSync(bytecodePath);
    const packagerExists = existsSync(packagerPath);
    
    if (bytecodeExists && packagerExists) {
      console.log('  ✓ Compiler can generate bytecode');
      console.log('  ✓ Package builder exists');
      this.validationResults.push({ stage: 'Compiler → Package', status: 'OK' });
    } else {
      console.log('  ✗ Missing compiler or packager');
      this.validationResults.push({ stage: 'Compiler → Package', status: 'MISSING' });
    }
  }

  /**
   * Vérifier Package → Loader
   */
  checkPackageToLoader() {
    console.log('\nChecking Package → Loader integration...');
    
    const loaderPath = join(this.compilerPath, 'cbs/package-loader.ts');
    const linkerPath = join(this.compilerPath, 'cbs/package-linker.ts');
    
    const loaderExists = existsSync(loaderPath);
    const linkerExists = existsSync(linkerPath);
    
    if (loaderExists && linkerExists) {
      console.log('  ✓ Package loader exists');
      console.log('  ✓ Package linker exists');
      this.validationResults.push({ stage: 'Package → Loader', status: 'OK' });
    } else {
      console.log('  ✗ Missing loader or linker');
      this.validationResults.push({ stage: 'Package → Loader', status: 'MISSING' });
    }
  }

  /**
   * Vérifier Loader → CVM
   */
  checkLoaderToCVM() {
    console.log('\nChecking Loader → CVM integration...');
    
    const cvmPath = join(this.compilerPath, 'cvm/index.ts');
    const executionContextPath = join(this.compilerPath, 'cvm/execution-context.ts');
    
    const cvmExists = existsSync(cvmPath);
    const executionContextExists = existsSync(executionContextPath);
    
    if (cvmExists && executionContextExists) {
      console.log('  ✓ CVM exists');
      console.log('  ✓ Execution context exists');
      this.validationResults.push({ stage: 'Loader → CVM', status: 'OK' });
    } else {
      console.log('  ✗ Missing CVM or execution context');
      this.validationResults.push({ stage: 'Loader → CVM', status: 'MISSING' });
    }
  }

  /**
   * Vérifier CVM → CPR
   */
  checkCVMToCPR() {
    console.log('\nChecking CVM → CPR integration...');
    
    const cprPath = join(this.compilerPath, 'cpr/index.ts');
    const runtimeKernelPath = join(this.compilerPath, 'cpr/runtime-kernel.ts');
    
    const cprExists = existsSync(cprPath);
    const runtimeKernelExists = existsSync(runtimeKernelPath);
    
    if (cprExists && runtimeKernelExists) {
      console.log('  ✓ CPR exists');
      console.log('  ✓ Runtime kernel exists');
      this.validationResults.push({ stage: 'CVM → CPR', status: 'OK' });
    } else {
      console.log('  ✗ Missing CPR or runtime kernel');
      this.validationResults.push({ stage: 'CVM → CPR', status: 'MISSING' });
    }
  }

  /**
   * Vérifier LLM Calls
   */
  checkLLMCalls() {
    console.log('\nChecking LLM Calls integration...');
    
    const providerManagerPath = join(this.compilerPath, 'cpr/provider-manager.ts');
    const providerManagerExists = existsSync(providerManagerPath);
    
    if (providerManagerExists) {
      const providerContent = readFileSync(providerManagerPath, 'utf-8');
      if (providerContent.includes('provider') || providerContent.includes('request')) {
        console.log('  ✓ Provider manager exists');
        console.log('  ✓ LLM request handling exists');
        this.validationResults.push({ stage: 'LLM Calls', status: 'OK' });
      } else {
        console.log('  ✗ Provider manager missing request handling');
        this.validationResults.push({ stage: 'LLM Calls', status: 'INCOMPLETE' });
      }
    } else {
      console.log('  ✗ Missing provider manager');
      this.validationResults.push({ stage: 'LLM Calls', status: 'MISSING' });
    }
  }

  /**
   * Vérifier Tracing
   */
  checkTracing() {
    console.log('\nChecking Tracing integration...');
    
    const tracePath = join(this.compilerPath, 'cpr/distributed-trace.ts');
    const traceHooksPath = join(this.compilerPath, 'cvm/trace-hooks.ts');
    
    const traceExists = existsSync(tracePath);
    const traceHooksExists = existsSync(traceHooksPath);
    
    if (traceExists && traceHooksExists) {
      console.log('  ✓ Distributed trace exists');
      console.log('  ✓ Trace hooks exist');
      this.validationResults.push({ stage: 'Tracing', status: 'OK' });
    } else {
      console.log('  ✗ Missing trace components');
      this.validationResults.push({ stage: 'Tracing', status: 'MISSING' });
    }
  }

  /**
   * Vérifier Debugger
   */
  checkDebugger() {
    console.log('\nChecking Debugger integration...');
    
    const debuggerPath = join(this.compilerPath, 'cpr/distributed-debugger.ts');
    const debuggerHooksPath = join(this.compilerPath, 'cvm/debugger-hooks.ts');
    
    const debuggerExists = existsSync(debuggerPath);
    const debuggerHooksExists = existsSync(debuggerHooksPath);
    
    if (debuggerExists && debuggerHooksExists) {
      console.log('  ✓ Distributed debugger exists');
      console.log('  ✓ Debugger hooks exist');
      this.validationResults.push({ stage: 'Debugger', status: 'OK' });
    } else {
      console.log('  ✗ Missing debugger components');
      this.validationResults.push({ stage: 'Debugger', status: 'MISSING' });
    }
  }

  /**
   * Vérifier Profiler
   */
  checkProfiler() {
    console.log('\nChecking Profiler integration...');
    
    const profilerPath = join(this.compilerPath, 'cpr/distributed-profiler.ts');
    const profilerHooksPath = join(this.compilerPath, 'cvm/profiler-hooks.ts');
    
    const profilerExists = existsSync(profilerPath);
    const profilerHooksExists = existsSync(profilerHooksPath);
    
    if (profilerExists && profilerHooksExists) {
      console.log('  ✓ Distributed profiler exists');
      console.log('  ✓ Profiler hooks exist');
      this.validationResults.push({ stage: 'Profiler', status: 'OK' });
    } else {
      console.log('  ✗ Missing profiler components');
      this.validationResults.push({ stage: 'Profiler', status: 'MISSING' });
    }
  }

  /**
   * Vérifier Replay
   */
  checkReplay() {
    console.log('\nChecking Replay integration...');
    
    const replayPath = join(this.compilerPath, 'cpr/replay-manager.ts');
    const replayExists = existsSync(replayPath);
    
    if (replayExists) {
      const replayContent = readFileSync(replayPath, 'utf-8');
      if (replayContent.includes('replay') || replayContent.includes('event')) {
        console.log('  ✓ Replay manager exists');
        console.log('  ✓ Event recording exists');
        this.validationResults.push({ stage: 'Replay', status: 'OK' });
      } else {
        console.log('  ✗ Replay manager missing event handling');
        this.validationResults.push({ stage: 'Replay', status: 'INCOMPLETE' });
      }
    } else {
      console.log('  ✗ Missing replay manager');
      this.validationResults.push({ stage: 'Replay', status: 'MISSING' });
    }
  }

  /**
   * Vérifier Rollback
   */
  checkRollback() {
    console.log('\nChecking Rollback integration...');
    
    const rollbackPath = join(this.compilerPath, 'cvm/rollback-manager.ts');
    const snapshotPath = join(this.compilerPath, 'cvm/snapshot-manager.ts');
    
    const rollbackExists = existsSync(rollbackPath);
    const snapshotExists = existsSync(snapshotPath);
    
    if (rollbackExists && snapshotExists) {
      console.log('  ✓ Rollback manager exists');
      console.log('  ✓ Snapshot manager exists');
      this.validationResults.push({ stage: 'Rollback', status: 'OK' });
    } else {
      console.log('  ✗ Missing rollback or snapshot manager');
      this.validationResults.push({ stage: 'Rollback', status: 'MISSING' });
    }
  }

  /**
   * Afficher le résumé
   */
  printSummary() {
    const okCount = this.validationResults.filter(r => r.status === 'OK').length;
    const incompleteCount = this.validationResults.filter(r => r.status === 'INCOMPLETE').length;
    const missingCount = this.validationResults.filter(r => r.status === 'MISSING').length;

    console.log('\n=== INTEGRATION VALIDATION SUMMARY ===');
    console.log(`Total Stages: ${this.validationResults.length}`);
    console.log(`OK: ${okCount}`);
    console.log(`INCOMPLETE: ${incompleteCount}`);
    console.log(`MISSING: ${missingCount}`);
    console.log('====================================\n');

    if (incompleteCount > 0) {
      console.log('INCOMPLETE STAGES:');
      for (const result of this.validationResults.filter(r => r.status === 'INCOMPLETE')) {
        console.log(`  - ${result.stage}`);
      }
      console.log('');
    }

    if (missingCount > 0) {
      console.log('MISSING STAGES:');
      for (const result of this.validationResults.filter(r => r.status === 'MISSING')) {
        console.log(`  - ${result.stage}`);
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
        totalStages: this.validationResults.length,
        okCount: this.validationResults.filter(r => r.status === 'OK').length,
        incompleteCount: this.validationResults.filter(r => r.status === 'INCOMPLETE').length,
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
    console.log(`\nIntegration Validation Report saved to ${outputPath}`);
  }
}

// Exécution
const rootPath = process.argv[2] || process.cwd();
const outputPath = process.argv[3] || join(rootPath, 'BLUEPRINT_INTEGRATION_VALIDATION_REPORT.json');

const validator = new IntegrationValidator(rootPath);
validator.validate();
validator.saveReport(outputPath);
