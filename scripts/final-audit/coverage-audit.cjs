#!/usr/bin/env node

/**
 * Blueprint V3 Enterprise Coverage Audit
 * PHASE 6: Coverage
 */

const { execSync } = require('child_process');
const { writeFileSync, existsSync, mkdirSync } = require('fs');
const { join } = require('path');

class CoverageAuditor {
  constructor(rootPath) {
    this.rootPath = rootPath;
    this.report = {
      timestamp: new Date().toISOString(),
      commands: [],
      elapsedTimes: {},
      coverage: {
        statements: 0,
        branches: 0,
        functions: 0,
        lines: 0,
      },
      errors: [],
      success: false,
      exitCode: 0,
    };
  }

  /**
   * Exécuter la génération de coverage
   */
  async coverage() {
    console.log('Starting coverage audit...\n');

    try {
      // Exécuter la génération de coverage
      console.log('Running coverage...');
      const startTime = Date.now();
      this.report.commands.push('pnpm test:coverage');
      
      try {
        const output = this.exec('pnpm test:coverage', { stdio: 'pipe' });
        this.report.elapsedTimes.coverage = Date.now() - startTime;
        console.log(`Coverage completed in ${this.report.elapsedTimes.coverage}ms`);
        console.log(output);
        
        // Parser les résultats de coverage
        this.parseCoverageOutput(output);
        this.report.success = true;
        this.report.exitCode = 0;
      } catch (error) {
        this.report.errors.push(`Coverage failed: ${error.message}`);
        this.report.exitCode = 1;
        console.log(`Coverage failed: ${error.message}`);
        
        // Parser les résultats même en cas d'échec
        this.parseCoverageOutput(error.stdout || error.stderr || '');
      }

    } catch (error) {
      this.report.errors.push(`Coverage error: ${error.message}`);
      this.report.exitCode = 1;
      this.report.success = false;
    }

    this.saveReport();
    console.log('\nCoverage audit complete.');
    console.log(`Success: ${this.report.success}`);
    console.log(`Exit Code: ${this.report.exitCode}`);
    console.log(`Coverage: ${this.report.coverage.statements}% statements, ${this.report.coverage.branches}% branches, ${this.report.coverage.functions}% functions, ${this.report.coverage.lines}% lines`);
  }

  /**
   * Parser la sortie de coverage
   */
  parseCoverageOutput(output) {
    // Parser les résultats de Vitest coverage
    const statementsMatch = output.match(/statements?\s+(\d+\.?\d*)%/);
    const branchesMatch = output.match(/branches?\s+(\d+\.?\d*)%/);
    const functionsMatch = output.match(/functions?\s+(\d+\.?\d*)%/);
    const linesMatch = output.match(/lines?\s+(\d+\.?\d*)%/);
    
    if (statementsMatch) this.report.coverage.statements = parseFloat(statementsMatch[1]);
    if (branchesMatch) this.report.coverage.branches = parseFloat(branchesMatch[1]);
    if (functionsMatch) this.report.coverage.functions = parseFloat(functionsMatch[1]);
    if (linesMatch) this.report.coverage.lines = parseFloat(linesMatch[1]);
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
    
    const outputPath = join(outputDir, 'coverage-report.json');
    writeFileSync(outputPath, JSON.stringify(this.report, null, 2), 'utf-8');
    console.log(`\nReport saved to ${outputPath}`);
  }
}

// Exécution
const rootPath = process.argv[2] || process.cwd();
const auditor = new CoverageAuditor(rootPath);
auditor.coverage();
