#!/usr/bin/env node

/**
 * Blueprint V3 Enterprise Benchmark Audit
 * PHASE 7: Benchmark
 */

const { execSync } = require('child_process');
const { writeFileSync, existsSync, mkdirSync } = require('fs');
const { join } = require('path');

class BenchmarkAuditor {
  constructor(rootPath) {
    this.rootPath = rootPath;
    this.report = {
      timestamp: new Date().toISOString(),
      commands: [],
      elapsedTimes: {},
      benchmarks: [],
      errors: [],
      success: false,
      exitCode: 0,
    };
  }

  /**
   * Exécuter les benchmarks
   */
  async benchmark() {
    console.log('Starting benchmark audit...\n');

    try {
      // Vérifier si les benchmarks existent
      const benchmarksDir = join(this.rootPath, 'benchmarks');
      if (!existsSync(benchmarksDir)) {
        console.log('No benchmarks directory found - skipping benchmark execution');
        this.report.warnings = ['No benchmarks directory found'];
        this.report.success = true;
        this.report.exitCode = 0;
        this.saveReport();
        return;
      }

      // Exécuter les benchmarks
      console.log('Running benchmarks...');
      const startTime = Date.now();
      this.report.commands.push('pnpm benchmark');
      
      try {
        const output = this.exec('pnpm benchmark', { stdio: 'pipe' });
        this.report.elapsedTimes.benchmark = Date.now() - startTime;
        console.log(`Benchmarks completed in ${this.report.elapsedTimes.benchmark}ms`);
        console.log(output);
        
        // Parser les résultats de benchmarks
        this.parseBenchmarkOutput(output);
        this.report.success = true;
        this.report.exitCode = 0;
      } catch (error) {
        this.report.errors.push(`Benchmarks failed: ${error.message}`);
        this.report.exitCode = 1;
        console.log(`Benchmarks failed: ${error.message}`);
        
        // Parser les résultats même en cas d'échec
        this.parseBenchmarkOutput(error.stdout || error.stderr || '');
      }

    } catch (error) {
      this.report.errors.push(`Benchmark error: ${error.message}`);
      this.report.exitCode = 1;
      this.report.success = false;
    }

    this.saveReport();
    console.log('\nBenchmark audit complete.');
    console.log(`Success: ${this.report.success}`);
    console.log(`Exit Code: ${this.report.exitCode}`);
  }

  /**
   * Parser la sortie de benchmarks
   */
  parseBenchmarkOutput(output) {
    // Parser les résultats de Vitest bench
    const lines = output.split('\n');
    for (const line of lines) {
      if (line.includes('benchmark') || line.includes('ops/sec')) {
        this.report.benchmarks.push(line);
      }
    }
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
    
    const outputPath = join(outputDir, 'benchmark-report.json');
    writeFileSync(outputPath, JSON.stringify(this.report, null, 2), 'utf-8');
    console.log(`\nReport saved to ${outputPath}`);
  }
}

// Exécution
const rootPath = process.argv[2] || process.cwd();
const auditor = new BenchmarkAuditor(rootPath);
auditor.benchmark();
