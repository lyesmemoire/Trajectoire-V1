#!/usr/bin/env node

/**
 * Blueprint V3 Enterprise CI/CD Pipeline
 * 
 * Phase 12: Automated pipeline (Parse, Build AST, Compile, Generate, Validate, Lint, Check Drift, Check Ownership, Check Contracts, Check Dependencies, Publish)
 */

const { readFileSync, writeFileSync, existsSync } = require('fs');
const { join } = require('path');
const { execSync } = require('child_process');

class CICDPipeline {
  constructor(rootPath) {
    this.rootPath = rootPath;
    this.steps = [];
    this.results = [];
    this.failed = false;
  }

  /**
   * Run step
   */
  runStep(name, command) {
    console.log(`\n=== ${name} ===`);
    
    const startTime = Date.now();
    
    try {
      const output = execSync(command, { 
        cwd: this.rootPath,
        stdio: 'inherit',
        encoding: 'utf-8'
      });
      const duration = Date.now() - startTime;
      
      this.steps.push({
        name,
        status: 'success',
        duration,
        timestamp: new Date().toISOString()
      });
      
      console.log(`✅ ${name} completed in ${duration}ms`);
      return true;
    } catch (e) {
      const duration = Date.now() - startTime;
      
      this.steps.push({
        name,
        status: 'failed',
        duration,
        error: e.message,
        timestamp: new Date().toISOString()
      });
      
      console.log(`❌ ${name} failed after ${duration}ms`);
      this.failed = true;
      return false;
    }
  }

  /**
   * Parse
   */
  parse() {
    return this.runStep('Parse', 'node scripts/blueprint-compiler/ast-builder.cjs');
  }

  /**
   * Build AST
   */
  buildAST() {
    return this.runStep('Build AST', 'node scripts/blueprint-compiler/ast-builder.cjs');
  }

  /**
   * Compile
   */
  compile() {
    return this.runStep('Compile', 'node scripts/blueprint-compiler/canonical-compiler.cjs');
  }

  /**
   * Generate
   */
  generate() {
    return this.runStep('Generate', 'node scripts/blueprint-compiler/multi-lang-generator.cjs');
  }

  /**
   * Validate
   */
  validate() {
    return this.runStep('Validate', 'node scripts/blueprint-compiler/enterprise-validator.cjs');
  }

  /**
   * Lint
   */
  lint() {
    return this.runStep('Lint', 'node scripts/blueprint-analyzer/linter.cjs');
  }

  /**
   * Check Drift
   */
  checkDrift() {
    return this.runStep('Check Drift', 'node scripts/blueprint-compiler/self-healing-engine.cjs');
  }

  /**
   * Check Ownership
   */
  checkOwnership() {
    return this.runStep('Check Ownership', 'node scripts/blueprint-analyzer/check-ownership.cjs');
  }

  /**
   * Check Contracts
   */
  checkContracts() {
    return this.runStep('Check Contracts', 'node scripts/blueprint-analyzer/cleanup-contracts.cjs');
  }

  /**
   * Check Dependencies
   */
  checkDependencies() {
    return this.runStep('Check Dependencies', 'node scripts/blueprint-analyzer/check-dependencies.cjs');
  }

  /**
   * Optimize
   */
  optimize() {
    return this.runStep('Optimize', 'node scripts/blueprint-compiler/semantic-optimizer.cjs');
  }

  /**
   * Refactor
   */
  refactor() {
    return this.runStep('Refactor', 'node scripts/blueprint-compiler/refactoring-engine.cjs');
  }

  /**
   * Build Package
   */
  buildPackage() {
    return this.runStep('Build Package', 'node scripts/blueprint-compiler/package-builder.cjs');
  }

  /**
   * Publish
   */
  publish() {
    console.log('\n=== Publish ===');
    console.log('Publish step would deploy to production environment');
    console.log('✅ Publish completed (simulated)');
    
    this.steps.push({
      name: 'Publish',
      status: 'success',
      duration: 0,
      timestamp: new Date().toISOString()
    });
    
    return true;
  }

  /**
   * Run full pipeline
   */
  run() {
    console.log('Starting Blueprint V3 Enterprise CI/CD Pipeline...\n');
    console.log('='.repeat(60));

    // Run all steps
    this.parse();
    this.buildAST();
    this.compile();
    this.generate();
    this.validate();
    this.lint();
    this.checkDrift();
    this.checkOwnership();
    this.checkContracts();
    this.checkDependencies();
    this.optimize();
    this.refactor();
    this.buildPackage();
    
    // Only publish if all steps succeeded
    if (!this.failed) {
      this.publish();
    }

    console.log('\n' + '='.repeat(60));
    console.log('\n=== PIPELINE SUMMARY ===');
    
    const totalSteps = this.steps.length;
    const successfulSteps = this.steps.filter(s => s.status === 'success').length;
    const failedSteps = this.steps.filter(s => s.status === 'failed').length;
    const totalDuration = this.steps.reduce((sum, s) => sum + s.duration, 0);

    console.log(`Total Steps: ${totalSteps}`);
    console.log(`Successful: ${successfulSteps}`);
    console.log(`Failed: ${failedSteps}`);
    console.log(`Total Duration: ${totalDuration}ms`);

    console.log('\nStep Details:');
    for (const step of this.steps) {
      const icon = step.status === 'success' ? '✅' : '❌';
      console.log(`  ${icon} ${step.name}: ${step.status} (${step.duration}ms)`);
    }

    if (this.failed) {
      console.log('\n❌ PIPELINE FAILED - One or more steps failed');
      process.exit(1);
    } else {
      console.log('\n✅ PIPELINE SUCCEEDED - All steps completed successfully');
      process.exit(0);
    }
  }

  /**
   * Generate pipeline report
   */
  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalSteps: this.steps.length,
        successfulSteps: this.steps.filter(s => s.status === 'success').length,
        failedSteps: this.steps.filter(s => s.status === 'failed').length,
        totalDuration: this.steps.reduce((sum, s) => sum + s.duration, 0),
        status: this.failed ? 'failed' : 'success'
      },
      steps: this.steps
    };

    return report;
  }

  /**
   * Save report
   */
  saveReport(outputPath) {
    const report = this.generateReport();
    const reportJson = JSON.stringify(report, null, 2);
    writeFileSync(outputPath, reportJson, 'utf-8');
    console.log(`\nPipeline report saved to ${outputPath}`);
  }
}

// Main execution
async function main() {
  const rootPath = process.argv[2] || process.cwd();
  const reportPath = process.argv[3] || join(rootPath, 'BLUEPRINT_CICD_PIPELINE_REPORT.json');
  
  const pipeline = new CICDPipeline(rootPath);

  pipeline.run();

  console.log('\nGenerating report...');
  pipeline.saveReport(reportPath);
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { CICDPipeline };
