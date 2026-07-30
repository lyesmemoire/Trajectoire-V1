#!/usr/bin/env node

/**
 * Blueprint V3 Enterprise Test Audit
 * PHASE 5: Tests
 */

const { execSync } = require('child_process');
const { writeFileSync, existsSync, mkdirSync } = require('fs');
const { join } = require('path');

class TestAuditor {
  constructor(rootPath) {
    this.rootPath = rootPath;
    this.report = {
      timestamp: new Date().toISOString(),
      commands: [],
      testFramework: {},
      elapsedTimes: {},
      results: {
        passed: 0,
        failed: 0,
        skipped: 0,
        total: 0,
      },
      executionTime: 0,
      errors: [],
      success: false,
      exitCode: 0,
    };
  }

  /**
   * Exécuter les tests
   */
  async test() {
    console.log('Starting test audit...\n');

    try {
      // Exécuter les tests
      console.log('Running tests...');
      const startTime = Date.now();
      this.report.commands.push('pnpm test');
      
      try {
        const output = this.exec('pnpm test', { stdio: 'pipe' });
        this.report.elapsedTimes.test = Date.now() - startTime;
        console.log(`Tests completed in ${this.report.elapsedTimes.test}ms`);
        console.log(output);
        
        // Parser les résultats
        this.parseTestOutput(output);
        this.report.success = true;
        this.report.exitCode = 0;
      } catch (error) {
        this.report.errors.push(`Tests failed: ${error.message}`);
        this.report.exitCode = 1;
        console.log(`Tests failed: ${error.message}`);
        
        // Parser les résultats même en cas d'échec
        this.parseTestOutput(error.stdout || error.stderr || '');
      }

    } catch (error) {
      this.report.errors.push(`Test error: ${error.message}`);
      this.report.exitCode = 1;
      this.report.success = false;
    }

    this.saveReport();
    console.log('\nTest audit complete.');
    console.log(`Success: ${this.report.success}`);
    console.log(`Exit Code: ${this.report.exitCode}`);
    console.log(`Results: ${this.report.results.passed} passed, ${this.report.results.failed} failed, ${this.report.results.skipped} skipped`);
  }

  /**
   * Parser la sortie des tests
   */
  parseTestOutput(output) {
    // Parser les résultats de Vitest
    const passedMatch = output.match(/(\d+) passed/);
    const failedMatch = output.match(/(\d+) failed/);
    const skippedMatch = output.match(/(\d+) skipped/);
    
    if (passedMatch) this.report.results.passed = parseInt(passedMatch[1]);
    if (failedMatch) this.report.results.failed = parseInt(failedMatch[1]);
    if (skippedMatch) this.report.results.skipped = parseInt(skippedMatch[1]);
    
    this.report.results.total = this.report.results.passed + this.report.results.failed + this.report.results.skipped;
  }

  /**
   * Exécuter une commande
   */
  exec(command, options = {}) {
    try {
      const result = execSync(command, {
        cwd: this.rootPath,
        encoding: 'utf-8',
        ...options,
      });
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Sauvegarder le rapport
   */
  saveReport() {
    const outputDir = join(this.rootPath, 'reports/final');
    
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }
    
    const outputPath = join(outputDir, 'test-report.json');
    writeFileSync(outputPath, JSON.stringify(this.report, null, 2), 'utf-8');
    console.log(`\nReport saved to ${outputPath}`);
  }
}

// Exécution
const rootPath = process.argv[2] || process.cwd();
const auditor = new TestAuditor(rootPath);
auditor.test();
