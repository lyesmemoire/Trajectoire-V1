#!/usr/bin/env node

/**
 * Blueprint V3 Enterprise Build Audit
 * PHASE 3: Compilation
 */

const { execSync } = require('child_process');
const { writeFileSync, existsSync, mkdirSync } = require('fs');
const { join } = require('path');

class BuildAuditor {
  constructor(rootPath) {
    this.rootPath = rootPath;
    this.report = {
      timestamp: new Date().toISOString(),
      commands: [],
      compilerVersions: {},
      elapsedTimes: {},
      warnings: [],
      errors: [],
      fixesApplied: [],
      success: false,
      exitCode: 0,
    };
  }

  /**
   * Exécuter la compilation
   */
  async build() {
    console.log('Starting build audit...\n');

    try {
      // Vérifier pnpm
      console.log('Checking pnpm version...');
      const pnpmVersion = this.exec('pnpm --version');
      this.report.compilerVersions.pnpm = pnpmVersion.trim();
      console.log(`pnpm version: ${pnpmVersion.trim()}`);

      // Vérifier Node version
      console.log('Checking Node version...');
      const nodeVersion = this.exec('node --version');
      this.report.compilerVersions.node = nodeVersion.trim();
      console.log(`Node version: ${nodeVersion.trim()}`);

      // Installer les dépendances
      console.log('\nInstalling dependencies...');
      const startTime = Date.now();
      this.report.commands.push('pnpm install');
      
      try {
        this.exec('pnpm install', { stdio: 'pipe' });
        this.report.elapsedTimes.install = Date.now() - startTime;
        console.log(`Dependencies installed in ${this.report.elapsedTimes.install}ms`);
      } catch (error) {
        this.report.errors.push(`pnpm install failed: ${error.message}`);
        this.report.exitCode = 1;
        this.saveReport();
        throw error;
      }

      // Type check
      console.log('\nRunning type check...');
      const typeCheckStart = Date.now();
      this.report.commands.push('pnpm type-check');
      
      try {
        this.exec('pnpm type-check', { stdio: 'pipe' });
        this.report.elapsedTimes.typeCheck = Date.now() - typeCheckStart;
        console.log(`Type check passed in ${this.report.elapsedTimes.typeCheck}ms`);
      } catch (error) {
        this.report.warnings.push(`Type check warnings: ${error.message}`);
        console.log(`Type check warnings: ${error.message}`);
      }

      // Build
      console.log('\nBuilding project...');
      const buildStart = Date.now();
      this.report.commands.push('pnpm build');
      
      try {
        this.exec('pnpm build', { stdio: 'pipe' });
        this.report.elapsedTimes.build = Date.now() - buildStart;
        console.log(`Build succeeded in ${this.report.elapsedTimes.build}ms`);
        this.report.success = true;
        this.report.exitCode = 0;
      } catch (error) {
        this.report.errors.push(`Build failed: ${error.message}`);
        this.report.exitCode = 1;
        console.log(`Build failed: ${error.message}`);
      }

    } catch (error) {
      this.report.errors.push(`Build error: ${error.message}`);
      this.report.exitCode = 1;
      this.report.success = false;
    }

    this.saveReport();
    console.log('\nBuild audit complete.');
    console.log(`Success: ${this.report.success}`);
    console.log(`Exit Code: ${this.report.exitCode}`);
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
    
    const outputPath = join(outputDir, 'build-report.json');
    writeFileSync(outputPath, JSON.stringify(this.report, null, 2), 'utf-8');
    console.log(`\nReport saved to ${outputPath}`);
  }
}

// Exécution
const rootPath = process.argv[2] || process.cwd();
const auditor = new BuildAuditor(rootPath);
auditor.build();
