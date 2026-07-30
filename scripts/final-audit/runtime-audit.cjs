#!/usr/bin/env node

/**
 * Blueprint V3 Enterprise Runtime Validation
 * PHASE 14: Executable Platform Validation
 */

const { execSync } = require('child_process');
const { writeFileSync, existsSync, mkdirSync } = require('fs');
const { join } = require('path');

class RuntimeAuditor {
  constructor(rootPath) {
    this.rootPath = rootPath;
    this.report = {
      timestamp: new Date().toISOString(),
      commands: [],
      elapsedTimes: {},
      executionLogs: [],
      errors: [],
      success: false,
      exitCode: 0,
    };
  }

  /**
   * Exécuter la validation runtime
   */
  async validate() {
    console.log('Starting runtime validation...\n');

    try {
      // Exécuter le runtime harness pour démontrer l'exécution
      console.log('Running runtime harness...');
      const startTime = Date.now();
      this.report.commands.push('pnpm tsx scripts/runtime-harness.ts');
      
      try {
        const output = this.exec('pnpm tsx scripts/runtime-harness.ts', { stdio: 'pipe' });
        this.report.elapsedTimes.runtime = Date.now() - startTime;
        console.log(`Runtime execution completed in ${this.report.elapsedTimes.runtime}ms`);
        console.log(output);
        
        this.report.executionLogs.push(output);
        this.report.success = true;
        this.report.exitCode = 0;
      } catch (error) {
        this.report.errors.push(`Runtime execution failed: ${error.message}`);
        this.report.exitCode = 1;
        console.log(`Runtime execution failed: ${error.message}`);
        
        // Enregistrer les logs même en cas d'échec
        this.report.executionLogs.push(error.stdout || error.stderr || '');
      }

      // Vérifier que les artifacts ont été générés
      console.log('\nChecking for generated artifacts...');
      this.checkArtifacts();

    } catch (error) {
      this.report.errors.push(`Runtime validation error: ${error.message}`);
      this.report.exitCode = 1;
      this.report.success = false;
    }

    this.saveReport();
    console.log('\nRuntime validation complete.');
    console.log(`Success: ${this.report.success}`);
    console.log(`Exit Code: ${this.report.exitCode}`);
    console.log(`Execution logs: ${this.report.executionLogs.length}`);
  }

  /**
   * Vérifier les artifacts générés
   */
  checkArtifacts() {
    const artifactsDir = join(this.rootPath, 'artifacts');
    if (existsSync(artifactsDir)) {
      console.log('Artifacts directory found');
      this.report.artifactsGenerated = true;
    } else {
      console.log('Artifacts directory not found');
      this.report.artifactsGenerated = false;
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
    
    const outputPath = join(outputDir, 'runtime-report.json');
    writeFileSync(outputPath, JSON.stringify(this.report, null, 2), 'utf-8');
    console.log(`\nReport saved to ${outputPath}`);
  }
}

// Exécution
const rootPath = process.argv[2] || process.cwd();
const auditor = new RuntimeAuditor(rootPath);
auditor.validate();
