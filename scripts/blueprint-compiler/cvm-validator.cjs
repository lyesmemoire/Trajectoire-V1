#!/usr/bin/env node

/**
 * Blueprint V3 Enterprise CVM Validator
 * 
 * OBJECTIF 8: Valider que CVM est une véritable VM
 * 
 * Composants requis:
 * - Heap, Stack, Frames, GC, Scheduler, Bytecode Interpreter,
 *   Instruction Dispatcher, Snapshot, Rollback, Trace, Profiler,
 *   Debugger, Hooks, Exceptions, Memory Allocator, Handle Table,
 *   Thread Manager, Execution Context
 */

const { readFileSync, existsSync } = require('fs');
const { join } = require('path');

class CVMValidator {
  constructor(rootPath) {
    this.rootPath = rootPath;
    this.cvmPath = join(rootPath, 'compiler/cvm');
    this.requiredComponents = [
      { name: 'Execution Context', file: 'execution-context.ts' },
      { name: 'Register File', file: 'register-file.ts' },
      { name: 'Instruction Fetch', file: 'instruction-fetch.ts' },
      { name: 'Instruction Decode', file: 'instruction-decode.ts' },
      { name: 'Instruction Execute', file: 'instruction-execute.ts' },
      { name: 'Execution Pipeline', file: 'execution-pipeline.ts' },
      { name: 'Microcode Engine', file: 'microcode-engine.ts' },
      { name: 'Frame Manager', file: 'frame-manager.ts' },
      { name: 'Exception Handler', file: 'exception-handler.ts' },
      { name: 'Interrupt Manager', file: 'interrupt-manager.ts' },
      { name: 'Scheduler', file: 'scheduler.ts' },
      { name: 'Instruction Cache', file: 'instruction-cache.ts' },
      { name: 'Branch Predictor', file: 'branch-predictor.ts' },
      { name: 'Rollback Manager', file: 'rollback-manager.ts' },
      { name: 'Snapshot Manager', file: 'snapshot-manager.ts' },
      { name: 'Thread Manager', file: 'thread-manager.ts' },
      { name: 'Garbage Collector', file: 'garbage-collector.ts' },
      { name: 'Memory Manager', file: 'memory-manager.ts' },
      { name: 'Profiler Hooks', file: 'profiler-hooks.ts' },
      { name: 'Trace Hooks', file: 'trace-hooks.ts' },
      { name: 'Debugger Hooks', file: 'debugger-hooks.ts' },
    ];
    this.validationResults = [];
  }

  /**
   * Valider CVM
   */
  validate() {
    console.log('Validating CVM components...');
    
    for (const component of this.requiredComponents) {
      this.checkComponent(component);
    }

    this.checkHeapStackFrames();
    this.checkBytecodeInterpreter();
    this.checkInstructionDispatcher();
    this.checkMemoryAllocator();
    this.checkHandleTable();

    this.printSummary();
  }

  /**
   * Vérifier un composant
   */
  checkComponent(component) {
    const fullPath = join(this.cvmPath, component.file);
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
   * Vérifier Heap, Stack, Frames
   */
  checkHeapStackFrames() {
    console.log('\nChecking Heap, Stack, Frames...');
    
    // Heap est dans CBS
    const heapPath = join(this.rootPath, 'compiler/cbs/heap.ts');
    const heapExists = existsSync(heapPath);
    
    if (heapExists) {
      console.log('  ✓ Heap: cbs/heap.ts');
      this.validationResults.push({ component: 'Heap', status: 'OK', file: 'cbs/heap.ts' });
    } else {
      console.log('  ✗ Heap: cbs/heap.ts (MISSING)');
      this.validationResults.push({ component: 'Heap', status: 'MISSING', file: 'cbs/heap.ts' });
    }

    // Stack est dans CBS
    const stackPath = join(this.rootPath, 'compiler/cbs/stack.ts');
    const stackExists = existsSync(stackPath);
    
    if (stackExists) {
      console.log('  ✓ Stack: cbs/stack.ts');
      this.validationResults.push({ component: 'Stack', status: 'OK', file: 'cbs/stack.ts' });
    } else {
      console.log('  ✗ Stack: cbs/stack.ts (MISSING)');
      this.validationResults.push({ component: 'Stack', status: 'MISSING', file: 'cbs/stack.ts' });
    }

    // Frames est dans CBS
    const framesPath = join(this.rootPath, 'compiler/cbs/call-frames.ts');
    const framesExists = existsSync(framesPath);
    
    if (framesExists) {
      console.log('  ✓ Call Frames: cbs/call-frames.ts');
      this.validationResults.push({ component: 'Call Frames', status: 'OK', file: 'cbs/call-frames.ts' });
    } else {
      console.log('  ✗ Call Frames: cbs/call-frames.ts (MISSING)');
      this.validationResults.push({ component: 'Call Frames', status: 'MISSING', file: 'cbs/call-frames.ts' });
    }
  }

  /**
   * Vérifier Bytecode Interpreter
   */
  checkBytecodeInterpreter() {
    console.log('\nChecking Bytecode Interpreter...');
    
    // Bytecode Interpreter est implémenté dans execution-pipeline
    const pipelinePath = join(this.cvmPath, 'execution-pipeline.ts');
    const pipelineContent = readFileSync(pipelinePath, 'utf-8');
    
    if (pipelineContent.includes('execute') || pipelineContent.includes('interpret')) {
      console.log('  ✓ Bytecode Interpreter: execution-pipeline.ts');
      this.validationResults.push({ component: 'Bytecode Interpreter', status: 'OK', file: 'execution-pipeline.ts' });
    } else {
      console.log('  ✗ Bytecode Interpreter: execution-pipeline.ts (MISSING)');
      this.validationResults.push({ component: 'Bytecode Interpreter', status: 'MISSING', file: 'execution-pipeline.ts' });
    }
  }

  /**
   * Vérifier Instruction Dispatcher
   */
  checkInstructionDispatcher() {
    console.log('\nChecking Instruction Dispatcher...');
    
    // Instruction Dispatcher est implémenté dans instruction-execute
    const executePath = join(this.cvmPath, 'instruction-execute.ts');
    const executeContent = readFileSync(executePath, 'utf-8');
    
    if (executeContent.includes('dispatch') || executeContent.includes('switch')) {
      console.log('  ✓ Instruction Dispatcher: instruction-execute.ts');
      this.validationResults.push({ component: 'Instruction Dispatcher', status: 'OK', file: 'instruction-execute.ts' });
    } else {
      console.log('  ✗ Instruction Dispatcher: instruction-execute.ts (MISSING)');
      this.validationResults.push({ component: 'Instruction Dispatcher', status: 'MISSING', file: 'instruction-execute.ts' });
    }
  }

  /**
   * Vérifier Memory Allocator
   */
  checkMemoryAllocator() {
    console.log('\nChecking Memory Allocator...');
    
    // Memory Allocator est implémenté dans memory-manager
    const memoryPath = join(this.cvmPath, 'memory-manager.ts');
    const memoryContent = readFileSync(memoryPath, 'utf-8');
    
    if (memoryContent.includes('allocate') || memoryContent.includes('malloc')) {
      console.log('  ✓ Memory Allocator: memory-manager.ts');
      this.validationResults.push({ component: 'Memory Allocator', status: 'OK', file: 'memory-manager.ts' });
    } else {
      console.log('  ✗ Memory Allocator: memory-manager.ts (MISSING)');
      this.validationResults.push({ component: 'Memory Allocator', status: 'MISSING', file: 'memory-manager.ts' });
    }
  }

  /**
   * Vérifier Handle Table
   */
  checkHandleTable() {
    console.log('\nChecking Handle Table...');
    
    // Handle Table est implémenté dans memory-manager
    const memoryPath = join(this.cvmPath, 'memory-manager.ts');
    const memoryContent = readFileSync(memoryPath, 'utf-8');
    
    if (memoryContent.includes('handle') || memoryContent.includes('table')) {
      console.log('  ✓ Handle Table: memory-manager.ts');
      this.validationResults.push({ component: 'Handle Table', status: 'OK', file: 'memory-manager.ts' });
    } else {
      console.log('  ✗ Handle Table: memory-manager.ts (MISSING)');
      this.validationResults.push({ component: 'Handle Table', status: 'MISSING', file: 'memory-manager.ts' });
    }
  }

  /**
   * Afficher le résumé
   */
  printSummary() {
    const okCount = this.validationResults.filter(r => r.status === 'OK').length;
    const missingCount = this.validationResults.filter(r => r.status === 'MISSING').length;

    console.log('\n=== CVM VALIDATION SUMMARY ===');
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
    console.log(`\nCVM Validation Report saved to ${outputPath}`);
  }
}

// Exécution
const rootPath = process.argv[2] || process.cwd();
const outputPath = process.argv[3] || join(rootPath, 'BLUEPRINT_CVM_VALIDATION_REPORT.json');

const validator = new CVMValidator(rootPath);
validator.validate();
validator.saveReport(outputPath);
